# Schema — Spiral Game (Nx Monorepo)

## Overview

All shared data structures are defined in `libs/game-types/src/index.ts` and consumed by both `spiral-web` and `spiral-api`.

---

## TypeScript Types

### `Question`

The core unit of game content. Represents a single quiz question at a specific spiral level.

```ts
export type Question = {
  id: number           // Unique question identifier
  level: number        // Spiral level (1 = easiest, N = hardest)
  question: string     // The question text displayed to the player
  options: string[]    // Array of answer choices (typically 4)
  correctIndex: number // Zero-based index of the correct option in `options[]`
  hint: string         // Optional hint text shown to player
  points: number       // Points awarded for a correct answer at this level
}
```

**Example:**

```json
{
  "id": 1,
  "level": 1,
  "question": "What is the capital of France?",
  "options": ["Berlin", "Madrid", "Paris", "Rome"],
  "correctIndex": 2,
  "hint": "Think Eiffel Tower.",
  "points": 100
}
```

---

### `SpiralSession`

Represents a game session created by the backend after PDF processing.

```ts
export type SpiralSession = {
  sessionId: string       // Unique session UUID
  questions: Question[]   // Ordered array of questions (by level)
  createdAt: string       // ISO 8601 timestamp of session creation
}
```

**Example:**

```json
{
  "sessionId": "abc123",
  "questions": [ ...Question[] ],
  "createdAt": "2024-11-01T10:00:00Z"
}
```

---

### `GameResult`

Submitted by the frontend to `POST /spiral/result` at game end.

```ts
export type GameResult = {
  sessionId: string       // Links result to original session
  finalScore: number      // Score locked in via cash-out or last correct answer
  levelsReached: number   // Number of levels the player successfully completed
  cashedOut: boolean      // true if player chose to cash out; false if game ended on wrong answer
  completedAt: string     // ISO 8601 timestamp of game completion
}
```

**Example:**

```json
{
  "sessionId": "abc123",
  "finalScore": 800,
  "levelsReached": 4,
  "cashedOut": true,
  "completedAt": "2024-11-01T10:15:00Z"
}
```

---

### `GameState` (Frontend only)

Internal state managed by `useSpiralGame()` hook — not transmitted to backend.

```ts
export type GameState = {
  status: 'idle' | 'loading' | 'playing' | 'decision' | 'finished'
  currentLevel: number
  score: number
  questions: Question[]
  sessionId: string | null
}
```

---

## API Payload Schemas

### `POST /generate/spiral`

**Request:** `multipart/form-data`

| Field | Type   | Required | Description                  |
|-------|--------|----------|------------------------------|
| file  | File   | ✅       | PDF file to generate game from |

**Response:** `application/json`

```json
{
  "sessionId": "string (UUID)",
  "questions": "Question[]"
}
```

**Error Response:**

```json
{
  "error": "string",
  "code": "number"
}
```

---

### `POST /spiral/result`

**Request:** `application/json`

```json
{
  "sessionId": "string (UUID)",
  "finalScore": "number",
  "levelsReached": "number",
  "cashedOut": "boolean",
  "completedAt": "string (ISO 8601)"
}
```

**Response:** `application/json`

```json
{
  "success": true,
  "message": "Result recorded."
}
```

---

## Scoring Schema

Score is computed using an exponential model defined in `libs/game-utils/src/scoring.ts`:

```ts
// Base points per level (defined in Question.points)
// Score accumulates multiplicatively as levels increase

function calculateScore(levels: Question[], currentLevel: number): number {
  return levels
    .slice(0, currentLevel)
    .reduce((acc, q) => acc + q.points, 0)
}
```

| Level | Base Points | Cumulative Score (example) |
|-------|-------------|----------------------------|
| 1     | 100         | 100                        |
| 2     | 200         | 300                        |
| 3     | 400         | 700                        |
| 4     | 800         | 1500                       |
| 5     | 1600        | 3100                       |

### Cash-Out Penalty

To balance the risk/reward mechanic, cashing out early applies a **20% penalty** to the current accumulated score.

```ts
const penalizedScore = Math.floor(score * 0.8);
```

| Current Score | Cash-Out Value (80%) |
|---------------|----------------------|
| 100           | 80                   |
| 300           | 240                  |
| 700           | 560                  |
| 1500          | 1200                 |
| 3100          | 2480                 |

---

## localStorage Cache Schema

Cached under key: `spiral_session_{sessionId}`

```json
{
  "sessionId": "string",
  "questions": "Question[]",
  "cachedAt": "string (ISO 8601)"
}
```

Cache is cleared on game completion or session expiry.
