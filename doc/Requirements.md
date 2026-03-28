# Requirements — Spiral Game (Frontend-Heavy Nx Monorepo)

## 1. Functional Requirements

### 1.1 Local Content Source
- The application shall load question content from a static `data.json` file.
- The `data.json` file shall be bundled/served with the frontend app.
- No server API shall be required to start or play a game session.

### 1.2 Game Engine (Frontend)
- The frontend shall initialize a new game session in browser memory.
- The frontend shall persist active session state in `localStorage`.
- The frontend shall render one question per level.
- The frontend shall validate answers locally.
- The frontend shall support level progression on correct answers.
- The frontend shall end the game immediately on an incorrect answer.
- The frontend shall allow players to cash out at any time during decision state.
- The frontend shall compute and display score in real time.
- The frontend shall persist final game result locally.

### 1.3 Scoring System
- Score shall increase based on completed levels.
- Cash-out shall apply a 20% penalty.
- Wrong answer shall end the run and set score to 0 for that run.

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
};
```

## 2. Non-Functional Requirements

| Category        | Requirement                                                        |
|-----------------|--------------------------------------------------------------------|
| Performance     | Gameplay works locally after loading `data.json`                   |
| Scalability     | Nx monorepo supports additional frontend modules and shared libs   |
| Maintainability | Shared types/utilities in `libs/`                                  |
| Reliability     | Game state survives refresh via `localStorage`                     |
| Usability       | Clear question/score/level UI with responsive layout               |
| Type Safety     | TypeScript enforced across frontend app and shared libraries       |

## 3. Technical Requirements

- Monorepo: Nx Workspace
- Frontend: React + TypeScript (`apps/spiral-game`)
- Shared Libraries: `game-types`, `game-utils`
- Data Format: Static JSON (`apps/spiral-game/public/data.json`)
- Core Workspace Scope: No server-side application in the core monorepo setup

## 4. Out of Scope

- Server-side content generation
- API/database persistence
- User accounts/authentication
- Multi-tenant or multi-game backend services
