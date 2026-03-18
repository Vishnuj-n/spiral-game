# Plan & Scope — Spiral Game (Nx Monorepo)

## Project Goal

Deliver a fully functional **Spiral Game Module** (Risk/Reward Quiz) within the GameEngine system, implemented as a modular Nx Monorepo with a React frontend and Node/Express backend.

---

## Scope

### In Scope

| Feature                            | Status      |
|------------------------------------|-------------|
| Nx Monorepo workspace setup        | ✅ Included |
| React frontend (`spiral-web`)      | ✅ Included |
| Node/Express backend (`spiral-api`)| ✅ Included |
| Shared TypeScript types (`game-types`) | ✅ Included |
| Shared scoring utils (`game-utils`)| ✅ Included |
| PDF upload endpoint                | ✅ Included |
| Simulated AI JSON generation       | ✅ Included |
| Session management                 | ✅ Included |
| Spiral game loop (Q&A flow)        | ✅ Included |
| Risk/Reward mechanic (Continue / Cash Out) | ✅ Included |
| Exponential scoring system         | ✅ Included |
| localStorage caching               | ✅ Included |
| Result submission to backend       | ✅ Included |
| Dark-themed gamified UI            | ✅ Included |
| Animations & UX polish             | ✅ Included |

### Out of Scope

| Feature                            | Reason                              |
|------------------------------------|-------------------------------------|
| Live AI (Claude) API               | Simulated for demo purposes         |
| User authentication                | Not required for MVP                |
| Database (SQL/NoSQL)               | In-memory storage sufficient        |
| Multiple game types                | Spiral only in this module          |
| CI/CD pipeline                     | Infrastructure not in demo scope    |
| Mobile app                         | Web-only                            |

---

## Sprint Plan (10 Sprints)

### Sprint 1 — Workspace Setup
- Create Nx workspace
- Generate `spiral-web` (React) and `spiral-api` (Express) apps
- Configure `tsconfig.base.json` and shared paths
- **Deliverable:** Running monorepo with empty apps

---

### Sprint 2 — Shared Libraries
- Create `game-types` lib
- Define `Question`, `Session`, `GameResult` TypeScript types
- Export from lib index
- **Deliverable:** Importable shared types in both apps

---

### Sprint 3 — Backend: Generate Endpoint
- Build `POST /generate/spiral` route
- Implement simulated PDF-to-JSON generator (mock AI)
- Return `{ sessionId, questions[] }` response
- **Deliverable:** Working API endpoint with mock data

---

### Sprint 4 — Frontend: API Integration
- Build API call in `spiral-web`
- Fetch JSON from `spiral-api` on game start
- Store questions in React state
- **Deliverable:** Frontend receives and stores game data

---

### Sprint 5 — Game UI: Question Display
- Build `QuestionCard` component
- Render question text and answer options
- Display current level and score
- **Deliverable:** Static game UI renders a question

---

### Sprint 6 — Game Logic: Answer Validation
- Implement `useSpiralGame()` hook
- `answerQuestion()` — validates selection, updates score
- Level progression on correct answers
- **Deliverable:** Interactive question answering works

---

### Sprint 7 — Risk System: Continue / Cash Out
- Add `cashOut()` to hook — locks in score
- Show action buttons after each correct answer
- End game on wrong answer or cash-out
- **Deliverable:** Full risk/reward mechanic functional

---

### Sprint 8 — Result Submission
- Implement `POST /spiral/result` backend endpoint
- Frontend `endGame()` POSTs `{ sessionId, finalScore, levelsReached }`
- Display game-over summary screen
- **Deliverable:** Results stored in backend

---

### Sprint 9 — Caching
- Integrate `localStorage` to persist game JSON
- Resume game on page refresh if session active
- Clear cache on game completion
- **Deliverable:** Resilient game session

---

### Sprint 10 — Polish & Animations
- Add transition animations between questions
- Refine dark-theme styling
- Score highlight effects
- Final UX review and bug fixes
- **Deliverable:** Production-ready demo build

---

## Timeline Summary

| Sprint | Focus                    | Key Output                     |
|--------|--------------------------|--------------------------------|
| 1      | Setup                    | Nx workspace running           |
| 2      | Shared libs              | Types defined                  |
| 3      | Backend generate         | API returns mock JSON          |
| 4      | Frontend integration     | Game data fetched              |
| 5      | Game UI                  | Question rendered              |
| 6      | Game logic               | Answers validated              |
| 7      | Risk system              | Cash-out working               |
| 8      | Result submission        | Results stored                 |
| 9      | Caching                  | Session persists               |
| 10     | Polish                   | Demo-ready UI                  |

---

## Success Criteria

- PDF upload returns valid game JSON
- Player can complete a full game session end-to-end
- Cash-out locks score correctly; wrong answer ends game
- Final score is submitted to backend
- UI is responsive, dark-themed, and visually polished
- All shared types are used consistently across apps and libs
