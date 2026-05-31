"use client";

import { useState, useRef, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface GitHubChatState {
  messages: Message[];
  streamingContent: string;
  isLoading: boolean;
  error: string | null;
}

export function useGitHubChat() {
  const [state, setState] = useState<GitHubChatState>({
    messages: [
      {
        role: "assistant",
        content:
          "Ask me anything about Emil's GitHub — repos, languages, recent commits, or specific projects.",
      },
    ],
    streamingContent: "",
    isLoading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (content: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const userMessage: Message = { role: "user", content };

      setState((s) => ({
        ...s,
        messages: [...s.messages, userMessage],
        streamingContent: "",
        isLoading: true,
        error: null,
      }));

      try {
        const res = await fetch("/api/github-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            history: state.messages,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json();
          setState((s) => ({
            ...s,
            isLoading: false,
            error: data.error ?? "Something went wrong.",
          }));
          return;
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setState((s) => ({ ...s, streamingContent: accumulated }));
        }

        setState((s) => ({
          ...s,
          messages: [
            ...s.messages,
            { role: "assistant", content: accumulated },
          ],
          streamingContent: "",
          isLoading: false,
        }));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState((s) => ({
          ...s,
          isLoading: false,
          error: "Connection lost. Please try again.",
        }));
      }
    },
    [state.messages],
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setState((s) => ({
      ...s,
      messages: [
        {
          role: "assistant",
          content:
            "Ask me anything about Emil's GitHub — repos, languages, recent commits, or specific projects.",
        },
      ],
      streamingContent: "",
      isLoading: false,
      error: null,
    }));
  }, []);

  return { ...state, send, clear };
}
