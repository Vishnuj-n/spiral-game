# Plan & Scope — Spiral Game (Nx Monorepo)

## Project Goal

Deliver a fully functional **Spiral Game Module** (Risk/Reward Quiz) within the GameEngine system, implemented as a modular Nx Monorepo with a React frontend and Node/Express backend.

---

## Scope

### In Scope

| Feature                            | Status      |
|------------------------------------|-------------|
| Nx Monorepo workspace setup        | ✅ Done     |
| React frontend (`spiral-web`)      | ✅ Done     |
| Node/Express backend (`spiral-api`)| ✅ Done     |
| Shared TypeScript types (`game-types`) | ✅ Done |
| Shared scoring utils (`game-utils`)| ✅ Done     |
| PDF chapter parsing endpoint       | ✅ Done (CHAP 9.pmd.pdf pipeline) |
| Chunked AI JSON generation         | ✅ Done     |
| Session management                 | ✅ Done     |
| Spiral game loop (Q&A flow)        | ✅ Done     |
| Risk/Reward mechanic (Continue / Cash Out) | ✅ Done |
| Exponential scoring system         | ✅ Done     |
| localStorage caching               | ✅ Done     |
| Result submission to backend       | ✅ Done     |
| Dark-themed gamified UI            | ✅ Done     |
| Animations & UX polish             | 🔄 Polish Stage |

### Out of Scope

| Feature                            | Reason                              |
|------------------------------------|-------------------------------------|
| Multi-game orchestration engine    | Not required for current phase      |
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
- Implement PDF structural parsing + hierarchical chunking
- Integrate OpenAI-compatible endpoints (OpenAI/OpenRouter/Groq)
- Return `{ sessionId, questions[] }` response generated from chapter chunks
- **Deliverable:** Working API endpoint with live chunked LLM generation

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

+ ### Sprint 11 — API Availability & Production Readiness
+ - Implement Environment Variables (.env) for configuration
+ - Refactor main.ts into /routes and /controllers
+ - Add Swagger/OpenAPI documentation (accessible via /api-docs)
+ - Implement Request Validation (Zod/Joi) for all endpoints
+ - Add Security Middleware (Helmet + Rate Limiting)
+ - **Deliverable:** Fully documented, secure, and production-ready API

---
## Timeline Summary

| Sprint | Focus                    | Status         |
|--------|--------------------------|----------------|
| 1      | Setup                    | ✅ Done        |
| 2      | Shared libs              | ✅ Done        |
| 3      | Backend generate         | ✅ Done        |
| 4      | Frontend integration     | ✅ Done        |
| 5      | Game UI                  | ✅ Done        |
| 6      | Game logic               | ✅ Done        |
| 7      | Risk system              | ✅ Done        |
| 8      | Result submission        | ✅ Done        |
| 9      | Caching                  | ✅ Done        |
| 10     | Polish                   | 🚧 In Progress |

---

## Success Criteria

- PDF upload returns valid game JSON
- Player can complete a full game session end-to-end
- Cash-out locks score correctly; wrong answer ends game
- Final score is submitted to backend
- UI is responsive, dark-themed, and visually polished
- All shared types are used consistently across apps and libs
