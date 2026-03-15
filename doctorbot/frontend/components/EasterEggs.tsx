"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/context/ChatContext";

type EasterEggType = "doctor-who" | "exterminate" | "bad-wolf" | "bowties" | "konami" | null;

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

type ActiveEgg = Exclude<EasterEggType, null>;

interface EasterEggsProps {
  onEgg?: (egg: ActiveEgg) => void;
}

export default function EasterEggs({ onEgg }: EasterEggsProps) {
  const { messages } = useChat();
  const [activeEgg, setActiveEgg] = useState<EasterEggType>(null);
  const konamiIndexRef = useRef(0);

  // Notify parent when an egg activates (for sound effects)
  useEffect(() => {
    if (activeEgg && onEgg) onEgg(activeEgg);
  }, [activeEgg, onEgg]);

  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role !== "user") return;
    const text = last.content.toLowerCase();

    if (text.includes("doctor who")) setActiveEgg("doctor-who");
    else if (text.includes("exterminate")) setActiveEgg("exterminate");
    else if (text.includes("bad wolf")) setActiveEgg("bad-wolf");
    else if (text.includes("bowties are cool")) setActiveEgg("bowties");
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIndexRef.current]) {
        const next = konamiIndexRef.current + 1;
        if (next === KONAMI.length) {
          setActiveEgg("konami");
          konamiIndexRef.current = 0;
        } else {
          konamiIndexRef.current = next;
        }
      } else {
        konamiIndexRef.current = 0;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!activeEgg) return;
    const timer = setTimeout(() => setActiveEgg(null), 3000);
    return () => clearTimeout(timer);
  }, [activeEgg]);

  return (
    <AnimatePresence>
      {activeEgg === "doctor-who" && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(138,43,226,0.2) 0%, transparent 50%)",
          }}
        >
          <div className="flex items-center justify-center h-full">
            <motion.span
              className="text-4xl font-bold text-purple-300/50"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Doctor... who?
            </motion.span>
          </div>
        </motion.div>
      )}

      {activeEgg === "bad-wolf" && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(255,200,50,0.1) 0%, transparent 60%)",
          }}
        >
          <div className="flex items-center justify-center h-full">
            <motion.span
              className="text-6xl font-bold text-yellow-400/30"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              BAD WOLF
            </motion.span>
          </div>
        </motion.div>
      )}

      {activeEgg === "exterminate" && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{ background: "rgba(255, 0, 0, 0.15)" }}
        />
      )}

      {activeEgg === "bowties" && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              initial={{
                top: -20,
                left: `${Math.random() * 100}%`,
                rotate: Math.random() * 360,
              }}
              animate={{
                top: "110%",
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 1,
              }}
            >
              🎀
            </motion.span>
          ))}
        </motion.div>
      )}

      {activeEgg === "konami" && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(138,43,226,0.4) 0%, rgba(255,140,0,0.2) 40%, transparent 70%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
