# DoctorBot: Doctor Who Conversational AI

**[Try it live](https://doctorbot-ui.onrender.com)** | [Backend API](https://doctorbot-ai.onrender.com/api/health)

> Free tier hosting — first load may take ~30s while the backend wakes up.

## Overview

DoctorBot is a Doctor Who-themed conversational AI chatbot powered by Mistral Large. It features a retro-futuristic TARDIS console UI built with Next.js and a FastAPI backend. The Doctor responds in-character with mood-reactive visuals and sound effects.

A full-stack production application with a distinctive hand-crafted aesthetic.

## Tech Stack

- **Backend**: Python 3.13, FastAPI, Pydantic, Mistral AI SDK
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **3D/Animation**: Three.js (particle vortex), Framer Motion
- **Audio**: Howler.js with synthesized sound effects
- **Fonts**: Orbitron (display), Crimson Pro (body)

## Features

- In-character Doctor Who responses with mood detection (excited, serious, playful, concerned, manic)
- Retro-futuristic TARDIS console UI with CRT scanlines, Gallifreyan-inspired SVG art
- 3D particle vortex background
- Sound effects (TARDIS materialisation, sonic screwdriver, cloister bell)
- Easter eggs (Konami code, "exterminate" trigger)
- Conversation history with localStorage persistence
- Explain mode for scientific topics

## Project Structure

```
doctorbot/
├── backend/
│   ├── config.py              # Environment and model configuration
│   ├── main.py                # FastAPI application entry
│   ├── prompts.py             # System prompt and Doctor Who quotes
│   ├── routes/
│   │   ├── chat.py            # Chat endpoint with 3-tier response parser
│   │   ├── health.py          # Health check
│   │   └── quotes.py          # Random Doctor Who quotes
│   └── tests/                 # 18 pytest tests
├── frontend/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components (ChatWindow, DoctorAvatar, etc.)
│   ├── context/               # ChatProvider with state management
│   ├── hooks/                 # useSound hook
│   ├── lib/                   # API client with timeout handling
│   └── public/sounds/         # Synthesized MP3 sound effects
└── generate_sounds.py         # Python script to synthesise sound effects
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Mistral API key

### Backend

```bash
cd doctorbot/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your MISTRAL_API_KEY
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd doctorbot/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
cd doctorbot/backend
source venv/bin/activate
python -m pytest tests/ -v
```
