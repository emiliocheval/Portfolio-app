import OpenAI from 'openai';
import type { LLMProvider, Message } from '../types';

export function createDeepSeekProvider(apiKey: string): LLMProvider {
  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
  });

  return {
    async stream(systemPrompt, messages, signal) {
      const response = await client.chat.completions.create(
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
          ],
          stream: true,
        },
        { signal },
      );

      return new ReadableStream<Uint8Array>({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of response) {
              const text = chunk.choices[0]?.delta?.content ?? '';
              if (text) controller.enqueue(encoder.encode(text));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
        cancel() {
          response.controller.abort();
        },
      });
    },
  };
}
