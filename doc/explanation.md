# 🚀 🧠 FINAL PROJECT EXPLANATION (SPIRAL GAME — NX MONOREPO)

---

## 🎯 PROJECT OVERVIEW

We are building a **Spiral Game Module (Risk/Reward Quiz)** as part of the GameEngine system.

This project is implemented using an **Nx Monorepo architecture** with:

* React (Frontend App)
* Node/Express (Backend API)
* TypeScript (shared)
* OpenAI-compatible LLM integration (OpenAI/OpenRouter/Groq)

---

## 📄 ALIGNMENT WITH PRD

📄 FULL SYSTEM (PRD) 

* Upload learning material
* AI (Claude) generates questions
* Multiple games
* Full GameEngine

---

### 🎮 OUR DEMO IMPLEMENTATION

| PRD Requirement       | Implementation           |
| --------------------- | ------------------------ |
| AI content generation | ✅ Backend generates chunked questions from PDF |
| Spiral game           | ✅ Implemented            |
| Risk/Reward system    | ✅                        |
| Cash-out system       | ✅                        |
| Scoring system        | ✅                        |
| Game flow             | ✅                        |
| Gamified UI           | ✅                        |
| Full AI integration   | ✅ OpenAI-compatible       |

👉 Conclusion:
This is a correct **modular implementation of Spiral Game inside GameEngine**

---

## 🧠 CORE CONCEPT

👉
**Backend = AI Generator (live, chunk-based)**
**Frontend = Game Runner**

Flow:

* Backend parses chapter PDF and generates **Spiral JSON via chunked LLM calls**
* Frontend **runs game locally**
* Result sent back to backend

---

## 🔄 APPLICATION FLOW

```text
Upload PDF → Backend → Generate JSON → Send to Frontend
      ↓
Cache JSON → Play Locally (No API Calls)
      ↓
Game Ends → Send Result to Backend
```

### Parsing and Chunking Strategy

* Structural parsing detects chapters, sections, and headings.
* Hierarchy is preserved before chunking.
* Hierarchical chunking follows Chapter → Sections → chunks.
* Chunk target: around 300-800 tokens.
* Full chapter is never sent in one request.
* Each chunk is processed independently for predictable cost and retries.

---

## 🏗️ NX MONOREPO ARCHITECTURE

```text
apps/
  ├── spiral-web/        → React frontend
  └── spiral-api/        → Backend (Node/Express)

libs/
  ├── game-types/        → Shared TypeScript types
  ├── game-utils/        → Scoring logic
  └── ui-components/     → Shared UI (optional)
```

---

## 📁 PROJECT STRUCTURE

```text
my-nx-workspace/
│
├── apps/
│   ├── spiral-web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── App.tsx
│   │
│   └── spiral-api/
│       ├── src/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── routes/
│       │   └── main.ts
│
├── libs/
│   ├── game-types/
│   ├── game-utils/
│   └── game-data/
│
└── nx.json
```

---

## 📄 DATA STRUCTURE (SHARED)

```ts
export type Question = {
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

## ⚙️ BACKEND (spiral-api)

### Responsibilities

* Accept PDF
* Extract text
* Generate Spiral JSON (chunked LLM calls)
* Return JSON
* Store session
* Accept results

---

### API Endpoints

#### Generate Game

```http
POST /generate/spiral
```

Response:

```json
{
  "sessionId": "abc123",
  "questions": [...]
}
```

---

#### Submit Result

```http
POST /spiral/result
```

---

## 💻 FRONTEND (spiral-web)

### Responsibilities

* Call backend once
* Store JSON in cache
* Run game locally
* Handle UI + logic
* Send result after completion

---

## 🧠 FRONTEND LOGIC FLOW

```text
Fetch JSON → Store → Start Game
      ↓
Render Question
      ↓
Answer →
   Correct → Continue / Cashout
   Wrong → End Game
      ↓
Send Result
```

---

## 🧩 HOOK DESIGN

```ts
useSpiralGame()

- currentLevel
- score
- questions
- answerQuestion()
- cashOut()
- endGame()
```

---

## 🚀 SPRINT PLAN (NX BASED)

### 🏁 Sprint 1 — Setup

* Create Nx workspace
* Generate apps:

  * spiral-web
  * spiral-api

---

### 🏁 Sprint 2 — Shared Libs

* Create `game-types`
* Define Question model

---

### 🏁 Sprint 3 — Backend

* Create `/generate/spiral`
* Return mock JSON

---

### 🏁 Sprint 4 — Frontend Integration

* Fetch JSON
* Store in state

---

### 🏁 Sprint 5 — Game UI

* Question card
* Options
* Score

---

### 🏁 Sprint 6 — Game Logic

* Validate answer
* Level progression

---

### 🏁 Sprint 7 — Risk System

* Continue / Cashout

---

### 🏁 Sprint 8 — Result API

* Send result to backend

---

### 🏁 Sprint 9 — Caching

* localStorage integration

---

### 🏁 Sprint 10 — Polish

* animations
* UX improvements

---

## 🎮 GAMIFICATION FEATURES

* Risk vs reward
* Exponential scoring
* Cash-out system (with 20% early exit penalty)
* Progressive difficulty
* Session persistence (localStorage state recovery)

---

## 🎨 UI REQUIREMENTS

* Dark theme
* Card-based layout
* Score highlight
* Level indicator
* Action buttons (Continue / Cashout)

---

## ⚙️ TECH STACK

* Nx Monorepo
* React
* Node.js / Express
* TypeScript
* OpenAI-compatible APIs

---

## 🎤 WHAT TO SAY (FINAL)

👉
“We are building a Spiral game module inside an Nx monorepo architecture. The backend parses textbook chapter PDFs and generates structured quiz JSON using OpenAI-compatible LLM endpoints in chunked requests. The frontend consumes this JSON to run the game locally. The system uses a risk-reward mechanism where players can either risk their score for the next level or cash out with a 20% penalty. The state is fully persisted in localStorage, allowing resilient gameplay even across page refreshes.”

---

## 🧠 FINAL UNDERSTANDING

👉 This project is:

* ✅ Modular (Nx monorepo)
* ✅ Backend + Frontend separation
* ✅ AI generated via chunked LLM calls
* ✅ Local game execution
* ✅ Scalable architecture

