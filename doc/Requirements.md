# Requirements — Spiral Game (Nx Monorepo)

## 1. Functional Requirements

### 1.1 Content Generation (Backend)
- The backend shall accept a PDF file upload via `POST /generate/spiral`
- The backend shall extract text content from the uploaded PDF
- The backend shall generate a Spiral Game JSON (AI-simulated) from extracted content
- The backend shall return a `sessionId` and `questions[]` array to the frontend
- The backend shall accept game result submissions via `POST /spiral/result`
- The backend shall store session data and game results

### 1.2 Game Engine (Frontend)
- The frontend shall fetch the generated JSON from the backend exactly once per session
- The frontend shall store game data in local state/localStorage (no mid-game API calls)
- The frontend shall render questions one at a time, per level
- The frontend shall validate player answers (correct / incorrect)
- The frontend shall support level progression (advancing on correct answers)
- The frontend shall end the game immediately on an incorrect answer
- The frontend shall allow the player to cash out at any point during the game
- The frontend shall compute and display the player's score in real time
- The frontend shall transmit the final result back to the backend upon game completion

### 1.3 Scoring System
- Score shall increase exponentially with each correct level
- Cash-out shall lock in the current score before risking the next level
- A wrong answer shall result in loss of uncashed score

### 1.4 Question Data Model
Each question shall conform to the following structure:

```ts
type Question = {
  id: number
  level: number
  question: string
  options: string[]
  correctIndex: number
  hint: string
  points: number
}
```

---

## 2. Non-Functional Requirements

| Category        | Requirement                                                       |
|-----------------|-------------------------------------------------------------------|
| Performance     | Frontend game runs fully offline after initial JSON fetch         |
| Scalability     | Nx monorepo structure supports addition of new game modules       |
| Maintainability | Shared types and utilities extracted into libs                    |
| Reliability     | Game state persisted in localStorage to survive page refresh      |
| Usability       | Dark-themed, card-based UI with clear score and level indicators  |
| Type Safety     | TypeScript enforced across frontend, backend, and shared libs     |

---

## 3. Technical Requirements

- **Monorepo**: Nx Workspace
- **Frontend**: React + TypeScript (`spiral-web`)
- **Backend**: Node.js + Express + TypeScript (`spiral-api`)
- **Shared Libraries**: `game-types`, `game-utils`, `ui-components`
- **Data Format**: JSON
- **AI Integration**: Simulated (no live AI API in this demo)

---

## 4. Out of Scope (This Demo)

- Live AI (Claude) API integration
- User authentication / accounts
- Multiple simultaneous game types
- Database persistence (session stored in memory)
- Deployment / CI-CD pipelines
