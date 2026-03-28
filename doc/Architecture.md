# Architecture — Spiral Game (Frontend-Heavy)

## Overview

This workspace is an Nx monorepo centered on a single React application.
Game logic executes in-browser, and question content is loaded from static JSON.
There is no server-side component in the core workspace.

## High-Level Diagram

```txt
Nx Workspace
   apps/
      spiral-game (React + Vite)
         - loads public/data.json
         - runs game flow locally
         - persists state/results in localStorage
   libs/
      game-types (shared TS models)
      game-utils (scoring and helpers)
```

## Responsibilities

- `apps/spiral-game`
   - UI rendering and interaction
   - Session bootstrap from static data
   - Game state machine and progression
   - Result persistence in browser storage
- `libs/game-types`
   - Shared domain types (Question, SpiralSession, GameResult)
- `libs/game-utils`
   - Pure scoring and game helper logic

## Data Flow

```txt
User opens app
   -> app loads /data.json
   -> app builds session locally
   -> player answers questions
   -> score updates in UI
   -> session/result saved to localStorage
```

## Design Rationale

- Fast local gameplay with no API latency
- Minimal infrastructure footprint
- Easy to extend with additional frontend apps/libs in Nx
- Strong type reuse through shared libraries
