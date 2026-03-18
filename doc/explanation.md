# 🚀 🧠 FINAL PROJECT EXPLANATION (SPIRAL GAME — NX MONOREPO)

---

## 🎯 PROJECT OVERVIEW

We are building a **Spiral Game Module (Risk/Reward Quiz)** as part of the GameEngine system.

This project is implemented using an **Nx Monorepo architecture** with:

* React (Frontend App)
* Node/Express (Backend API)
* TypeScript (shared)
* JSON (AI simulation)

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
| AI content generation | ✅ Backend generates JSON |
| Spiral game           | ✅ Implemented            |
| Risk/Reward system    | ✅                        |
| Cash-out system       | ✅                        |
| Scoring system        | ✅                        |
| Game flow             | ✅                        |
| Gamified UI           | ✅                        |
| Full AI integration   | ❌ Simulated              |

👉 Conclusion:
This is a correct **modular implementation of Spiral Game inside GameEngine**

---

## 🧠 CORE CONCEPT

👉
**Backend = AI Generator (simulated)**
**Frontend = Game Runner**

Flow:

* Backend generates **Spiral JSON from PDF**
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
* Generate Spiral JSON (simulated AI)
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
* Cash-out system
* Progressive difficulty

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
* JSON

---

## 🎤 WHAT TO SAY (FINAL)

👉
“We are building a Spiral game module inside an Nx monorepo architecture. The backend simulates AI by generating structured JSON from uploaded content, and the frontend consumes this JSON to run the game locally. The system uses a risk-reward mechanism where players can either continue to gain higher scores or cash out. This separation allows scalable backend generation and high-performance frontend gameplay.”

---

## 🧠 FINAL UNDERSTANDING

👉 This project is:

* ✅ Modular (Nx monorepo)
* ✅ Backend + Frontend separation
* ✅ AI simulated via JSON
* ✅ Local game execution
* ✅ Scalable architecture

