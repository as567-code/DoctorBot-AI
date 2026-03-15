const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FETCH_TIMEOUT_MS = 30000;

export interface Message {
  role: "user" | "doctor";
  content: string;
  id: string;
}

export interface ChatResponse {
  response: string;
  mood: string;
  error?: string;
}

export interface QuoteResponse {
  quote: string;
  doctor: string;
}

function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function sendMessage(
  message: string,
  history: Message[]
): Promise<ChatResponse> {
  // Only send the last 20 messages to the backend (it trims too, but no need to send 100)
  const trimmedHistory = history.slice(-20).map(({ role, content }) => ({ role, content }));

  try {
    const res = await fetchWithTimeout(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: trimmedHistory }),
    });
    if (!res.ok) {
      return {
        response: "Something's wrong with the telepathic circuits...",
        mood: "concerned",
        error: "service_error",
      };
    }
    return res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        response: "The TARDIS seems to be having temporal difficulties...",
        mood: "concerned",
        error: "timeout",
      };
    }
    throw err;
  }
}

export async function getQuote(): Promise<QuoteResponse> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/quote`, {}, 10000);
    if (!res.ok) throw new Error("quote fetch failed");
    return res.json();
  } catch {
    return { quote: "The universe is big. It's vast and complicated and ridiculous.", doctor: "11th" };
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/health`, {}, 5000);
    return res.ok;
  } catch {
    return false;
  }
}
