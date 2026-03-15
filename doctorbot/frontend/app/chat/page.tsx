// doctorbot/frontend/app/chat/page.tsx
"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChatProvider } from "@/context/ChatContext";
import ChatWindow from "@/components/ChatWindow";
import DoctorAvatar from "@/components/DoctorAvatar";
import ConsoleBar from "@/components/ConsoleBar";
import EasterEggs from "@/components/EasterEggs";
import { useChat } from "@/context/ChatContext";
import { useSound } from "@/hooks/useSound";

function ChatPageContent() {
  const { currentMood, isLoading, lastError, messages } = useChat();
  const { enabled: soundEnabled, toggle: toggleSound, play, stop } = useSound();

  // Play TARDIS materialization on first load
  useEffect(() => {
    play("tardis");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Play sonic buzz when a user message is sent
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === "user") play("sonic");
  }, [messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play/stop ambient hum during loading
  useEffect(() => {
    if (isLoading) play("hum");
    else stop("hum");
  }, [isLoading, play, stop]);

  // Play cloister bell on error
  useEffect(() => {
    if (lastError) play("cloister");
  }, [lastError, play]);

  const handleSonicSound = useCallback(() => {
    play("sonic");
  }, [play]);

  const handleEasterEgg = useCallback((egg: string) => {
    if (egg === "konami") play("tardis");
    else if (egg === "exterminate") play("cloister");
  }, [play]);

  return (
    <main className="min-h-screen flex flex-col items-center relative z-20 px-4 pt-5 pb-8">
      {/* Sound toggle — top right, minimal */}
      <button
        onClick={toggleSound}
        className="fixed top-4 right-5 z-50 font-display text-[0.55rem] tracking-[0.12em] uppercase px-3 py-1.5 border transition-all duration-200"
        style={{
          borderColor: soundEnabled ? "rgba(57,217,138,0.3)" : "rgba(212,165,116,0.15)",
          color: soundEnabled ? "var(--sonic-green)" : "var(--text-muted)",
          background: soundEnabled ? "rgba(57,217,138,0.05)" : "transparent",
        }}
        title={soundEnabled ? "Mute sounds" : "Enable sounds"}
      >
        {soundEnabled ? "Sound On" : "Sound Off"}
      </button>

      {/* Compact header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-5"
      >
        <DoctorAvatar mood={currentMood} size="sm" />
        <div>
          <h1
            className="font-display text-lg tracking-wide"
            style={{ color: "var(--amber)" }}
          >
            DoctorBot
          </h1>
          <p className="text-[0.7rem] text-[var(--text-muted)] italic">
            Allons-y! Ask me anything across time and space.
          </p>
        </div>
      </motion.div>

      {/* Chat */}
      <ChatWindow />

      {/* Console Controls */}
      <ConsoleBar onSonic={handleSonicSound} />

      {/* Easter Eggs */}
      <EasterEggs onEgg={handleEasterEgg} />
    </main>
  );
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
}
