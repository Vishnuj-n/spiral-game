# Architecture - Spiral Game (Frontend-Only)

## Overview

Spiral Game runs as a React SPA in an Nx monorepo. Gameplay is fully client-side. Question data is currently loaded from the bundled `public/data.json` file when the user starts a new game.

## Workspace Structure

```txt
apps/
   spiral-game
      src/app/app.tsx                # top-level screen state and start flow
      src/app/hooks/useSpiralGame.ts # core gameplay state machine
      src/app/components/QuestionCard.tsx

libs/
   game-types
      src/lib/game-types.ts          # Question, SpiralSession, GameResult
   game-utils
      src/lib/scoring.ts             # calculateScore
```

## Runtime Responsibilities

- App shell (`app.tsx`)
   - Restores active session from `localStorage`.
   - Loads `/data.json` and creates a new session.
   - Routes UI among start, playing, decision, and finished views.

- Game hook (`useSpiralGame.ts`)
   - Maintains `currentLevelIndex`, `status`, `endReason`, and `score`.
   - Persists per-session state and final results.
   - Applies rules for answer evaluation, cash-out penalty, and game termination.

- Shared libraries
   - `game-types`: strongly typed game contracts.
   - `game-utils`: score accumulation logic.

## Data Flow

```txt
App open
   -> restore spiral_active_session (optional)
   -> Start New Game
   -> fetch /data.json
   -> validate questions array
   -> create SpiralSession
   -> persist spiral_active_session
   -> run gameplay loop
   -> persist spiral_game_state_<sessionId> on state changes
   -> persist spiral_result_<sessionId> on finish
```

## Storage Keys

- `spiral_active_session`
- `spiral_game_state_<sessionId>`
- `spiral_result_<sessionId>`
