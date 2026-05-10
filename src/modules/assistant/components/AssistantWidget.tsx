"use client";

import { MarkdownMessage } from "./MarkdownMessage";
import { useState } from "react";
import { useAssistant } from "../hooks/useAssistant";
import { ChatInput } from "./ChatInput";
import { FiX } from "react-icons/fi";
import { RiSparklingLine } from "react-icons/ri";

export function AssistantWidget() {
  const [isOpen, setisOpen] = useState(false);
  const { messages, send, streamingContent, isLoading } = useAssistant();

  return (
    <>
      <button
        type="button"
        onClick={() => setisOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-md transition hover:border-white/20 hover:bg-zinc-800/80"
      >
        {isOpen ? (
          <>
            <FiX size={16} />
            Close
          </>
        ) : (
          <>
            <RiSparklingLine size={16} className="text-sky-400" />
            Ask AI
            <span className="ml-1 rounded-full bg-sky-500/20 px-1.5 py-0.5 text-xs font-semibold text-sky-300">
              BETA
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 flex h-[480px] w-[28rem] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
            <RiSparklingLine size={16} className="text-sky-400" />
            <span className="text-sm font-semibold text-white">
              AI Assistant
            </span>
            <span className="ml-auto rounded-full bg-sky-500/20 px-1.5 py-0.5 text-xs font-semibold text-sky-300">
              BETA
            </span>
          </div>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb:hover]:bg-white/20">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-sky-500 text-white" : "bg-zinc-800 text-zinc-100"}`}
                  >
                    <MarkdownMessage content={msg.content} />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="mb-3 flex justify-start">
                  <div className="max-w-[80%] rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100">
                    {streamingContent ? (
                      <MarkdownMessage content={streamingContent} />
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
            </div>
            <ChatInput onSend={send} disabled={isLoading} />
          </div>
        </div>
      )}
    </>
  );
}
