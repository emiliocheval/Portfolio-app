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

## Project structure

```
src/
├── app/
│   ├── api/assistant/route.ts  # Only Next.js boundary for the AI module
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/portfolio/       # Page section RSC components
├── lib/
│   ├── portfolio-data.ts       # All content as typed data
│   └── tech-icons.tsx
└── modules/
    └── assistant/              # Self-contained AI module (see above)
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```
