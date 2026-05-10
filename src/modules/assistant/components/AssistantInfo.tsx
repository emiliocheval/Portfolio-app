"use client";

import { FiX } from "react-icons/fi";

interface AssistantInfoProps {
  onClose: () => void;
}

export function AssistantInfo({ onClose }: AssistantInfoProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl">

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

        <div className="flex flex-col gap-6 overflow-y-auto p-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">

          <p className="text-sm leading-relaxed text-zinc-400">
            This assistant was built from scratch as a fully isolated module — not a third-party widget. It uses the same architectural patterns you&apos;d find in a production system: layered guardrails, a swappable provider interface, server-side streaming, and strict module boundaries.
          </p>

          <Section title="Four-layer guardrail system">
            Every message is validated before any API call is made — off-topic messages are rejected instantly at zero cost.
            <List items={[
              "Structural — rejects empty messages or anything over 500 characters",
              "Pattern matching — regex blocklist for code generation requests, debugging, and explicit content",
              "Topic allowlist — message must contain at least one portfolio-related keyword",
              "System prompt — the model itself is instructed to refuse out-of-scope questions and ignore prompt injection attempts",
            ]} />
          </Section>

          <Section title="Provider abstraction">
            The AI layer sits behind a <Code>LLMProvider</Code> interface with a single <Code>stream()</Code> method. The current implementation uses DeepSeek via an OpenAI-compatible SDK — chosen for cost efficiency and easy swappability. Switching to Anthropic or OpenAI means writing one new file. Nothing else changes.
          </Section>

          <Section title="Streaming">
            Responses stream token by token using the Web ReadableStream API. The Route Handler returns a raw streaming <Code>Response</Code>. The <Code>useAssistant</Code> hook reads chunks via <Code>getReader()</Code> and appends them to state on each tick — the same pattern used by ChatGPT. An <Code>AbortController</Code> cancels in-flight requests when a new message is sent.
          </Section>

          <Section title="Module boundaries">
            The <Code>service/</Code> layer has zero imports from React or Next.js — pure TypeScript, independently testable. The only integration point between the module and the framework is a single Route Handler at <Code>/api/assistant</Code>. The UI never calls the service directly.
          </Section>

          <Section title="Markdown rendering">
            DeepSeek responses are markdown. <Code>react-markdown</Code> parses them with a custom component map that applies styles per element — paragraphs, headings, bullet lists, inline code, and code blocks all render correctly.
          </Section>

          <Section title="What's intentionally omitted">
            Rate limiting is not implemented — for a portfolio this is acceptable. In production it would sit at the Route Handler layer, keyed on IP or session, before the intent filter runs.
          </Section>

          <Section title="Tech used">
            <List items={[
              "Next.js 16 App Router — Route Handler as the single API boundary",
              "DeepSeek — LLM via OpenAI-compatible API",
              "TypeScript discriminated unions — typed result on every code path",
              "AbortController — stream cancellation on new message",
              "react-markdown — structured markdown rendering",
              "Framer Motion — UI animations",
            ]} />
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
