# Architecture — Spiral Game (Frontend-Only)

## Overview

The Spiral Game is a frontend-centric application within an Nx monorepo wrapper. There is **no dedicated server-side component** bundled with this workspace. Instead, game logic executes entirely in the browser, and game content (questions) is loaded dynamically via **a direct API URL** or an imported **local demo JSON file**.

## High-Level Diagram

```txt
Nx Workspace
   apps/
      spiral-game (React + Vite)
         - Prompts user for Question Source (API URL / Local JSON)
         - Validates input format and fetches payload
         - Executes game loop fully within the browser
         - Manages application and session state via localStorage
   libs/
      game-types (TS Models/Interfaces: Question, Session, Result)
      game-utils (Pure logic constraints, scoring mechanics)
```

## System Responsibilities

- **`apps/spiral-game`**
   - User interface, rendering, and accessibility
   - Dynamic prompt ingestion (API Fetch / File API)
   - Handling level transitions, countdowns, state management hooks
   - Persistence layer (browser `localStorage`) wrapper

- **`libs/game-types`**
   - Domain-specific structural types representing the core entities (`Question`, `SpiralSession`, `GameResult`). Designed to be shared with potential external tooling or backend schemas.

- **`libs/game-utils`**
   - Pure functional helpers.
   - Core scoring implementation and answer validations.

## Data Flow

```txt
Start
   --> Player opens App
   --> Player inputs Direct API URL / Drops Demo JSON file
   --> Data validated & Session constructed (in-memory)
   --> Gameplay loop initiates (Q&As, cash-out logic, score updates)
   --> LocalState synchronized on every major event
End
   --> Game Completion Result logged to localStorage
```

## Design Rationale

- **Decoupled Backend**: Using a "bring-your-own-questions" model via API URL allows any backend to connect with the frontend simply by offering compatible JSON structure.
- **Latency-Free Gameplay**: Zero backend calls during the question progression process improves responsiveness and scalability.
- **Extensible Nx Framework**: Shared libraries `game-types` and `game-utils` ensure robust TypeScript usage and simpler migration paths if future modules are integrated.
