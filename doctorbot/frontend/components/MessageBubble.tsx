"use client";

import { motion } from "framer-motion";
import { Message } from "@/lib/api";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isDoctor = message.role === "doctor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex ${isDoctor ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className="max-w-[80%] relative"
        style={{
          borderLeft: isDoctor ? "2px solid var(--amber-dim)" : "none",
          borderRight: isDoctor ? "none" : "2px solid rgba(57, 217, 138, 0.3)",
          padding: isDoctor ? "0.75rem 1rem 0.75rem 1rem" : "0.75rem 1rem",
          background: isDoctor
            ? "linear-gradient(135deg, rgba(212,165,116,0.06) 0%, rgba(11,18,33,0.4) 100%)"
            : "linear-gradient(135deg, rgba(57,217,138,0.06) 0%, rgba(11,18,33,0.4) 100%)",
        }}
      >
        {isDoctor && (
          <span
            className="font-display text-[0.55rem] tracking-[0.15em] uppercase block mb-1.5"
            style={{ color: "var(--amber-dim)" }}
          >
            The Doctor
          </span>
        )}
        {!isDoctor && (
          <span
            className="font-display text-[0.55rem] tracking-[0.15em] uppercase block mb-1.5 text-right"
            style={{ color: "var(--sonic-dim)" }}
          >
            You
          </span>
        )}
        <p
          className="text-[0.9rem] leading-[1.7] whitespace-pre-wrap"
          style={{ color: isDoctor ? "var(--text-primary)" : "rgba(200, 215, 200, 0.9)" }}
        >
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
