import json
import re
from typing import Literal, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field
import httpx
from mistralai import Mistral
from mistralai.models import SDKError
from config import MISTRAL_API_KEY, MISTRAL_MODEL, MISTRAL_TEMPERATURE, MISTRAL_MAX_TOKENS, MAX_HISTORY_MESSAGES
from prompts import DOCTOR_SYSTEM_PROMPT, EXPLAIN_MODE_PREFIX

router = APIRouter()

class Message(BaseModel):
    role: Literal["user", "doctor"]
    content: str = Field(..., max_length=5000)

class ChatRequest(BaseModel):
    message: str = Field(..., max_length=5000)
    history: list[Message] = Field(default=[], max_length=50)

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

VALID_MOODS = ("excited", "serious", "playful", "concerned", "manic")


def strip_markdown_codeblock(raw: str) -> str:
    """Strip markdown code fences (```json ... ```) that Mistral sometimes wraps around JSON."""
    stripped = raw.strip()
    if stripped.startswith("```"):
        first_newline = stripped.find("\n")
        if first_newline != -1:
            stripped = stripped[first_newline + 1:]
        if stripped.rstrip().endswith("```"):
            stripped = stripped.rstrip()[:-3].rstrip()
    return stripped


def extract_from_truncated(raw: str) -> tuple[str, str] | None:
    """Extract text/mood from truncated or malformed JSON via regex."""
    text_match = re.search(r'"text"\s*:\s*"((?:[^"\\]|\\.)*)', raw)
    if not text_match:
        return None
    text = text_match.group(1)
    # Unescape JSON escapes
    text = text.replace('\\"', '"').replace("\\n", "\n").replace("\\\\", "\\")
    # Strip trailing incomplete sentence fragments
    text = text.rstrip()

    mood = "playful"
    mood_match = re.search(r'"mood"\s*:\s*"(\w+)"', raw)
    if mood_match and mood_match.group(1) in VALID_MOODS:
        mood = mood_match.group(1)

    return text, mood


def parse_doctor_response(raw: str) -> tuple[str, str]:
    # 1. Try clean JSON parse
    try:
        cleaned = strip_markdown_codeblock(raw)
        data = json.loads(cleaned)
        text = data.get("text", raw)
        mood = data.get("mood", "playful")
        if mood not in VALID_MOODS:
            mood = "playful"
        return text, mood
    except (json.JSONDecodeError, AttributeError):
        pass

    # 2. Try regex extraction from truncated/malformed JSON
    result = extract_from_truncated(raw)
    if result:
        return result

    # 3. Fallback: strip JSON wrapper artifacts and return as plain text
    return raw.strip(), "playful"

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
