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
    role: str
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

@router.post("/api/chat", response_model=ChatResponse, response_model_exclude_none=True)
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
    except Exception:
        return ChatResponse(
            response="Something's wrong with the telepathic circuits...",
            mood="concerned",
            error="service_error",
        )
