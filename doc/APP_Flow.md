# App Flow — Spiral Game (Nx Monorepo)

## Overview

The application is split into two phases:
1. **Setup Phase** — Chapter PDF parsing + chunked JSON generation (Backend)
2. **Game Phase** — Local gameplay → Result submission (Frontend)

---

## End-to-End Flow

```
┌─────────────────────────────────────────────────────────┐
│                      USER ACTION                        │
│               Start Game Request (POST)                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   spiral-api (Backend)                  │
│  POST /generate/spiral                                  │
│  1. Load chapter PDF (CHAP 9.pmd.pdf)                  │
│  2. Structural parse + heading hierarchy                │
│  3. Generate Spiral JSON (chunked LLM calls)           │
│  4. Assign sessionId                                    │
│  5. Return { sessionId, questions[] }                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  spiral-web (Frontend)                  │
│  1. Receive JSON                                        │
│  2. Cache in localStorage / React state                 │
│  3. Initialize game (level 1, score 0)                  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      GAME LOOP                          │
│                                                         │
│  Render Question (current level)                        │
│         │                                               │
│         ├──► Player selects answer                      │
│         │                                               │
│         │    CORRECT?                                   │
│         │    ├── YES ──► Update score                   │
│         │    │           Show: [Continue] [Cash Out]    │
│         │    │                │              │          │
│         │    │           Continue        Cash Out       │
│         │    │           (next level)    (lock score)   │
│         │    │                                          │
│         │    └── NO  ──► End Game (score = 0 or lost)  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    GAME ENDS                            │
│   (Wrong answer OR Cash Out OR all levels complete)     │
│                                                         │
│   Display: Final Score Summary                          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                spiral-api (Backend)                     │
│  POST /spiral/result                                    │
│  Payload: { sessionId, finalScore, levelsReached }      │
│  Store result                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Hook Flow (`useSpiralGame`)

```
useSpiralGame initialises
      │
      ├── currentLevel = 1
      ├── score = 0
      ├── questions = cached JSON
      │
      ▼
answerQuestion(selectedIndex)
      │
      ├── Correct → increment score → show Continue / CashOut
      └── Wrong   → endGame()
      
cashOut()
      └── lock current score → endGame()

endGame()
      └── POST result to /spiral/result
```

---

## State Transitions

| State          | Trigger                       | Next State        |
|----------------|-------------------------------|-------------------|
| `idle`         | App loads                     | `uploading`       |
| `uploading`    | Generate request sent         | `loading`         |
| `loading`      | JSON received from API        | `playing`         |
| `playing`      | Answer correct                | `decision`        |
| `decision`     | Player clicks Continue        | `playing`         |
| `decision`     | Player clicks Cash Out        | `finished`        |
| `playing`      | Answer wrong                  | `finished`        |
| `finished`     | Result posted to API          | `result_displayed`|

---

## Caching Strategy

- On JSON receipt → store in `localStorage` under key `spiral_session_{sessionId}`
- On game start → check `localStorage` before API call
- On game end → clear session cache
