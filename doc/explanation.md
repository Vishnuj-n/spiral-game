# Explanation

Spiral Game is implemented as a frontend-centric quiz module in an Nx monorepo.

## Why this design

- Simpler local development: no backend startup dependency
- Faster gameplay: no runtime API latency for questions or scoring
- Easier portability: static data file can be versioned and swapped per scenario

## Runtime behavior

- Questions are loaded from `apps/spiral-game/public/data.json`
- A session is created in-browser
- Game progression and scoring are managed by frontend hooks/utilities
- Session and final result are saved to `localStorage`
