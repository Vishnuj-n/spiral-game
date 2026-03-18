# Architecture — Spiral Game (Nx Monorepo)

## Overview

The Spiral Game is built as a **modular Nx Monorepo** with a clear separation between the React frontend (`spiral-web`), the Node/Express backend (`spiral-api`), and shared libraries (`libs/`).

---

## High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      Nx Monorepo                             │
│                                                              │
│  ┌─────────────────────┐    ┌──────────────────────────┐    │
│  │    spiral-web        │    │       spiral-api          │    │
│  │    (React App)       │◄──►│    (Node/Express API)    │    │
│  │                     │    │                          │    │
│  │  - Pages            │    │  - Controllers           │    │
│  │  - Components       │    │  - Services              │    │
│  │  - Hooks            │    │  - Routes                │    │
│  │  - useSpiralGame()  │    │  - POST /generate/spiral │    │
│  │                     │    │  - POST /spiral/result   │    │
│  └────────┬────────────┘    └───────────┬──────────────┘    │
│           │                             │                    │
│           └──────────┬──────────────────┘                   │
│                      │                                       │
│          ┌───────────▼──────────────┐                       │
│          │        libs/             │                       │
│          │                          │                       │
│          │  ┌────────────────────┐  │                       │
│          │  │   game-types/      │  │  ← Shared TypeScript  │
│          │  │   (Question, etc.) │  │    types              │
│          │  └────────────────────┘  │                       │
│          │  ┌────────────────────┐  │                       │
│          │  │   game-utils/      │  │  ← Scoring logic,     │
│          │  │   (score calc.)    │  │    helpers            │
│          │  └────────────────────┘  │                       │
│          │  ┌────────────────────┐  │                       │
│          │  │  ui-components/    │  │  ← Shared React UI    │
│          │  │  (optional)        │  │    components         │
│          │  └────────────────────┘  │                       │
│          └──────────────────────────┘                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
my-nx-workspace/
│
├── apps/
│   ├── spiral-web/                  # React Frontend
│   │   └── src/
│   │       ├── components/          # UI components (QuestionCard, ScoreBoard, etc.)
│   │       ├── hooks/               # useSpiralGame() custom hook
│   │       ├── pages/               # Route-level pages
│   │       └── App.tsx              # Root component
│   │
│   └── spiral-api/                  # Node/Express Backend
│       └── src/
│           ├── controllers/         # Request handlers
│           ├── services/            # Business logic (PDF → JSON generation)
│           ├── routes/              # API route definitions
│           └── main.ts              # Entry point
│
├── libs/
│   ├── game-types/                  # Shared TypeScript types
│   │   └── src/
│   │       └── index.ts             # Question, Session, Result types
│   │
│   ├── game-utils/                  # Shared utilities
│   │   └── src/
│   │       └── scoring.ts           # Score calculation logic
│   │
│   └── ui-components/               # (Optional) Shared React components
│       └── src/
│           └── index.ts
│
├── nx.json                          # Nx workspace config
├── tsconfig.base.json               # Shared TypeScript config
└── package.json
```

---

## Component Responsibilities

### `spiral-web` (Frontend)

| Layer        | File/Folder        | Responsibility                              |
|--------------|--------------------|---------------------------------------------|
| Pages        | `pages/`           | Route-level views (Home, Game, Result)      |
| Components   | `components/`      | QuestionCard, OptionsGrid, ScoreDisplay, ActionButtons |
| Hooks        | `hooks/useSpiralGame.ts` | Game state machine, answer logic, cash-out |
| App Root     | `App.tsx`          | Routing, global providers                  |

### `spiral-api` (Backend)

| Layer        | File/Folder        | Responsibility                              |
|--------------|--------------------|---------------------------------------------|
| Routes       | `routes/`          | Define API endpoints                        |
| Controllers  | `controllers/`     | Handle HTTP req/res                         |
| Services     | `services/`        | PDF parsing, JSON generation (AI-simulated) |
| Entry Point  | `main.ts`          | Bootstrap Express server                    |

### Shared Libs

| Library        | Purpose                            |
|----------------|------------------------------------|
| `game-types`   | `Question`, `Session`, `GameResult` TypeScript interfaces |
| `game-utils`   | Score computation, level validation |
| `ui-components`| Reusable React UI primitives (optional) |

---

## Data Flow

```
PDF Upload
   │
   ▼
spiral-api
   │  Extract text from PDF
   │  Simulate AI → build Question[]
   │  Create session { sessionId, questions }
   ▼
HTTP Response → JSON
   │
   ▼
spiral-web
   │  Cache JSON (localStorage / state)
   │  Run game locally — NO further API calls during play
   │  useSpiralGame() manages all game state
   ▼
Game Over
   │
   ▼
POST /spiral/result → spiral-api stores result
```

---

## Technology Decisions

| Decision                    | Choice             | Reason                                       |
|-----------------------------|--------------------|----------------------------------------------|
| Monorepo tooling            | Nx                 | Code sharing, build caching, project graph   |
| Frontend framework          | React + TypeScript | Component model, type safety                 |
| Backend framework           | Express + TypeScript | Lightweight, fast API setup                 |
| AI integration              | Simulated JSON     | Decouples game from live AI for demo         |
| Game runs locally           | Frontend state     | Zero latency mid-game, no API rate limits    |
| Type sharing                | `game-types` lib   | Single source of truth across apps           |
