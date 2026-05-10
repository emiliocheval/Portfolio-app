"use client";

import { FiX } from "react-icons/fi";

interface AssistantInfoProps {
  onClose: () => void;
}

export function AssistantInfo({ onClose }: AssistantInfoProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div className="relative z-10 flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl">

        {/* header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-base font-bold text-white">How this AI assistant works</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition hover:border-zinc-500 hover:text-white"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* content */}
        <div className="flex flex-col gap-6 overflow-y-auto p-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">

          <p className="text-sm leading-relaxed text-zinc-400">
            This assistant is not a third-party widget. It was built from scratch as a fully isolated module inside this portfolio — designed with the same architectural patterns used in production systems.
          </p>

          <Section title="What it does">
            Answers questions about Emil&apos;s background, projects, skills, and experience. Questions outside that scope are filtered before they ever reach the AI model.
          </Section>

          <Section title="Three-layer guardrail system">
            Every message passes through an intent filter before any API call is made:
            <List items={[
              "Structural — rejects empty or oversized messages",
              "Pattern matching — blocks off-topic keywords and phrases via regex",
              "Topic allowlist — requires at least one portfolio-related keyword",
            ]} />
            A fourth guardrail lives inside the model itself — the system prompt instructs it to refuse anything outside scope even if the static filter passes.
          </Section>

          <Section title="Streaming responses">
            Responses stream token by token using the Web ReadableStream API. The Route Handler returns a raw streaming Response. The UI reads chunks via <Code>getReader()</Code> and appends them to state on each tick — the same pattern used by ChatGPT.
          </Section>

          <Section title="Provider abstraction">
            The AI layer sits behind an <Code>LLMProvider</Code> interface. The current implementation uses DeepSeek via an OpenAI-compatible SDK. Swapping to a different model means writing one new file — nothing else in the codebase changes.
          </Section>

          <Section title="Tech used">
            <List items={[
              "Next.js 16 App Router — Route Handler as the only API boundary",
              "DeepSeek — LLM provider via OpenAI-compatible API",
              "TypeScript discriminated unions — typed result on every code path",
              "AbortController — cancels in-flight requests on new message",
              "react-markdown — formats model output as structured HTML",
            ]} />
          </Section>

          <Section title="Module boundaries">
            The service layer has zero imports from React or Next.js. It is pure TypeScript — independently testable and fully decoupled from the UI. The only integration point is a single Route Handler at <Code>/api/assistant</Code>.
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
      <div className="text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-1 shrink-0 text-sky-400">▹</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs text-sky-300">
      {children}
    </code>
  );
}
