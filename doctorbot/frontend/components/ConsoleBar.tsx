"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getQuote } from "@/lib/api";
import { useChat } from "@/context/ChatContext";

const RANDOM_TOPICS = [
  "Tell me about the time war",
  "What's your favorite planet?",
  "explain how the TARDIS works",
  "What do you think about daleks?",
  "Tell me about your companions",
  "What's the most dangerous thing in the universe?",
  "explain time travel paradoxes",
  "What happened on Trenzalore?",
];

interface ConsoleBarProps {
  onSonic?: () => void;
}

export default function ConsoleBar({ onSonic }: ConsoleBarProps) {
  const { send, isLoading } = useChat();
  const [quoteText, setQuoteText] = useState<string | null>(null);
  const [scanActive, setScanActive] = useState(false);

  const handleWibblyLever = async () => {
    const data = await getQuote();
    setQuoteText(`"${data.quote}" — ${data.doctor} Doctor`);
    setTimeout(() => setQuoteText(null), 5000);
  };

  const handleSonic = () => {
    setScanActive(true);
    if (onSonic) onSonic();
    setTimeout(() => setScanActive(false), 1500);
  };

  const handleRandomizer = () => {
    if (isLoading) return;
    const topic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    send(topic);
  };

  return (
    <div className="w-full max-w-[780px] mx-auto mt-4">
      {/* Quote display */}
      <AnimatePresence>
        {quoteText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center mb-3 px-6 overflow-hidden"
          >
            <p className="text-[0.8rem] italic text-[var(--amber-dim)] leading-relaxed">
              {quoteText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan overlay */}
      <AnimatePresence>
        {scanActive && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(57,217,138,0.12) 50%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Console buttons */}
      <div className="flex items-center justify-center gap-6">
        {/* Divider line left */}
        <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent to-[var(--amber-dim)]/20" />

        <button
          onClick={handleWibblyLever}
          className="font-display text-[0.6rem] tracking-[0.12em] uppercase px-4 py-2 border transition-all duration-200 hover:shadow-[0_0_12px_rgba(212,165,116,0.1)]"
          style={{
            borderColor: "rgba(212,165,116,0.2)",
            color: "var(--amber-dim)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--amber)";
            e.currentTarget.style.color = "var(--amber)";
            e.currentTarget.style.background = "rgba(212,165,116,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,165,116,0.2)";
            e.currentTarget.style.color = "var(--amber-dim)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Wibbly Lever
        </button>

        <button
          onClick={handleSonic}
          className="font-display text-[0.6rem] tracking-[0.12em] uppercase px-4 py-2 border transition-all duration-200 hover:shadow-[0_0_12px_rgba(57,217,138,0.15)]"
          style={{
            borderColor: "rgba(57,217,138,0.2)",
            color: "var(--sonic-dim)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--sonic-green)";
            e.currentTarget.style.color = "var(--sonic-green)";
            e.currentTarget.style.background = "rgba(57,217,138,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(57,217,138,0.2)";
            e.currentTarget.style.color = "var(--sonic-dim)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Sonic
        </button>

        <button
          onClick={handleRandomizer}
          disabled={isLoading}
          className="font-display text-[0.6rem] tracking-[0.12em] uppercase px-4 py-2 border transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:shadow-[0_0_12px_rgba(184,115,51,0.15)]"
          style={{
            borderColor: "rgba(184,115,51,0.2)",
            color: "rgba(184,115,51,0.6)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = "var(--copper)";
              e.currentTarget.style.color = "var(--copper)";
              e.currentTarget.style.background = "rgba(184,115,51,0.05)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(184,115,51,0.2)";
            e.currentTarget.style.color = "rgba(184,115,51,0.6)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Randomizer
        </button>

        {/* Divider line right */}
        <div className="hidden sm:block flex-1 h-px bg-gradient-to-l from-transparent to-[var(--amber-dim)]/20" />
      </div>
    </div>
  );
}
