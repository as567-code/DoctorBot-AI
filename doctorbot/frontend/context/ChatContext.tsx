"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { Message, ChatResponse, sendMessage } from "@/lib/api";

const MAX_STORED_MESSAGES = 100;
const STORAGE_KEY = "doctorbot-history";

let msgCounter = 0;
function makeId(): string {
  return `${Date.now()}-${++msgCounter}`;
}

function isValidMessageArray(data: unknown): data is Message[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      item &&
      typeof item === "object" &&
      (item.role === "user" || item.role === "doctor") &&
      typeof item.content === "string"
  );
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentMood: string;
  lastError: string | null;
  send: (text: string) => Promise<void>;
  clearHistory: () => void;
}

const ChatContext = createContext<ChatState | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState("playful");
  const [lastError, setLastError] = useState<string | null>(null);
  const messagesRef = useRef<Message[]>([]);

  // Sync ref whenever messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Restore from localStorage with validation
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (isValidMessageArray(parsed)) {
        // Ensure all restored messages have IDs
        const withIds = parsed.map((m) => ({
          ...m,
          id: m.id || makeId(),
        }));
        setMessages(withIds);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      const trimmed = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const userMsg: Message = { role: "user", content: text, id: makeId() };

    // Synchronously capture current messages before the state update
    const currentMessages = messagesRef.current;
    const allMessages = [...currentMessages, userMsg];

    // Update ref synchronously to prevent race conditions on rapid sends
    messagesRef.current = allMessages;
    setMessages(allMessages);
    setIsLoading(true);
    setLastError(null);

    try {
      const data: ChatResponse = await sendMessage(text, allMessages);
      const doctorMsg: Message = { role: "doctor", content: data.response, id: makeId() };
      setMessages((prev) => [...prev, doctorMsg]);
      setCurrentMood(data.mood);
      if (data.error) setLastError(data.error);
    } catch {
      const errorMsg: Message = {
        role: "doctor",
        content: "Something's wrong with the telepathic circuits...",
        id: makeId(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setLastError("service_error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    messagesRef.current = [];
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, currentMood, lastError, send, clearHistory }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
