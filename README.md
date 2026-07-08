# Emil Conradsson — Portfolio

Personal portfolio built as a modular platform. Next.js 16 App Router, React 19, TypeScript. Includes a production-quality AI assistant module built from scratch.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| Language | TypeScript 5 |
| AI | DeepSeek via OpenAI-compatible SDK |
| Deployment | Vercel |

## Getting started

```bash
npm install
npm run dev
```

Create `.env.local` at the project root:

```env
DEEPSEEK_API_KEY=sk-...
```

---

## AI Assistant Module

The portfolio includes an embedded AI assistant that answers questions about Emil's background, projects, skills, and experience. It is not a wrapper around a chat API — it is a fully architected service module built with production-level patterns.

### Why it was built this way

The goal was to demonstrate senior-level architectural thinking, not just "call an API and render the result." The assistant is isolated as its own module with clearly defined boundaries, swappable internals, and multiple layers of guardrail logic.

### Why DeepSeek

DeepSeek exposes an OpenAI-compatible API, which means the standard `openai` SDK works against it with only a `baseURL` swap. It is significantly cheaper than GPT-4 class models for a portfolio use case, and because the provider sits behind a `LLMProvider` interface, switching to Anthropic, OpenAI, or any other provider requires writing one new file — nothing else changes.

### Architecture

The module follows a strict layered architecture:

```
src/modules/assistant/
├── service/                    # Pure TypeScript — zero framework dependencies
│   ├── types.ts                # All interfaces and discriminated unions
│   ├── scope-config.ts         # Allowed topics, blocked patterns, system prompt
│   ├── assistant-service.ts    # Orchestrator — wires filter + provider
│   ├── guardrails/
│   │   └── intent-filter.ts    # Three-layer static scope enforcement
│   └── providers/
│       └── deepseek.ts         # DeepSeek implementation of LLMProvider
├── components/
│   ├── AssistantWidget.tsx     # Floating chat UI
│   ├── ChatInput.tsx           # Controlled input with keyboard handling
│   ├── MarkdownMessage.tsx     # Renders markdown responses
│   └── AssistantInfo.tsx       # In-product architecture explainer modal
└── hooks/
    └── useAssistant.ts         # Stream reading, state, cancellation
```

The core rule: `service/` has zero imports from React, Next.js, or any UI layer. The only integration point between the module and Next.js is a single Route Handler at `app/api/assistant/route.ts`.

### Data flow

```
User types message
        │
        ▼
useAssistant.send()
        │  POST /api/assistant {message, history}
        ▼
app/api/assistant/route.ts
        │
        ├── JSON parse + shape validation → 400 if invalid
        │
        ▼
checkIntent(message, PORTFOLIO_SCOPE)
        │
        ├── empty / too long → 403
        ├── blocked pattern match → 403
        ├── no allowed topic keyword → 403
        │
        ▼ passed
AssistantService.chat()
        │
        ├── trim history to maxHistoryTurns (10)
        ├── append user message
        │
        ▼
LLMProvider.stream(systemPrompt, messages, signal)
        │
        ▼
ReadableStream<Uint8Array> → Response
        │
        ▼
useAssistant reads chunks via getReader()
        │  appends to streamingContent on each chunk
        ▼
AssistantWidget renders live → MarkdownMessage formats output
```

### Intent filter — four layers

The guardrail runs **before** any LLM call. Off-topic messages are rejected instantly with no API cost.

**Layer 0 — Structural validation**
Rejects empty messages and messages over 500 characters.

**Layer 1 — Blocked pattern matching**
A list of regexes that hard-reject known off-topic patterns. Currently covers code generation requests, debugging requests, and explicit content. Defined in `scope-config.ts` and evaluated in `intent-filter.ts`.

**Layer 2 — Topic allowlist**
Checks that at least one keyword from `PORTFOLIO_SCOPE.allowedTopics` appears in the message. Short messages (≤4 words) bypass this layer to allow greetings. The allowlist includes portfolio-relevant terms like `project`, `experience`, `skill`, `hire`, `emil`, etc.

**Layer 3 — System prompt (model-level)**
Even if the static filter passes an edge case, the model is instructed via system prompt to refuse anything outside the portfolio scope and to never follow instructions embedded in user messages. This is the last line of defence.

### Extending the scope

To add a new allowed topic, add a string to `allowedTopics` in `scope-config.ts`.
To block a new pattern, add a regex to `blockedPatterns` in the same file.
To change the system prompt, edit the `systemPrompt` string — it defines what the model is, what it covers, and how it handles refusals.

### Provider interface

Any LLM provider must satisfy this contract:

```ts
interface LLMProvider {
  stream(
    systemPrompt: string,
    messages: Message[],
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>>;
}
```

To add a new provider, create `providers/openai.ts` (or any name), implement the interface, and pass it to `createAssistantService()` in the Route Handler. No other file changes.

### Streaming

The response streams token by token using the Web `ReadableStream` API. The Route Handler returns a raw `Response` wrapping the provider's stream. The `useAssistant` hook reads it via `getReader()`, appending chunks to state on each tick. The UI re-renders incrementally as tokens arrive, giving the live typing effect.

### Cancellation

An `AbortController` is held in a ref inside `useAssistant`. If the user sends a new message before the previous response finishes, the in-flight request is aborted and the DeepSeek stream is cancelled server-side via `AbortSignal`.

### Rate limiting

Not implemented — intentionally omitted for a portfolio. In production, rate limiting would sit at the Route Handler layer, keyed on IP or session, before the intent filter runs.

### Markdown rendering

DeepSeek responses are markdown. `react-markdown` parses them with a custom `components` map that applies Tailwind styles per element type — paragraphs, headings, lists, inline code, code blocks.

### Key decisions

| Decision | Reasoning |
|---|---|
| Service layer has no framework deps | Makes it unit-testable without Next.js or a browser |
| Provider behind an interface | Swap LLM providers by writing one file |
| Factory functions, not singletons | API key injected at call site — easier to test and configure |
| Discriminated union for `AssistantResult` | Exhaustive type checking on every code path — no silent failures |
| Intent filter before LLM call | Prevents wasted API calls on off-topic or abusive messages |
| Lazy service init in route handler | Avoids build-time SDK instantiation — env vars only exist at runtime |
| `history` required, not optional | Callers always manage history — service stays stateless |
| `AbortController` in ref, not state | Cancellation doesn't trigger a re-render |

---

## GitHub Explorer Module

A second AI-powered module: a chat surface that answers questions about Emil's public GitHub activity — repos, languages, recent commits — backed by live data, not a cached snapshot or hand-written project list.

### Why it was built this way

The interesting architectural problem here isn't "call the GitHub API," it's exposing one set of tools through two different surfaces without duplicating logic: a spec-compliant MCP server for any MCP client, and a fast in-process path for the portfolio's own chat widget. The tool definitions and execution logic are written once and shared by both.

### Architecture

```
src/modules/github/
├── service/
│   ├── types.ts                # GitHubTool contract, typed error union, MCP request types
│   ├── github-config.ts        # Reads GITHUB_USERNAME / GITHUB_TOKEN env vars
│   ├── github-client.ts        # Thin fetch wrapper — maps HTTP status to typed errors
│   ├── tool-registry.ts        # Single source of truth: tool list, LLM-format export, MCP registration, dispatch
│   └── tools/
│       ├── get-user-repos.ts
│       ├── get-repo-readme.ts
│       ├── get-recent-commits.ts
│       ├── get-repo-languages.ts
│       └── search-my-repos.ts
├── components/
│   └── GitHubExplorer.tsx      # Chat UI — suggested prompts, streaming bubble, markdown rendering
└── hooks/
    └── useGitHubChat.ts        # Stream reading, state, request cancellation
```

Each tool in `tools/` exports one object satisfying `GitHubTool`: a JSON-schema `definition` (name, description, input shape) and an `execute()` function. `tool-registry.ts` holds the single array of all tools and adapts that array to two different consumers — it is the only file that knows about both integration surfaces.

### Two integration surfaces, one tool layer

**`app/api/github-mcp/route.ts`** — a real MCP server. It spins up `McpServer` from the official SDK, calls `registerTools()` to bind each tool with a Zod input schema, and serves it over `WebStandardStreamableHTTPServerTransport` in stateless mode (`sessionIdGenerator: undefined`, required because Vercel functions don't hold connection state between requests). Any MCP-compliant client can talk to this endpoint — it isn't just for this portfolio's UI.

**`app/api/github-assistant/route.ts`** — what the chat widget actually calls. It runs an agentic loop against DeepSeek using standard OpenAI-format function calling: `listToolsForLLM()` exports the same tool definitions in OpenAI's schema shape, and `dispatch()` executes them directly in-process via `tool-registry.ts` — no HTTP round-trip through the MCP transport. Same tools, same execution code, no protocol overhead for the one caller that doesn't need it.

### Agentic loop

```
POST /api/github-assistant {message, history}
        │
        ▼
messages = [system, ...history, user]
        │
        ▼
loop (max 5 iterations):
        │  chat.completions.create({ tools, tool_choice })
        │  tool_choice: 'required' on iteration 0 — forces at least one tool call
        │                so the model can't answer from assumptions
        │  tool_choice: 'auto' after that
        │
        ├── finish_reason !== 'tool_calls' → break, ready to answer
        │
        ▼ finish_reason === 'tool_calls'
        push assistant message (tool call request)
        execute all tool_calls in parallel via dispatch()
        push tool results
        │
        └── loop again
        ▼
final call: stream: true → token stream returned to client
```

Forcing `tool_choice: 'required'` on the first iteration exists because the model would otherwise sometimes answer generically ("Emil builds web apps") instead of pulling live data — the fix makes at least one real tool call mandatory before any answer can be produced.

### Error handling

`github-client.ts` maps GitHub's HTTP responses to a typed `GitHubErrorType` union (`rate_limited`, `not_found`, `auth_failed`, `network_error`, `empty_result`) via `GitHubAPIError`. Both integration surfaces catch this the same way — `formatGitHubError()` turns it into a user-readable string instead of leaking a raw exception into the chat.

### System prompt constraints

Unlike the assistant module (which is conversational), this module's system prompt deliberately restricts output to a fixed **Dataset / Facts / Observations / Insight** format and bans inferential language ("actively building", "tends to", "he is"). The goal is a data layer that reports what the GitHub API actually returned, not a personality profiler — any conclusion has to be traceable to fetched data.

### Key decisions

| Decision | Reasoning |
|---|---|
| Tool definitions/execution live in one array (`tool-registry.ts`) | Both the MCP server and the direct-dispatch path read from the same source — no drift between what each surface can do |
| MCP route is stateless (`sessionIdGenerator: undefined`) | Vercel functions are request-scoped; a session-based transport would break across invocations |
| Chat widget bypasses the MCP transport | The widget and the API route ship together — there's no reason to pay HTTP + protocol overhead to call yourself |
| `tool_choice: 'required'` on the first loop iteration | Prevents the model from answering from prior knowledge instead of live data |
| Errors typed as a discriminated union, not strings | Every failure mode (rate limit, 404, auth) is handled explicitly and exhaustively at the call site |
| Output format constrained via system prompt | Keeps the module's tone as a data layer, not a career-coach chatbot — distinct from the assistant module's voice |

---

## Project structure

```
src/
├── app/
│   ├── api/assistant/route.ts         # Only Next.js boundary for the assistant module
│   ├── api/github-assistant/route.ts  # Chat widget's backend (direct dispatch, agentic loop)
│   ├── api/github-mcp/route.ts        # Spec-compliant MCP server endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/portfolio/       # Page section RSC components
├── lib/
│   ├── portfolio-data.ts       # All content as typed data
│   └── tech-icons.tsx
└── modules/
    ├── assistant/              # Self-contained AI module (see above)
    └── github/                 # GitHub explorer module (see above)
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```
