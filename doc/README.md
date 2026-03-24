# Spiral Game — Nx Monorepo

> A Risk/Reward Quiz Game Engine built with React, Node/Express, and TypeScript inside an Nx Monorepo.

---

## What Is This?

**Spiral Game** is a gamified quiz module where players answer progressively harder questions, choosing at each step to **continue** (risk their score for more) or **cash out** (lock in what they've earned with a penalty). It is built as a modular component of a larger GameEngine system.

---

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Monorepo    | Nx                      |
| Frontend    | React + TypeScript (Vite) |
| Backend     | Node.js + Express + TypeScript (Webpack) |
| Data Format | JSON                    |
| AI          | OpenAI-compatible API (OpenAI / OpenRouter / Groq) |

---

## Project Structure

```
spiral-game/
├── apps/
│   ├── spiral-game/       → React frontend
│   └── spiral-api/        → Node/Express backend
├── libs/
│   ├── game-types/        → Shared TypeScript types
│   └── game-utils/        → Scoring and game logic utilities
└── nx.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install Dependencies

```bash
npm install
```

### Run the Backend

```bash
npx nx serve spiral-api
```

API available at: `http://localhost:3333`

### Run the Frontend

```bash
npx nx serve spiral-game
```

App available at: `http://localhost:4200`

---

## API Reference

### Generate Spiral Game (Chunked Chapter Pipeline)

```http
POST /generate/spiral
```

The backend now reads and parses chapter PDF content from:

`../chapter/CHAP 9.pmd.pdf`

Then it runs:

1. Structural parsing (heading/section detection with hierarchy preservation)
2. Hierarchical chunking (Chapter → Sections → chunks)
3. Chunk-wise LLM generation (no full chapter context sent)

Default chunk target is approximately 300-800 tokens per chunk.

Optional request body fields:

```json
{
  "provider": "openai | openrouter | groq",
  "model": "provider-specific-model-name",
  "maxQuestions": 8,
  "apiKey": "optional-per-request-key"
}
```

**Response:**

```json
{
  "sessionId": "abc123...",
  "questions": [
    {
      "id": 1,
      "level": 1,
      "question": "What is ...?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 2,
      "hint": "Think about ...",
      "points": 100
    }
  ],
  "createdAt": "2024-03-21T...",
  "source": {
    "file": "CHAP 9.pmd.pdf",
    "provider": "openrouter",
    "model": "openai/gpt-4o-mini",
    "sectionsParsed": 12,
    "chunksUsed": 8,
    "chunksAvailable": 19,
    "chunkTokenRange": [300, 800]
  }
}
```

### Submit Result (Sprint 8)

```http
POST /spiral/result
Content-Type: application/json

Body: {
  "sessionId": "abc123...",
  "finalScore": 800,
  "levelsReached": 4,
  "cashedOut": true,
  "completedAt": "2024-03-21T..."
}
```

---

## Game Rules

1. **Question Set**: Questions are generated from PDF chapter chunks using an LLM.
2. **Levels**: The player starts at Level 1 and progresses sequentially.
3. **Scoring**: Each correct answer adds points based on the question's level.
4. **The Decision**: After each correct answer, the player chooses:
   - **Risk It & Continue**: Move to the next level.
   - **Cash Out**: End the game and keep the current score, but apply a **20% penalty**.
5. **Wrong Answer**: Ends the game immediately and the score is reset to **0**.
6. **State Persistence**: Game progress and scores are automatically saved to `localStorage` (Sprint 9).

---

## Shared Types

```ts
// libs/game-types/src/lib/game-types.ts

export type Question = {
  id: number
  level: number
  question: string
  options: string[]
  correctIndex: number
  hint: string
  points: number
}

export type SpiralSession = {
  sessionId: string
  questions: Question[]
  createdAt: string
}

export type GameResult = {
  sessionId: string
  finalScore: number
  levelsReached: number
  cashedOut: boolean
  completedAt: string
}
```

---

## Game Hook

```ts
// apps/spiral-game/src/app/hooks/useSpiralGame.ts

const {
  status,             // 'playing' | 'decision' | 'finished'
  score,              // Current cumulative score
  currentQuestion,    // Current active Question object
  answerQuestion,     // Function to submit answer index
  cashOut,            // Function to end game with 20% penalty
  continueGame,       // Function to move to next level
  clearSessionCache   // Clear localStorage
} = useSpiralGame(session)
```

---

## UI Design

- **Premium Aesthetics**: Dark mode with gradients (`bg-slate-950`) and glassmorphism.
- **Animations**: Uses Tailwinds and `framer-motion` style transitions for "vibe".
- **Real-time Feedback**: Score updates and level progress indicators.

---

## Nx Commands

| Command                       | Description                     |
|-------------------------------|---------------------------------|
| `npx nx serve spiral-game`     | Start frontend dev server       |
| `npx nx serve spiral-api`      | Start backend dev server        |
| `npx nx build spiral-game`     | Build frontend for production   |
| `npx nx build spiral-api`      | Build backend for production    |
| `npx nx test spiral-game`      | Run frontend tests              |
| `npx nx test spiral-api`       | Run backend tests               |
| `npx nx graph`                 | View project dependency graph   |

---

## LLM Provider Configuration

Environment variables:

- `LLM_PROVIDER` (optional default provider: `openai`, `openrouter`, or `groq`)
- `LLM_MODEL` (optional default model override)
- `OPENAI_COMPATIBLE_API_KEY` (generic key for selected provider)
- `OPENAI_API_KEY` (required when provider is `openai`)
- `OPENROUTER_API_KEY` (required when provider is `openrouter`)
- `GROQ_API_KEY` (required when provider is `groq`)
- `OPENROUTER_SITE_URL` (optional, recommended for OpenRouter)
- `OPENROUTER_APP_NAME` (optional, recommended for OpenRouter)

Key resolution order (deterministic):

1. `apiKey` from request body (if provided)
2. `OPENAI_COMPATIBLE_API_KEY`
3. Provider-specific key (`OPENAI_API_KEY` or `OPENROUTER_API_KEY` or `GROQ_API_KEY`)

Provider behavior:

- If 2 provider keys are missing: works as long as selected provider key exists.
- If all 3 provider keys are present: only selected provider is used.
- If selected provider key is missing and no generic/request key: request fails with clear error.

Provider endpoints dictionary in backend:

- `openai` → `https://api.openai.com/v1`
- `openrouter` → `https://openrouter.ai/api/v1`
- `groq` → `https://api.groq.com/openai/v1`

### Why chunking is efficient for one chapter

- One chapter usually becomes a manageable number of chunks.
- Processing chunks independently avoids sending full chapter context.
- Token usage and cost are predictable per chunk.
- Chunk failure is isolated and retry-friendly.
- Quality remains good because chunk boundaries follow section hierarchy.

---

## Roadmap

- [x] **Live AI Integration**: Dynamic question generation via LLM-compatible APIs.
- [ ] **Leaderboards**: Competitive global scoring system.
- [ ] **Multi-modal Inputs**: Support for images and audio files as sources.
- [ ] **Database Integration**: Replace file-based storage with MongoDB/PostgreSQL.

---

## License

MIT
