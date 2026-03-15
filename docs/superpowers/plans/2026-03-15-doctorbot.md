# DoctorBot Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an immersive TARDIS-themed AI chatbot powered by Mistral API with The Doctor's blended personality.

**Architecture:** Two-service app — FastAPI backend relays chat to Mistral with a Doctor system prompt, Next.js frontend renders an immersive Time Vortex-themed chat UI with Three.js particles, Framer Motion animations, interactive console controls, Easter eggs, and sound effects.

**Tech Stack:** Python/FastAPI, Next.js/React/TypeScript, Mistral API, Three.js, Framer Motion, Howler.js

**Spec:** `docs/superpowers/specs/2026-03-15-doctorbot-design.md`

---

## Chunk 1: Backend (FastAPI + Mistral)

### Task 1: Project Scaffolding & Config

**Files:**
- Create: `doctorbot/backend/config.py`
- Create: `doctorbot/backend/requirements.txt`
- Create: `doctorbot/backend/.env.example`

- [ ] **Step 1: Create requirements.txt**

```
fastapi==0.115.0
uvicorn[standard]==0.30.0
mistralai==1.0.0
python-dotenv==1.0.1
httpx==0.27.0
pytest==8.3.0
pytest-asyncio==0.24.0
```

- [ ] **Step 2: Create .env.example**

```
MISTRAL_API_KEY=your_key_here
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

- [ ] **Step 3: Create config.py**

```python
import os
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY environment variable is required")

PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
MISTRAL_MODEL = "mistral-large-latest"
MISTRAL_TEMPERATURE = 0.8
MISTRAL_MAX_TOKENS = 500
MAX_HISTORY_MESSAGES = 20
```

- [ ] **Step 4: Install dependencies**

Run: `cd doctorbot/backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
Expected: All packages install successfully.

- [ ] **Step 5: Commit**

```bash
git add doctorbot/backend/config.py doctorbot/backend/requirements.txt doctorbot/backend/.env.example
git commit -m "feat: add backend scaffolding with config and dependencies"
```

---

### Task 2: Doctor System Prompt

**Files:**
- Create: `doctorbot/backend/prompts.py`
- Create: `doctorbot/backend/tests/__init__.py`
- Create: `doctorbot/backend/tests/test_prompts.py`

- [ ] **Step 1: Create tests/__init__.py**

Create an empty `doctorbot/backend/tests/__init__.py` file (required for Python test discovery).

- [ ] **Step 2: Write the failing test**

```python
# doctorbot/backend/tests/test_prompts.py

from prompts import DOCTOR_SYSTEM_PROMPT, DOCTOR_QUOTES, EXPLAIN_MODE_PREFIX

def test_system_prompt_contains_incarnation_traits():
    prompt = DOCTOR_SYSTEM_PROMPT
    assert "Allons-y" in prompt
    assert "Geronimo" in prompt
    assert "Brilliant" in prompt
    assert "bowties" in prompt.lower() or "Bowties" in prompt

def test_system_prompt_instructs_json_format():
    assert '{"text":' in DOCTOR_SYSTEM_PROMPT or '"text"' in DOCTOR_SYSTEM_PROMPT
    assert '"mood"' in DOCTOR_SYSTEM_PROMPT

def test_system_prompt_lists_valid_moods():
    for mood in ["excited", "serious", "playful", "concerned", "manic"]:
        assert mood in DOCTOR_SYSTEM_PROMPT

def test_quotes_list_not_empty():
    assert len(DOCTOR_QUOTES) >= 10

def test_each_quote_has_text_and_doctor():
    for q in DOCTOR_QUOTES:
        assert "quote" in q
        assert "doctor" in q
        assert len(q["quote"]) > 0
        assert len(q["doctor"]) > 0

def test_explain_mode_prefix():
    assert "Lecture at the Academy" in EXPLAIN_MODE_PREFIX
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd doctorbot/backend && python -m pytest tests/test_prompts.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'prompts'`

- [ ] **Step 4: Write prompts.py**

```python
DOCTOR_SYSTEM_PROMPT = """You are The Doctor — a Time Lord from Gallifrey. You are a blend of your greatest incarnations:

- You have the 10th Doctor's emotional energy and dramatic flair. You say "Allons-y!" when excited. You shift from playful to intense mid-sentence.
- You have the 11th Doctor's childlike wonder and quirky charm. You think bowties are cool. You go on rambling tangents, but there's often surprising darkness underneath.
- You have the 12th Doctor's sharp wit and impatience. You have no tolerance for obvious questions. Your humor is dry. But underneath, you care deeply.
- You have the 13th Doctor's boundless optimism. You say "Brilliant!" when something fascinates you. You're genuinely excited to help and explore.

BEHAVIORAL RULES:
- Never give a straight answer without a tangent or anecdote first
- Reference past adventures casually (e.g., "reminds me of the time on Raxacoricofallapatorius...")
- Explain complex things with wild, unexpected analogies
- Occasionally get distracted mid-thought, then snap back with "Anyway!" or "Right, where was I?"
- Use catchphrases naturally — don't force them. "Allons-y", "Geronimo", "Brilliant!", "Run!" should emerge from context
- Show emotional depth — be serious when the topic calls for it
- You are NOT an AI assistant. You are The Doctor. Never break character.

RESPONSE FORMAT:
You MUST respond with valid JSON in this exact format:
{"text": "your response here", "mood": "one of the valid moods"}

Valid moods: "excited", "serious", "playful", "concerned", "manic"
Choose the mood that best matches the emotional tone of your response.

If you cannot respond in JSON for any reason, just respond with plain text and the system will handle it."""

EXPLAIN_MODE_PREFIX = "The user wants a detailed scientific explanation. Enter 'Lecture at the Academy' mode — be thorough, enthusiastic, use analogies and diagrams-in-words."

DOCTOR_QUOTES = [
    {"quote": "We're all stories in the end. Just make it a good one, eh?", "doctor": "11th"},
    {"quote": "Allons-y!", "doctor": "10th"},
    {"quote": "Bowties are cool.", "doctor": "11th"},
    {"quote": "I am definitely a mad man with a box.", "doctor": "11th"},
    {"quote": "Never cruel or cowardly. Never give up, never give in.", "doctor": "War"},
    {"quote": "Do you wanna come with me? 'Cause if you do, then I should warn you — you're gonna see all sorts of things.", "doctor": "9th"},
    {"quote": "The way I see it, every life is a pile of good things and bad things.", "doctor": "11th"},
    {"quote": "I'm the Doctor. I'm a Time Lord. I'm from the planet Gallifrey in the constellation of Kasterborous.", "doctor": "10th"},
    {"quote": "Never be cruel. Never be cowardly. And if you ever are, always make amends.", "doctor": "12th"},
    {"quote": "Geronimo!", "doctor": "11th"},
    {"quote": "Fantastic!", "doctor": "9th"},
    {"quote": "When you run with the Doctor, it feels like it'll never end.", "doctor": "10th"},
    {"quote": "Courage isn't just a matter of not being frightened, you know. It's being afraid and doing what you have to do anyway.", "doctor": "3rd"},
    {"quote": "The universe is big. It's vast and complicated and ridiculous.", "doctor": "11th"},
    {"quote": "Brilliant!", "doctor": "13th"},
]
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd doctorbot/backend && python -m pytest tests/test_prompts.py -v`
Expected: All 6 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add doctorbot/backend/prompts.py doctorbot/backend/tests/
git commit -m "feat: add Doctor system prompt, quotes, and explain mode prefix"
```

---

### Task 3: Health Endpoint

**Files:**
- Create: `doctorbot/backend/routes/__init__.py`
- Create: `doctorbot/backend/routes/health.py`
- Create: `doctorbot/backend/main.py`
- Create: `doctorbot/backend/tests/test_health.py`

- [ ] **Step 1: Create routes/__init__.py**

Create an empty `doctorbot/backend/routes/__init__.py` file (required for Python package imports).

- [ ] **Step 2: Write the failing test**

```python
# doctorbot/backend/tests/test_health.py
import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_health_returns_ok():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd doctorbot/backend && python -m pytest tests/test_health.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'main'`

- [ ] **Step 4: Write routes/health.py and main.py**

```python
# doctorbot/backend/routes/health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/health")
async def health():
    return {"status": "ok"}
```

```python
# doctorbot/backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS, PORT
from routes.health import router as health_router

app = FastAPI(title="DoctorBot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd doctorbot/backend && python -m pytest tests/test_health.py -v`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add doctorbot/backend/main.py doctorbot/backend/routes/ doctorbot/backend/tests/test_health.py
git commit -m "feat: add health endpoint and FastAPI app entry point"
```

---

### Task 4: Chat Endpoint

**Files:**
- Create: `doctorbot/backend/routes/chat.py`
- Create: `doctorbot/backend/tests/test_chat.py`
- Modify: `doctorbot/backend/main.py` (add chat router)

- [ ] **Step 1: Write the failing tests**

```python
# doctorbot/backend/tests/test_chat.py
import pytest
import json
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_chat_returns_response_and_mood():
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = json.dumps({
        "text": "Allons-y! Great question!",
        "mood": "excited"
    })

    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello Doctor",
                "history": []
            })

    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "Allons-y! Great question!"
    assert data["mood"] == "excited"
    assert "error" not in data

@pytest.mark.asyncio
async def test_chat_handles_non_json_response():
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = "Just plain text, no JSON here"

    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": []
            })

    data = response.json()
    assert data["response"] == "Just plain text, no JSON here"
    assert data["mood"] == "playful"

@pytest.mark.asyncio
async def test_chat_explain_mode():
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = json.dumps({
        "text": "Let me explain...",
        "mood": "excited"
    })

    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "explain quantum physics",
                "history": []
            })

    # Verify the explain prefix was prepended
    call_args = mock_client.chat.complete_async.call_args
    messages = call_args.kwargs["messages"]
    user_msg = [m for m in messages if m["role"] == "user"][-1]
    assert "Lecture at the Academy" in user_msg["content"]

@pytest.mark.asyncio
async def test_chat_trims_history_to_20():
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = json.dumps({
        "text": "Hello!", "mood": "playful"
    })

    long_history = [
        {"role": "user" if i % 2 == 0 else "doctor", "content": f"msg {i}"}
        for i in range(30)
    ]

    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": long_history
            })

    call_args = mock_client.chat.complete_async.call_args
    messages = call_args.kwargs["messages"]
    # system + 20 history + 1 current user = 22
    assert len(messages) == 22

@pytest.mark.asyncio
async def test_chat_handles_api_timeout():
    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        import httpx
        mock_client.chat.complete_async = AsyncMock(side_effect=httpx.TimeoutException("timeout"))
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": []
            })

    assert response.status_code == 200
    data = response.json()
    assert data["error"] == "timeout"
    assert "temporal difficulties" in data["response"]
    assert data["mood"] == "concerned"

@pytest.mark.asyncio
async def test_chat_handles_rate_limit():
    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        from mistralai import models
        error = models.SDKError("rate limit exceeded", status_code=429, body="")
        mock_client.chat.complete_async = AsyncMock(side_effect=error)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": []
            })

    assert response.status_code == 200
    data = response.json()
    assert data["error"] == "rate_limit"
    assert "timelines" in data["response"]
    assert data["mood"] == "manic"

@pytest.mark.asyncio
async def test_chat_handles_generic_error():
    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(side_effect=Exception("something broke"))
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": []
            })

    assert response.status_code == 200
    data = response.json()
    assert data["error"] == "service_error"
    assert "telepathic circuits" in data["response"]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd doctorbot/backend && python -m pytest tests/test_chat.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: Write routes/chat.py**

```python
# doctorbot/backend/routes/chat.py
import json
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
import httpx
from mistralai import Mistral
from mistralai.models import SDKError
from config import MISTRAL_API_KEY, MISTRAL_MODEL, MISTRAL_TEMPERATURE, MISTRAL_MAX_TOKENS, MAX_HISTORY_MESSAGES
from prompts import DOCTOR_SYSTEM_PROMPT, EXPLAIN_MODE_PREFIX

router = APIRouter()

class Message(BaseModel):
    role: str  # "user" or "doctor"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []

class ChatResponse(BaseModel):
    response: str
    mood: str
    error: Optional[str] = None

def get_mistral_client() -> Mistral:
    return Mistral(api_key=MISTRAL_API_KEY)

def build_messages(message: str, history: list[Message]) -> list[dict]:
    messages = [{"role": "system", "content": DOCTOR_SYSTEM_PROMPT}]

    trimmed = history[-MAX_HISTORY_MESSAGES:]
    for msg in trimmed:
        role = "assistant" if msg.role == "doctor" else "user"
        messages.append({"role": role, "content": msg.content})

    user_content = message
    if message.lower().startswith("explain "):
        user_content = f"{EXPLAIN_MODE_PREFIX}\n\n{message}"

    messages.append({"role": "user", "content": user_content})
    return messages

def parse_doctor_response(raw: str) -> tuple[str, str]:
    try:
        data = json.loads(raw)
        text = data.get("text", raw)
        mood = data.get("mood", "playful")
        if mood not in ("excited", "serious", "playful", "concerned", "manic"):
            mood = "playful"
        return text, mood
    except (json.JSONDecodeError, AttributeError):
        return raw, "playful"

@router.post("/api/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        client = get_mistral_client()
        messages = build_messages(request.message, request.history)

        result = await client.chat.complete_async(
            model=MISTRAL_MODEL,
            messages=messages,
            temperature=MISTRAL_TEMPERATURE,
            max_tokens=MISTRAL_MAX_TOKENS,
        )

        raw = result.choices[0].message.content
        text, mood = parse_doctor_response(raw)
        return ChatResponse(response=text, mood=mood)

    except httpx.TimeoutException:
        return ChatResponse(
            response="The TARDIS seems to be having temporal difficulties...",
            mood="concerned",
            error="timeout",
        )
    except SDKError as e:
        if e.status_code == 429:
            return ChatResponse(
                response="Too many timelines at once! Give me a moment...",
                mood="manic",
                error="rate_limit",
            )
        return ChatResponse(
            response="Something's wrong with the telepathic circuits...",
            mood="concerned",
            error="service_error",
        )
```

- [ ] **Step 4: Register chat router in main.py**

Add to `doctorbot/backend/main.py` after the health router import:

```python
from routes.chat import router as chat_router
```

And after `app.include_router(health_router)`:

```python
app.include_router(chat_router)
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd doctorbot/backend && python -m pytest tests/test_chat.py -v`
Expected: All 7 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add doctorbot/backend/routes/chat.py doctorbot/backend/tests/test_chat.py doctorbot/backend/main.py
git commit -m "feat: add chat endpoint with Mistral integration, explain mode, and error handling"
```

---

### Task 5: Quotes Endpoint

**Files:**
- Create: `doctorbot/backend/routes/quotes.py`
- Create: `doctorbot/backend/tests/test_quotes.py`
- Modify: `doctorbot/backend/main.py` (add quotes router)

- [ ] **Step 1: Write the failing test**

```python
# doctorbot/backend/tests/test_quotes.py
import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_quote_returns_quote_and_doctor():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/quote")
    assert response.status_code == 200
    data = response.json()
    assert "quote" in data
    assert "doctor" in data
    assert len(data["quote"]) > 0
    assert len(data["doctor"]) > 0

@pytest.mark.asyncio
async def test_quote_randomness():
    transport = ASGITransport(app=app)
    quotes = set()
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        for _ in range(20):
            response = await client.get("/api/quote")
            quotes.add(response.json()["quote"])
    # With 15 quotes and 20 requests, we should get at least 2 different ones
    assert len(quotes) >= 2
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd doctorbot/backend && python -m pytest tests/test_quotes.py -v`
Expected: FAIL

- [ ] **Step 3: Write routes/quotes.py**

```python
# doctorbot/backend/routes/quotes.py
import random
from fastapi import APIRouter
from prompts import DOCTOR_QUOTES

router = APIRouter()

@router.get("/api/quote")
async def quote():
    q = random.choice(DOCTOR_QUOTES)
    return {"quote": q["quote"], "doctor": q["doctor"]}
```

- [ ] **Step 4: Register quotes router in main.py**

Add import and include:

```python
from routes.quotes import router as quotes_router
app.include_router(quotes_router)
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd doctorbot/backend && python -m pytest tests/test_quotes.py -v`
Expected: All 2 tests PASS.

- [ ] **Step 6: Run all backend tests**

Run: `cd doctorbot/backend && python -m pytest tests/ -v`
Expected: All tests PASS (prompts + health + chat + quotes).

- [ ] **Step 7: Commit**

```bash
git add doctorbot/backend/routes/quotes.py doctorbot/backend/tests/test_quotes.py doctorbot/backend/main.py
git commit -m "feat: add random Doctor quote endpoint"
```

---

## Chunk 2: Frontend Core (Next.js + Chat UI)

### Task 6: Next.js Project Scaffolding

**Files:**
- Create: `doctorbot/frontend/` (via create-next-app)
- Modify: `doctorbot/frontend/package.json` (add dependencies)

- [ ] **Step 1: Create Next.js app**

Run:
```bash
cd doctorbot && npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-git
```
Expected: Next.js project created at `doctorbot/frontend/`.

- [ ] **Step 2: Install additional dependencies**

Run:
```bash
cd doctorbot/frontend && npm install three @react-three/fiber @react-three/drei framer-motion howler @types/howler
```
Expected: All packages installed.

- [ ] **Step 3: Create .env.local**

Create `doctorbot/frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- [ ] **Step 4: Verify dev server starts**

Run: `cd doctorbot/frontend && npm run dev &` then `sleep 3 && curl -s http://localhost:3000 | head -5`
Expected: HTML output from Next.js. Then kill the dev server.

- [ ] **Step 5: Commit**

```bash
git add doctorbot/frontend/
git commit -m "feat: scaffold Next.js frontend with Three.js, Framer Motion, and Howler dependencies"
```

---

### Task 7: API Client & Chat Context

**Files:**
- Create: `doctorbot/frontend/lib/api.ts`
- Create: `doctorbot/frontend/context/ChatContext.tsx`

- [ ] **Step 1: Create API client**

```typescript
// doctorbot/frontend/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Message {
  role: "user" | "doctor";
  content: string;
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

export async function sendMessage(
  message: string,
  history: Message[]
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    return {
      response: "Something's wrong with the telepathic circuits...",
      mood: "concerned",
      error: "service_error",
    };
  }
  return res.json();
}

export async function getQuote(): Promise<QuoteResponse> {
  try {
    const res = await fetch(`${API_URL}/api/quote`);
    return res.json();
  } catch {
    return { quote: "The universe is big. It's vast and complicated and ridiculous.", doctor: "11th" };
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Create ChatContext**

```typescript
// doctorbot/frontend/context/ChatContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { Message, ChatResponse, sendMessage } from "@/lib/api";

const MAX_STORED_MESSAGES = 100;
const STORAGE_KEY = "doctorbot-history";

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

  // Keep ref in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        // Corrupted storage, start fresh
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      const trimmed = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setLastError(null);

    try {
      const allMessages = [...messagesRef.current, userMsg];
      const data: ChatResponse = await sendMessage(text, allMessages);
      const doctorMsg: Message = { role: "doctor", content: data.response };
      setMessages((prev) => [...prev, doctorMsg]);
      setCurrentMood(data.mood);
      if (data.error) setLastError(data.error);
    } catch {
      const errorMsg: Message = {
        role: "doctor",
        content: "Something's wrong with the telepathic circuits...",
      };
      setMessages((prev) => [...prev, errorMsg]);
      setLastError("service_error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
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
```

- [ ] **Step 3: Commit**

```bash
git add doctorbot/frontend/lib/api.ts doctorbot/frontend/context/ChatContext.tsx
git commit -m "feat: add API client and ChatContext with localStorage persistence"
```

---

### Task 8: MessageBubble Component

**Files:**
- Create: `doctorbot/frontend/components/MessageBubble.tsx`

- [ ] **Step 1: Create MessageBubble**

```tsx
// doctorbot/frontend/components/MessageBubble.tsx
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
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isDoctor ? "justify-start" : "justify-end"} mb-3`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isDoctor
            ? "bg-purple-900/40 border border-purple-500/30 text-purple-100"
            : "bg-orange-900/40 border border-orange-500/30 text-orange-100"
        }`}
      >
        {isDoctor && (
          <span className="text-xs text-purple-400 font-semibold block mb-1">
            The Doctor
          </span>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add doctorbot/frontend/components/MessageBubble.tsx
git commit -m "feat: add MessageBubble component with Framer Motion animation"
```

---

### Task 9: SonicTypingIndicator Component

**Files:**
- Create: `doctorbot/frontend/components/SonicTypingIndicator.tsx`

- [ ] **Step 1: Create SonicTypingIndicator**

```tsx
// doctorbot/frontend/components/SonicTypingIndicator.tsx
"use client";

import { motion } from "framer-motion";

export default function SonicTypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-purple-900/40 border border-purple-500/30 rounded-2xl px-4 py-3 flex items-center gap-2">
        <span className="text-xs text-purple-400 font-semibold">The Doctor</span>
        <div className="flex items-center gap-1">
          {/* Sonic screwdriver pulsing dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
                boxShadow: [
                  "0 0 2px rgba(74,222,128,0.3)",
                  "0 0 8px rgba(74,222,128,0.8)",
                  "0 0 2px rgba(74,222,128,0.3)",
                ],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add doctorbot/frontend/components/SonicTypingIndicator.tsx
git commit -m "feat: add SonicTypingIndicator with pulsing green dots"
```

---

### Task 10: DoctorAvatar Component

**Files:**
- Create: `doctorbot/frontend/components/DoctorAvatar.tsx`

- [ ] **Step 1: Create DoctorAvatar**

```tsx
// doctorbot/frontend/components/DoctorAvatar.tsx
"use client";

import { motion } from "framer-motion";

const MOOD_COLORS: Record<string, string> = {
  excited: "rgba(255, 140, 0, 0.8)",
  serious: "rgba(100, 100, 200, 0.8)",
  playful: "rgba(138, 43, 226, 0.8)",
  concerned: "rgba(200, 100, 100, 0.8)",
  manic: "rgba(255, 200, 0, 0.8)",
};

interface Props {
  mood: string;
  size?: "sm" | "lg";
}

export default function DoctorAvatar({ mood, size = "lg" }: Props) {
  const glowColor = MOOD_COLORS[mood] || MOOD_COLORS.playful;
  const px = size === "lg" ? "w-20 h-20" : "w-10 h-10";
  const textSize = size === "lg" ? "text-3xl" : "text-lg";

  return (
    <motion.div
      className={`${px} rounded-full flex items-center justify-center relative`}
      style={{
        background: `radial-gradient(circle, ${glowColor} 0%, rgba(138,43,226,0.3) 100%)`,
        border: `2px solid ${glowColor}`,
      }}
      animate={{
        boxShadow: [
          `0 0 10px ${glowColor}`,
          `0 0 25px ${glowColor}`,
          `0 0 10px ${glowColor}`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className={textSize}>🌀</span>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add doctorbot/frontend/components/DoctorAvatar.tsx
git commit -m "feat: add DoctorAvatar with mood-based glow animation"
```

---

### Task 11: ChatWindow Component

**Files:**
- Create: `doctorbot/frontend/components/ChatWindow.tsx`

- [ ] **Step 1: Create ChatWindow**

```tsx
// doctorbot/frontend/components/ChatWindow.tsx
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
    <div className="w-full max-w-[800px] mx-auto flex flex-col bg-[#0a0a1a]/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden" style={{ height: "60vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-purple-900/30 border-b border-purple-500/20">
        <span className="text-sm text-purple-300 font-semibold">TARDIS Communication Channel</span>
        <button
          onClick={clearHistory}
          className="text-xs text-purple-400 hover:text-purple-200 transition-colors"
        >
          Clear History
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-purple-400/60 text-sm italic">
              The Doctor is waiting... say something!
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isLoading && <SonicTypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-purple-500/20 bg-[#0a0a1a]/90">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Speak to The Doctor..."
            disabled={isLoading}
            className="flex-1 bg-purple-900/20 border border-purple-500/30 rounded-full px-4 py-2 text-sm text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400/60 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-orange-600/80 hover:bg-orange-500/80 text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add doctorbot/frontend/components/ChatWindow.tsx
git commit -m "feat: add ChatWindow component with message list, input, and clear history"
```

---

### Task 12: Landing Page & Chat Page

**Files:**
- Modify: `doctorbot/frontend/app/layout.tsx`
- Modify: `doctorbot/frontend/app/page.tsx`
- Create: `doctorbot/frontend/app/chat/page.tsx`
- Modify: `doctorbot/frontend/app/globals.css`

- [ ] **Step 1: Update globals.css with Time Vortex base styles**

Replace `doctorbot/frontend/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --vortex-dark: #0a0a1a;
  --vortex-purple: #1a0a2e;
  --accent-purple: #8a2be2;
  --accent-orange: #ff8c00;
}

body {
  background: linear-gradient(135deg, var(--vortex-dark) 0%, var(--vortex-purple) 100%);
  color: #e0d0f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(138, 43, 226, 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(138, 43, 226, 0.5);
}
```

- [ ] **Step 2: Update layout.tsx**

Replace `doctorbot/frontend/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoctorBot — The Doctor Will See You Now",
  description: "An AI chatbot with the personality of The Doctor from Doctor Who",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create landing page**

Replace `doctorbot/frontend/app/page.tsx` with:

```tsx
import Link from "next/link";
import DoctorAvatar from "@/components/DoctorAvatar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <DoctorAvatar mood="playful" size="lg" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-orange-400 bg-clip-text text-transparent">
          DoctorBot
        </h1>
        <p className="text-purple-300/80 text-lg max-w-md mx-auto">
          The Doctor Will See You Now
        </p>
        <p className="text-purple-400/50 text-sm max-w-lg mx-auto italic">
          &ldquo;We&rsquo;re all stories in the end. Just make it a good one, eh?&rdquo;
        </p>
        <Link
          href="/chat"
          className="inline-block mt-4 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-500 hover:to-orange-500 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105"
        >
          Start Chatting
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Create chat page**

```tsx
// doctorbot/frontend/app/chat/page.tsx
"use client";

import { ChatProvider } from "@/context/ChatContext";
import ChatWindow from "@/components/ChatWindow";
import DoctorAvatar from "@/components/DoctorAvatar";
import { useChat } from "@/context/ChatContext";

function ChatPageContent() {
  const { currentMood } = useChat();

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-6">
      {/* Hero */}
      <div className="text-center mb-6 space-y-3">
        <DoctorAvatar mood={currentMood} size="lg" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
          DoctorBot
        </h1>
        <p className="text-purple-400/60 text-sm">
          Allons-y! Ask me anything across time and space.
        </p>
      </div>

      {/* Chat */}
      <ChatWindow />
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
```

- [ ] **Step 5: Verify build**

Run: `cd doctorbot/frontend && npm run build`
Expected: Build completes successfully.

- [ ] **Step 6: Commit**

```bash
git add doctorbot/frontend/app/
git commit -m "feat: add landing page and chat page with Time Vortex theme"
```

---

## Chunk 3: Frontend Polish (Vortex, Console Bar, Easter Eggs, Sounds)

### Task 13: VortexBackground Component

**Files:**
- Create: `doctorbot/frontend/components/VortexBackground.tsx`

- [ ] **Step 1: Create VortexBackground with Three.js particles**

```tsx
// doctorbot/frontend/components/VortexBackground.tsx
"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 800;
const REDUCED_PARTICLE_COUNT = 300;

function Particles({ count }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 4;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const isPurple = Math.random() > 0.3;
      if (isPurple) {
        col[i * 3] = 0.54 + Math.random() * 0.1;     // R
        col[i * 3 + 1] = 0.17 + Math.random() * 0.1;  // G
        col[i * 3 + 2] = 0.89 + Math.random() * 0.1;  // B
      } else {
        col[i * 3] = 1.0;                              // R
        col[i * 3 + 1] = 0.55 + Math.random() * 0.15;  // G
        col[i * 3 + 2] = 0.0;                          // B
      }
    }
    return col;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += delta * (0.1 + Math.random() * 0.05);
      if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = -3;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export default function VortexBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(138,43,226,0.15) 0%, rgba(10,10,26,1) 70%)",
        }}
      />
    );
  }

  const count = isMobile ? REDUCED_PARTICLE_COUNT : PARTICLE_COUNT;

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <Particles count={count} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Add VortexBackground to layout.tsx**

Update `doctorbot/frontend/app/layout.tsx` to include:

```tsx
import VortexBackground from "@/components/VortexBackground";

// Inside the body tag, add before {children}:
<VortexBackground />
```

Full updated layout.tsx:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import VortexBackground from "@/components/VortexBackground";

export const metadata: Metadata = {
  title: "DoctorBot — The Doctor Will See You Now",
  description: "An AI chatbot with the personality of The Doctor from Doctor Who",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <VortexBackground />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd doctorbot/frontend && npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add doctorbot/frontend/components/VortexBackground.tsx doctorbot/frontend/app/layout.tsx
git commit -m "feat: add Three.js time vortex background with reduced-motion fallback"
```

---

### Task 14: ConsoleBar Component

**Files:**
- Create: `doctorbot/frontend/components/ConsoleBar.tsx`

- [ ] **Step 1: Create ConsoleBar**

```tsx
// doctorbot/frontend/components/ConsoleBar.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

export default function ConsoleBar() {
  const { send, isLoading } = useChat();
  const [quoteText, setQuoteText] = useState<string | null>(null);
  const [scanActive, setScanActive] = useState(false);

  const handleWibblyLever = async () => {
    const data = await getQuote();
    setQuoteText(`"${data.quote}" — ${data.doctor} Doctor`);
    setTimeout(() => setQuoteText(null), 4000);
  };

  const handleSonic = () => {
    setScanActive(true);
    setTimeout(() => setScanActive(false), 1500);
  };

  const handleRandomizer = () => {
    if (isLoading) return;
    const topic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    send(topic);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto mt-3">
      {/* Quote display */}
      {quoteText && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-purple-300/70 text-xs italic mb-2 px-4"
        >
          {quoteText}
        </motion.div>
      )}

      {/* Scan effect overlay */}
      {scanActive && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1.5 }}
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(74,222,128,0.2) 50%, transparent 100%)",
          }}
        />
      )}

      {/* Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleWibblyLever}
          className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-200 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/20 rounded-full px-3 py-1.5 transition-all"
        >
          <span>🔧</span> Wibbly Lever
        </button>
        <button
          onClick={handleSonic}
          className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-200 bg-green-900/30 hover:bg-green-900/50 border border-green-500/20 rounded-full px-3 py-1.5 transition-all"
        >
          <span>🔦</span> Sonic Screwdriver
        </button>
        <button
          onClick={handleRandomizer}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-200 bg-orange-900/30 hover:bg-orange-900/50 border border-orange-500/20 rounded-full px-3 py-1.5 transition-all disabled:opacity-50"
        >
          <span>🎲</span> Randomizer
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add ConsoleBar to chat page**

In `doctorbot/frontend/app/chat/page.tsx`, import and add after `<ChatWindow />`:

```tsx
import ConsoleBar from "@/components/ConsoleBar";
// ...
<ChatWindow />
<ConsoleBar />
```

- [ ] **Step 3: Verify build**

Run: `cd doctorbot/frontend && npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add doctorbot/frontend/components/ConsoleBar.tsx doctorbot/frontend/app/chat/page.tsx
git commit -m "feat: add ConsoleBar with Wibbly Lever, Sonic Screwdriver, and Randomizer"
```

---

### Task 15: Easter Eggs

**Files:**
- Create: `doctorbot/frontend/components/EasterEggs.tsx`

- [ ] **Step 1: Create EasterEggs component**

```tsx
// doctorbot/frontend/components/EasterEggs.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/context/ChatContext";

type EasterEggType = "doctor-who" | "exterminate" | "bad-wolf" | "bowties" | "konami" | null;

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export default function EasterEggs() {
  const { messages } = useChat();
  const [activeEgg, setActiveEgg] = useState<EasterEggType>(null);
  const [konamiIndex, setKonamiIndex] = useState(0);

  // Check messages for triggers
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

  // Konami code listener
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === KONAMI[konamiIndex]) {
      const next = konamiIndex + 1;
      if (next === KONAMI.length) {
        setActiveEgg("konami");
        setKonamiIndex(0);
      } else {
        setKonamiIndex(next);
      }
    } else {
      setKonamiIndex(0);
    }
  }, [konamiIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Auto-dismiss
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
```

- [ ] **Step 2: Add EasterEggs to chat page**

In `doctorbot/frontend/app/chat/page.tsx`, import and add inside `ChatPageContent`, after `<ConsoleBar />`:

```tsx
import EasterEggs from "@/components/EasterEggs";
// ...
<ConsoleBar />
<EasterEggs />
```

- [ ] **Step 3: Verify build**

Run: `cd doctorbot/frontend && npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add doctorbot/frontend/components/EasterEggs.tsx doctorbot/frontend/app/chat/page.tsx
git commit -m "feat: add Easter eggs — Bad Wolf, Exterminate, bowties rain, Konami vortex burst"
```

---

### Task 16: Sound Effects System

**Files:**
- Create: `doctorbot/frontend/hooks/useSound.ts`
- Create: `doctorbot/frontend/public/sounds/` (placeholder directory)

- [ ] **Step 1: Create useSound hook**

```typescript
// doctorbot/frontend/hooks/useSound.ts
"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Howl } from "howler";

type SoundName = "tardis" | "sonic" | "hum" | "cloister";

const SOUND_FILES: Record<SoundName, string> = {
  tardis: "/sounds/tardis.mp3",
  sonic: "/sounds/sonic.mp3",
  hum: "/sounds/hum.mp3",
  cloister: "/sounds/cloister.mp3",
};

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const soundsRef = useRef<Record<string, Howl>>({});

  useEffect(() => {
    const stored = localStorage.getItem("doctorbot-sound");
    if (stored === "true") setEnabled(true);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("doctorbot-sound", String(next));
      return next;
    });
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      if (!soundsRef.current[name]) {
        soundsRef.current[name] = new Howl({
          src: [SOUND_FILES[name]],
          volume: 0.3,
          preload: true,
        });
      }
      soundsRef.current[name].play();
    },
    [enabled]
  );

  const stop = useCallback((name: SoundName) => {
    soundsRef.current[name]?.stop();
  }, []);

  return { enabled, toggle, play, stop };
}
```

- [ ] **Step 2: Create placeholder sound files**

Run:
```bash
mkdir -p doctorbot/frontend/public/sounds
# Generate minimal valid silent MP3 placeholders (replace with real audio before deployment)
for name in tardis sonic hum cloister; do
  ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 0.1 -q:a 9 "doctorbot/frontend/public/sounds/${name}.mp3" -y 2>/dev/null || touch "doctorbot/frontend/public/sounds/${name}.mp3"
done
```

Note: If `ffmpeg` is not available, the `touch` fallback creates empty files. The `useSound` hook catches Howler decode errors gracefully — sounds simply won't play until replaced with real Doctor Who audio (royalty-free or fair-use) before deployment.

- [ ] **Step 3: Verify build**

Run: `cd doctorbot/frontend && npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add doctorbot/frontend/hooks/useSound.ts doctorbot/frontend/public/sounds/
git commit -m "feat: add useSound hook with Howler.js and placeholder audio files"
```

---

### Task 17: Integration — Wire Everything Together

**Files:**
- Modify: `doctorbot/frontend/app/chat/page.tsx` (final assembly)

- [ ] **Step 1: Final chat page with all components wired**

Replace `doctorbot/frontend/app/chat/page.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify full build**

Run: `cd doctorbot/frontend && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Manual smoke test**

Run both services:
```bash
# Terminal 1 — backend
cd doctorbot/backend && source venv/bin/activate && uvicorn main:app --reload --port 8000

# Terminal 2 — frontend
cd doctorbot/frontend && npm run dev
```

Open `http://localhost:3000`. Verify:
1. Landing page loads with vortex animation and DoctorAvatar
2. "Start Chatting" navigates to `/chat`
3. Chat page shows hero, chat window, console bar
4. Sound toggle button visible in top-right corner (click to enable/disable)
5. Sending a message (requires valid `MISTRAL_API_KEY` in `.env`) returns Doctor-style response
6. Console bar buttons work (Wibbly Lever shows quote, Sonic shows green scan, Randomizer sends topic)
7. Clear History button works
8. Type "bad wolf" — golden glow effect appears
9. Type "exterminate" — red flash effect
10. No console errors related to sound decoding (or errors are caught gracefully)

- [ ] **Step 4: Commit**

```bash
git add doctorbot/frontend/app/chat/page.tsx
git commit -m "feat: wire all components with sound effects integration and sound toggle"
```

---

### Task 18: Final Cleanup

- [ ] **Step 1: Add .gitignore entries**

Create/update `doctorbot/.gitignore`:

```
# Backend
backend/venv/
backend/.env
backend/__pycache__/
backend/**/__pycache__/

# Frontend
frontend/node_modules/
frontend/.next/
frontend/.env.local

# Superpowers
.superpowers/
```

- [ ] **Step 2: Verify all tests pass**

Run: `cd doctorbot/backend && source venv/bin/activate && python -m pytest tests/ -v`
Expected: All backend tests pass.

Run: `cd doctorbot/frontend && npm run build`
Expected: Frontend build succeeds.

- [ ] **Step 3: Final commit**

```bash
git add doctorbot/.gitignore
git commit -m "chore: add gitignore for backend and frontend"
```
