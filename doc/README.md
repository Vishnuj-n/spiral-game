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
| AI          | Simulated (based on `example.json`) |

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

### Generate Spiral Game (Sprint 3 Mock)

```http
POST /generate/spiral
```

**Note:** Currently reads `example.json` from the root directory to simulate game generation.

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
  "createdAt": "2024-03-21T..."
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

1. **Question Set**: A set of quiz questions is generated (currently loaded from `example.json`).
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

## Roadmap

- [ ] **Live AI Integration**: Dynamic question generation via LLM (Sprint 10).
- [ ] **Leaderboards**: Competitive global scoring system.
- [ ] **Multi-modal Inputs**: Support for images and audio files as sources.
- [ ] **Database Integration**: Replace file-based storage with MongoDB/PostgreSQL.

---

## License

MIT
