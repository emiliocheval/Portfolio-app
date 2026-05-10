"use client";

import { useState } from "react";
import { useAssistant } from "../hooks/useAssistant";
import { ChatInput } from "./ChatInput";

export function AssistantWidget() {
  // blocks 2-5 go here
  const [isOpen, setisOpen] = useState(false);
  const { messages, send, streamingContent, error, isLoading } = useAssistant();

  return (
    <>
      <button
        type="button"
        onClick={() => setisOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 px-4 py-2 text-white"
      >
        {isOpen ? "Close Assistant" : "Open Assistant"}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 w-[28rem] sm:w-[32rem] h-[480px] flex flex-col flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md shadow-2xl">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb:hover]:bg-white/20">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-100"}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <ChatInput onSend={send} disabled={isLoading} />
          </div>
        </div>
      )}
    </>
  );
}
