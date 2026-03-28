# Spiral Game Documentation

The Spiral Game app operates as a frontend-centric, local-first application within an Nx monorepo. It features dynamic game loading: users can inject game questions by providing a **direct API URL** or by uploading a **local demo file**.

## Core Concepts

- **Frontend Target:** `apps/spiral-game` (React/TypeScript).
- **Data Ingestion:** Game questions are dynamically evaluated without native API endpoints. The app asks the user for a web hook or local file upload at startup.
- **Shared Functionality:** Available in `libs/game-types` and `libs/game-utils`.
- **Game State/Storage:** Strictly browser `localStorage`.
- **Backend Infrastructure:** Not required within the core workspace for gameplay.

## Run Development environment

```bash
npm install
npx nx serve spiral-game
```
