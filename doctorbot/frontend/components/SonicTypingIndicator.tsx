"use client";

import { motion } from "framer-motion";

export default function SonicTypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div
        className="px-4 py-3"
        style={{
          borderLeft: "2px solid var(--amber-dim)",
          background: "linear-gradient(135deg, rgba(212,165,116,0.04) 0%, transparent 100%)",
        }}
      >
        <span
          className="font-display text-[0.55rem] tracking-[0.15em] uppercase block mb-2"
          style={{ color: "var(--amber-dim)" }}
        >
          The Doctor
        </span>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--sonic-green)" }}
              animate={{
                opacity: [0.2, 1, 0.2],
                boxShadow: [
                  "0 0 0px rgba(57,217,138,0)",
                  "0 0 8px rgba(57,217,138,0.6)",
                  "0 0 0px rgba(57,217,138,0)",
                ],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            />
          ))}
          <span className="text-[0.6rem] text-[var(--text-muted)] italic ml-1">
            processing
          </span>
        </div>
      </div>
    </div>
  );
}
