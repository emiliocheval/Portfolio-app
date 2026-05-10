"use client";

import { useEffect, useState } from "react";
import { FiGithub, FiFileText } from "react-icons/fi";

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <span className="font-mono text-sm tabular-nums text-zinc-500">--:--:--</span>
    );
  }

  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");

  return (
    <span className="font-mono text-sm tabular-nums tracking-tight text-zinc-400">
      {h}:{m}:{s}
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-md focus:bg-cyan-500 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <LiveClock />
        <nav className="flex items-center gap-6">
          <a
            href="/Emil_Conradsson_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-base font-medium text-zinc-300 transition-colors hover:text-white"
          >
            <FiFileText size={17} />
            Resume
          </a>
          <a
            href="https://github.com/emiliocheval"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-base font-medium text-zinc-300 transition-colors hover:text-white"
            aria-label="GitHub"
          >
            <FiGithub size={17} />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
