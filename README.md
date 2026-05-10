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

### Architecture

The module follows a strict layered architecture:

```
src/modules/assistant/
├── service/                    # Pure TypeScript — zero framework dependencies
│   ├── types.ts                # All interfaces and discriminated unions
│   ├── scope-config.ts         # Allowed topics, blocked patterns, system prompt
│   ├── assistant-service.ts    # Orchestrator — wires filter + provider
│   ├── guardrails/
│   │   └── intent-filter.ts    # Three-layer scope enforcement
│   └── providers/
│       └── deepseek.ts         # DeepSeek implementation of LLMProvider
├── components/
│   ├── AssistantWidget.tsx     # Floating chat UI
│   ├── ChatInput.tsx           # Controlled input with keyboard handling
│   └── MarkdownMessage.tsx     # Renders markdown responses
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
        ├── trim history to maxHistoryTurns
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

### Intent filter — three layers

The guardrail runs **before** any LLM call. Off-topic messages are rejected instantly with no API cost.

**Layer 0 — Structural validation**
Rejects empty messages and messages over 500 characters.

**Layer 1 — Blocked pattern matching**
A list of regexes that hard-reject known off-topic patterns (e.g. "write me code", "debug this", profanity).

**Layer 2 — Topic allowlist**
Checks that at least one keyword from an allowed topics list appears in the message. Short messages (≤4 words) bypass this layer to allow greetings.

**Layer 3 — System prompt (model-level)**
Even if the static filter passes an edge case, the model is instructed via system prompt to refuse anything outside the portfolio scope. This acts as a final catch.

### Provider abstraction

The `LLMProvider` interface defines a single contract:

```ts
interface LLMProvider {
  stream(
    systemPrompt: string,
    messages: Message[],
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>>;
}
```

The DeepSeek implementation satisfies this interface. Swapping to Anthropic, OpenAI, or any other provider means writing one new file in `providers/` — nothing else in the codebase changes.

### Streaming

The response streams token by token using the Web `ReadableStream` API. The Route Handler returns a raw `Response` wrapping the stream. The `useAssistant` hook reads it via `getReader()`, appending chunks to state on each tick. The UI re-renders incrementally as tokens arrive, giving the ChatGPT-style typing effect.

### Cancellation

An `AbortController` is held in a ref inside `useAssistant`. If the user sends a new message before the previous response finishes, the in-flight request is aborted and the DeepSeek stream is cancelled server-side via `AbortSignal`.

### Markdown rendering

DeepSeek responses are markdown. `react-markdown` parses them with a custom `components` map that applies Tailwind styles per element type — paragraphs, headings, lists, inline code, code blocks.

### Key decisions

| Decision | Reasoning |
|---|---|
| Service layer has no framework deps | Makes it unit-testable without Next.js |
| Provider as a factory function | API key injected at call site, not hardcoded |
| Discriminated union for `AssistantResult` | Exhaustive type checking on every code path |
| Intent filter before LLM call | Prevents wasted API calls on off-topic messages |
| Lazy service init in route handler | Avoids build-time SDK instantiation errors |
| `history` required (not optional) | Callers always manage history — service stays stateless |

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
    └── assistant/              # Self-contained AI module
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```
