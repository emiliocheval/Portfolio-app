"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useGitHubChat } from "../hooks/useGitHubChat";

const SUGGESTED = [
  "What repos has Emil built?",
  "What languages does he use most?",
  "Show me his most recent commits",
  "Tell me about his most starred project",
];

export function GitHubExplorer() {
  const { messages, streamingContent, isLoading, error, send } = useGitHubChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    send(trimmed);
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-white">GitHub Explorer</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
            MCP
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          Ask about Emil&apos;s repositories, languages, or recent work. Powered by live GitHub data
          via the Model Context Protocol.
        </p>
      </div>

      {/* Chat window */}
      <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="ml-4 list-disc">{children}</ul>,
                    li: ({ children }) => <li className="mb-0.5">{children}</li>,
                    code: ({ children }) => (
                      <code className="rounded bg-zinc-700 px-1 py-0.5 text-xs">{children}</code>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 underline"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mb-3 flex justify-start">
              <div className="max-w-[85%] rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100">
                {streamingContent ? (
                  <ReactMarkdown>{streamingContent}</ReactMarkdown>
                ) : (
                  <span className="flex gap-1">
                    <span className="animate-bounce [animation-delay:0ms]">•</span>
                    <span className="animate-bounce [animation-delay:150ms]">•</span>
                    <span className="animate-bounce [animation-delay:300ms]">•</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="text-center text-xs text-red-400">{error}</p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts — only shown before any user message */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 border-t border-zinc-800 px-4 py-3">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => submit(q)}
                disabled={isLoading}
                className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition hover:border-emerald-500/50 hover:text-emerald-400 disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); submit(input); }}
          className="flex items-end gap-2 border-t border-zinc-800 p-3"
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            disabled={isLoading}
            placeholder="Ask about Emil's GitHub..."
            className="flex-1 resize-none rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-40"
          >
            ↑
          </button>
        </form>
      </div>
    </section>
  );
}
