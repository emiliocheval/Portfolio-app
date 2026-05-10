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
        <div className="fixed bottom-20 right-6 z-50">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-4">
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
