# Spiral Game — Nx Monorepo

> A Risk/Reward Quiz Game Engine built with React, Node/Express, and TypeScript inside an Nx Monorepo.

---

## What Is This?

**Spiral Game** is a gamified quiz module where players answer progressively harder questions, choosing at each step to **continue** (risk their score for more) or **cash out** (lock in what they've earned). It is built as a modular component of a larger GameEngine system.

---

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Monorepo    | Nx                      |
| Frontend    | React + TypeScript      |
| Backend     | Node.js + Express + TypeScript |
| Data Format | JSON                    |
| AI          | Simulated (JSON-based)  |

---

## Project Structure

```
my-nx-workspace/
├── apps/
│   ├── spiral-web/        → React frontend
│   └── spiral-api/        → Node/Express backend
├── libs/
│   ├── game-types/        → Shared TypeScript types
│   ├── game-utils/        → Scoring logic
│   └── ui-components/     → Shared UI components (optional)
└── nx.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Nx CLI: `npm install -g nx`

### Install Dependencies

```bash
npm install
```

### Run the Backend

```bash
nx serve spiral-api
```

API available at: `http://localhost:3333`

### Run the Frontend

```bash
nx serve spiral-web
```

App available at: `http://localhost:4200`

---

## API Reference

### Generate Spiral Game

```http
POST /generate/spiral
Content-Type: multipart/form-data

Body: { file: <PDF> }
```

**Response:**

```json
{
  "sessionId": "abc123",
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
  ]
}
```

### Submit Result

```http
POST /spiral/result
Content-Type: application/json

Body: {
  "sessionId": "abc123",
  "finalScore": 800,
  "levelsReached": 4
}
```

---

## Game Rules

1. A PDF is uploaded and converted to a set of quiz questions.
2. The player starts at Level 1.
3. Each correct answer increases the score exponentially.
4. After each correct answer, the player chooses:
   - **Continue** — risk current score on the next question
   - **Cash Out** — lock in the current score and end the game
5. A wrong answer ends the game immediately (uncashed score is lost).
6. Final score is submitted to the backend.

---

## Shared Types

```ts
// libs/game-types/src/index.ts

export type Question = {
  id: number
  level: number
  question: string
  options: string[]
  correctIndex: number
  hint: string
  points: number
}

export type GameResult = {
  sessionId: string
  finalScore: number
  levelsReached: number
}
```

---

## Key Hook

```ts
// apps/spiral-web/src/hooks/useSpiralGame.ts

const {
  currentLevel,
  score,
  questions,
  answerQuestion,
  cashOut,
  endGame
} = useSpiralGame()
```

---

## UI Design

- Dark theme throughout
- Card-based question layout
- Real-time score and level display
- Animated level transitions
- Clear action buttons: **Continue** / **Cash Out**

---

## Nx Commands

| Command                       | Description                     |
|-------------------------------|---------------------------------|
| `nx serve spiral-web`         | Start frontend dev server       |
| `nx serve spiral-api`         | Start backend dev server        |
| `nx build spiral-web`         | Build frontend for production   |
| `nx build spiral-api`         | Build backend for production    |
| `nx test spiral-web`          | Run frontend tests              |
| `nx test spiral-api`          | Run backend tests               |
| `nx graph`                    | View project dependency graph   |

---

## Roadmap

- [ ] Live AI (Claude) integration replacing simulated JSON
- [ ] User authentication and leaderboards
- [ ] Additional game types (within the GameEngine)
- [ ] Database persistence
- [ ] CI/CD pipeline

---

## License

MIT
