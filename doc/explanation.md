# Architectural Explanation

Spiral Game is a self-contained frontend application in an Nx monorepo. Current implementation uses a local bundled question source (`/data.json`) and executes all gameplay logic in browser memory.

## System Characteristics

- Local-first execution: no backend round trips during gameplay.
- Type-safe domain contracts in `libs/game-types`.
- Deterministic score computation in `libs/game-utils`.
- Session and result persistence using `localStorage`.

## Runtime Interaction

1. User opens the app.
2. App restores cached session when available.
3. User starts a new game, and app fetches `/data.json`.
4. Session is created and persisted as active.
5. Game loop advances through playing and decision states.
6. Final result is persisted when game completes, cashes out, or ends on wrong answer.
