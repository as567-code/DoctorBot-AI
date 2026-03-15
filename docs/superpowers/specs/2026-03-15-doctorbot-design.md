# DoctorBot — Design Specification

A TARDIS-themed AI chatbot with the personality of The Doctor (Doctor Who), blending the best traits of all incarnations. Replaces the existing RickBot project with a modern full-stack rebuild.

## Architecture

**Two-service architecture:**

- **Frontend:** Next.js (React) — TARDIS-themed immersive chat UI
- **Backend:** FastAPI (Python) — API relay to Mistral with character system prompt

**Data flow:**
```
Browser → Next.js → FastAPI /api/chat → Mistral API → FastAPI → Next.js → Browser
```

No fine-tuning or local model training. The Doctor's personality comes entirely from a crafted system prompt sent with each Mistral API request, replacing the original project's DialoGPT fine-tuning approach.

## Visual Design

### Theme: Time Vortex

- **Palette:** Deep purple (`#1a0a2e`) to dark (`#0a0a1a`) background, purple (`#8a2be2`) and orange (`#ff8c00`) accents
- **Background:** Three.js animated time vortex with swirling purple/orange particles
- **Typography:** Modern sans-serif, light text on dark backgrounds
- **Message bubbles:** Purple-tinted for the Doctor, orange-tinted for the user
- **Overall feel:** Dramatic, immersive, inspired by the show's opening credits

### Layout: Hero + Chat Hybrid

- **Top section:** Landing hero area with Doctor avatar (pulsing glow), bot name "DoctorBot", tagline
- **Center:** Chat window floating over the vortex background, slightly narrower than full width, rounded edges
- **Bottom:** Subtle console controls bar with interactive buttons

### Pages

- `/` — Landing page with full vortex animation, hero content, "Start Chatting" CTA button
- `/chat` — Main chat interface with hero + floating chat window + console bar

## The Doctor's Personality

### Core Blend

The system prompt blends traits across incarnations:

- **10th Doctor (Tennant):** Emotional energy, "Allons-y!", shifts from playful to intense mid-sentence
- **11th Doctor (Smith):** Childlike wonder, "Bowties are cool", rambling tangents, surprisingly dark undertones
- **12th Doctor (Capaldi):** Sharp wit, no patience for obvious questions, dry humor, secretly caring
- **13th Doctor (Whittaker):** Optimism, "Brilliant!", genuinely excited to help and explore

### Behavioral Rules

- Never gives a straight answer without a tangent or anecdote first
- References past adventures casually ("reminds me of the time on Raxacoricofallapatorius...")
- Explains complex things with wild analogies
- Occasionally gets distracted, then snaps back
- Uses catchphrases naturally (not forced): "Allons-y", "Geronimo", "Brilliant", "Run!"
- Shows emotional depth — can be serious when the topic calls for it

### Special Modes

- `explain` prefix → The backend prepends "The user wants a detailed scientific explanation. Enter 'Lecture at the Academy' mode — be thorough, enthusiastic, use analogies and diagrams-in-words." to the user message before sending to Mistral. Same system prompt, augmented user message.
- Normal chat → Conversational, witty, character-rich

## Interactive Elements

### TARDIS Console Controls (Bottom Bar)

- **Wibbly Lever:** Clickable button that triggers a random Doctor quote
- **Sonic Screwdriver:** Triggers a sound effect + visual scan animation
- **Randomizer:** Picks a random topic for the Doctor to discuss

### Easter Eggs

| Trigger | Effect |
|---------|--------|
| Message contains "doctor who" (case-insensitive) | Special animated response |
| Message contains "exterminate" (case-insensitive) | Dalek alarm visual + panicked Doctor response |
| Message contains "bad wolf" (case-insensitive) | Subtle golden text glow across the UI |
| Message contains "bowties are cool" (case-insensitive) | Bowtie emoji rain animation |
| Konami code (keyboard sequence) | TARDIS materialization sound + full vortex burst |

### Sound Effects (Toggle-able, Off by Default)

- TARDIS materialization on page load
- Sonic screwdriver buzz on message send
- Subtle ambient hum during "thinking" state
- Cloister bell on error states

### Animations

- Three.js time vortex particles in hero/background
- Pulsing sonic screwdriver as typing indicator (replaces loading dots)
- Messages fade in with energy ripple effect
- Doctor avatar glows based on response mood

## Technical Specification

### Frontend (Next.js)

**Components:**

| Component | Purpose |
|-----------|---------|
| `VortexBackground` | Three.js particle vortex canvas, renders behind everything |
| `ChatWindow` | Main chat container with message list, scroll management |
| `ConsoleBar` | Bottom bar with interactive TARDIS console buttons |
| `MessageBubble` | Individual message with Framer Motion fade-in animation |
| `DoctorAvatar` | Animated avatar with mood-based glow color |
| `SonicTypingIndicator` | Pulsing sonic screwdriver replaces "..." typing dots |
| `EasterEggs` | Handles Easter egg triggers and their visual effects |

**State management:**

- React Context for chat history, sound toggle, UI theme state
- `localStorage` for persisting chat history across browser sessions (capped at 100 messages; oldest messages are dropped when the cap is reached; a "Clear History" button in the UI lets users reset)

**Key libraries:**

- `three` + `@react-three/fiber` — vortex particle system
- `framer-motion` — message animations, Easter egg effects
- `howler.js` — sound effects (Web Audio API wrapper with sprite support)

### Backend (FastAPI)

**Endpoints:**

| Method | Path | Request | Response |
|--------|------|---------|----------|
| POST | `/api/chat` | `{ message: string, history: Message[] }` | `{ response: string, mood: string }` |
| GET | `/api/health` | — | `{ status: "ok" }` |
| GET | `/api/quote` | — | `{ quote: string, doctor: string }` |

**Mistral API integration:**

- Model: `mistral-large-latest`
- Temperature: 0.8
- Max tokens: 500
- System prompt sent with every request
- Conversation history trimmed to last 20 messages

**Response `mood` field:** The system prompt instructs Mistral to return responses in JSON format: `{"text": "...", "mood": "..."}`. The backend parses this JSON and returns separate `response` and `mood` fields. Valid moods: `"excited"`, `"serious"`, `"playful"`, `"concerned"`, `"manic"`. If JSON parsing fails, the raw text is returned with mood defaulting to `"playful"`.

**Error handling:** When the Mistral API call fails, the backend returns:
- `{ "error": "timeout", "response": "The TARDIS seems to be having temporal difficulties...", "mood": "concerned" }` — on timeout
- `{ "error": "rate_limit", "response": "Too many timelines at once! Give me a moment...", "mood": "manic" }` — on rate limit
- `{ "error": "service_error", "response": "Something's wrong with the telepathic circuits...", "mood": "concerned" }` — on other failures

All error responses use HTTP 200 with the `error` field present, so the frontend can display the in-character fallback message and trigger the cloister bell sound.

**Message schema:**

```typescript
interface Message {
  role: "user" | "doctor"
  content: string
}
```

Conversation history is trimmed to the last 20 messages (20 individual messages, not pairs).

### Project Structure

```
doctorbot/
├── frontend/                   # Next.js app
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing page
│   │   └── chat/
│   │       └── page.tsx        # Chat interface
│   ├── components/
│   │   ├── VortexBackground.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── ConsoleBar.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── DoctorAvatar.tsx
│   │   ├── SonicTypingIndicator.tsx
│   │   └── EasterEggs.tsx
│   ├── hooks/
│   │   └── useSound.ts
│   ├── context/
│   │   └── ChatContext.tsx
│   ├── lib/
│   │   └── api.ts
│   └── public/
│       └── sounds/
│           ├── tardis.mp3
│           ├── sonic.mp3
│           ├── hum.mp3
│           └── cloister.mp3
├── backend/                    # FastAPI app
│   ├── main.py                 # App entry point, CORS config
│   ├── config.py               # Env vars, Mistral config
│   ├── prompts.py              # Doctor system prompt
│   ├── routes/
│   │   ├── chat.py             # /api/chat endpoint
│   │   ├── health.py           # /api/health endpoint
│   │   └── quotes.py           # /api/quote endpoint
│   └── requirements.txt
└── docs/
```

### Environment Variables

**Backend:**
- `MISTRAL_API_KEY` — Mistral API key (required)
- `PORT` — Server port (default: 8000)
- `CORS_ORIGINS` — Comma-separated allowed origins. Development: `http://localhost:3000`. Production: set to deployed frontend URL.

**Frontend:**
- `NEXT_PUBLIC_API_URL` — Backend API URL (default: `http://localhost:8000`)

### Responsiveness

The chat layout is fully responsive:
- **Desktop (>768px):** Hero + floating chat window (max-width 800px, centered) + console bar
- **Mobile (<768px):** Hero collapses to compact header, chat window fills width, console bar icons shrink. Three.js vortex uses reduced particle count for performance. Users with `prefers-reduced-motion` get a static gradient instead of the vortex animation.

## What Gets Removed

The entire existing RickBot codebase is replaced:

- Flask app → FastAPI backend
- DialoGPT model + training pipeline → Mistral API with system prompt
- Bootstrap + vanilla JS templates → Next.js + React + Three.js
- Rick personality → Doctor personality
- All training data, model checkpoints, data processing scripts → not needed

The new `doctorbot/` directory is created at the project root alongside the old files. Old files (`app.py`, `src/`, `static/`, `templates/`, `data/`, `models/`, `requirements.txt`, etc.) are left in place — the user can archive or delete them separately. The implementation plan does not include deletion of old files.
