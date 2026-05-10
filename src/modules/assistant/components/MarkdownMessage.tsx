import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface MarkdownMessageProps {
  content: string;
}

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  h1: ({ children }) => (
    <h1 className="mb-1 mt-3 text-base font-bold text-white">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-1 mt-3 text-base font-bold text-white">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-2 text-sm font-bold text-white">{children}</h3>
  ),
  ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ children }) => (
    <code className="rounded bg-zinc-700 px-1 py-0.5 font-mono text-xs">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded bg-zinc-700 p-3 font-mono text-xs">
      {children}
    </pre>
  ),
};

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}
