# Spiral Game Documentation

This documentation set describes a frontend-heavy Nx monorepo.
The core workspace contains a React app with local game logic and a static JSON data source.
There is no server-side component in the core workspace.

## Key Points

- App: `apps/spiral-game`
- Static data: `apps/spiral-game/public/data.json`
- Shared libs: `libs/game-types`, `libs/game-utils`
- Runtime persistence: browser `localStorage`

## Run

```bash
npm install
npx nx serve spiral-game
```
