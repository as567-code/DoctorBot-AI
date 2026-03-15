"use client";

import { useRef, useEffect, useState, KeyboardEvent } from "react";
import { useChat } from "@/context/ChatContext";
import MessageBubble from "./MessageBubble";
import SonicTypingIndicator from "./SonicTypingIndicator";

export default function ChatWindow() {
  const { messages, isLoading, send, clearHistory } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await send(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="w-full max-w-[780px] mx-auto flex flex-col overflow-hidden"
      style={{
        height: "62vh",
        background: "linear-gradient(180deg, rgba(11,18,33,0.85) 0%, rgba(7,11,20,0.95) 100%)",
        border: "1px solid rgba(212,165,116,0.1)",
      }}
    >
      {/* Header bar — console display style */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{
          borderBottom: "1px solid rgba(212,165,116,0.1)",
          background: "rgba(212,165,116,0.03)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Status dots */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--sonic-green)",
                boxShadow: "0 0 4px var(--sonic-green)",
              }}
            />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--amber-dim)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--amber-dim)", opacity: 0.4 }} />
          </div>
          <span className="font-display text-[0.6rem] tracking-[0.15em] uppercase text-[var(--amber-dim)]">
            TARDIS Comm Channel
          </span>
        </div>
        <button
          onClick={clearHistory}
          className="font-display text-[0.55rem] tracking-[0.1em] uppercase text-[var(--text-muted)] hover:text-[var(--amber)] transition-colors duration-200"
        >
          Clear
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[var(--amber-dim)] to-transparent" />
            <p className="text-sm italic text-[var(--text-muted)]">
              Awaiting transmission...
            </p>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[var(--amber-dim)] to-transparent" />
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <SonicTypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="px-4 py-3"
        style={{
          borderTop: "1px solid rgba(212,165,116,0.1)",
          background: "rgba(7,11,20,0.6)",
        }}
      >
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Speak to The Doctor..."
              disabled={isLoading}
              className="w-full bg-transparent border-b border-[var(--amber-dim)]/30 focus:border-[var(--amber)]/60 px-1 py-2 text-[0.9rem] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 placeholder:italic focus:outline-none disabled:opacity-40 transition-colors"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="font-display text-[0.65rem] tracking-[0.12em] uppercase px-5 py-2 border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: "var(--amber-dim)",
              color: "var(--amber)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212,165,116,0.1)";
              e.currentTarget.style.borderColor = "var(--amber)";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(212,165,116,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--amber-dim)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Transmit
          </button>
        </div>
      </div>
    </div>
  );
}
