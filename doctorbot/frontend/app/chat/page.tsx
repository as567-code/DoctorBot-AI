// doctorbot/frontend/app/chat/page.tsx
"use client";

import { useEffect } from "react";
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

  // Play sonic buzz when a user message is sent (messages array grows)
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

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-6">
      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 text-xs text-purple-400 hover:text-purple-200 bg-purple-900/40 border border-purple-500/20 rounded-full px-3 py-1.5 transition-all"
        title={soundEnabled ? "Mute sounds" : "Enable sounds"}
      >
        {soundEnabled ? "🔊" : "🔇"} Sound
      </button>

      {/* Hero */}
      <div className="text-center mb-6 space-y-3">
        <div className="flex justify-center">
          <DoctorAvatar mood={currentMood} size="lg" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
          DoctorBot
        </h1>
        <p className="text-purple-400/60 text-sm">
          Allons-y! Ask me anything across time and space.
        </p>
      </div>

      {/* Chat */}
      <ChatWindow />

      {/* Console Controls */}
      <ConsoleBar />

      {/* Easter Eggs */}
      <EasterEggs />
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
