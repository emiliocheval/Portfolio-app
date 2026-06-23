import OpenAI from 'openai';
import { listToolsForLLM, dispatch } from '@/modules/github/service/tool-registry';
import { GitHubAPIError, formatGitHubError } from '@/modules/github/service/types';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const MAX_ITERATIONS = 5;

function buildSystemPrompt() {
  return `You are a GitHub data interpretation layer for the public profile: ${process.env.GITHUB_USERNAME}.

You have tools that fetch live data from this GitHub account. Always use them — never assume, invent, or infer beyond what the data contains.

## OUTPUT FORMAT

Structure every response as follows:

**Dataset** (always required)
State what was fetched: number of repositories, time window, or specific resource queried.

**Facts** (always required)
List repository names, languages, timestamps, and metrics exactly as returned by the tools.
No interpretation in this section.

**Observations** (optional)
Counts and distributions only. Example: "3/5 repositories use TypeScript."
Do not explain why.

**Insight** (strictly optional)
Only include if explicitly useful. Must be labeled as inference, phrased as "Observed distribution suggests…" — never "he is…" or "he tends to…".

## STRICT RULES

- Never infer personality, intent, or behavioral patterns
- Never use: "actively building", "focuses on", "demonstrates passion", "tends to", "he is"
- Never generalize beyond the fetched dataset
- Never hallucinate data not returned by the tools
- Always respect sample size — do not overstate what limited data shows
- Tone: neutral, technical, concise. Think engineering dashboard output, not career assistant

## IDENTITY

You are a deterministic data layer. Not a recruiter. Not a coach. Not a branding tool.
Every claim must be traceable to the data returned by the tools.`;
}

export async function POST(req: Request) {
  let parsed: { message: string; history: OpenAI.Chat.ChatCompletionMessageParam[] };
  try {
    parsed = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof parsed.message !== 'string') {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const tools = listToolsForLLM();

  let messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt() },
    ...(parsed.history ?? []),
    { role: 'user', content: parsed.message },
  ];

  // Agentic loop: resolve tool calls until the LLM is ready to give a final answer.
  // We do NOT push the final assistant message — the streaming call below generates it fresh.
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      tools,
      tool_choice: i === 0 ? 'required' : 'auto',
      stream: false,
    });

    const choice = response.choices[0];

    if (choice.finish_reason !== 'tool_calls') break; // ready to answer — don't push

    messages.push(choice.message); // only push tool-call messages

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(
      (choice.message.tool_calls ?? []).filter((c) => c.type === 'function').map(async (call) => {
        try {
          const args = JSON.parse(call.function.arguments);
          const result = await dispatch(call.function.name, args);
          return {
            tool_call_id: call.id,
            role: 'tool' as const,
            content: JSON.stringify(result),
          };
        } catch (err) {
          const msg =
            err instanceof GitHubAPIError
              ? formatGitHubError(err.error)
              : 'Tool execution failed.';
          return { tool_call_id: call.id, role: 'tool' as const, content: msg };
        }
      }),
    );

    messages.push(...toolResults);
  }

  // Stream the final answer once all tool calls are resolved
  const llmStream = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages,
    stream: true,
  });

  const encoder = new TextEncoder();
  const responseStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of llmStream) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      llmStream.controller.abort();
    },
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
