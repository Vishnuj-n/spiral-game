# Plan and Scope

## Goal

Maintain a frontend-only, local-first Spiral Game application within an Nx monorepo. The current implementation starts games from a bundled local data source (`/data.json`) and does not require a backend service.

## In Scope

- **Local Question Ingestion**: Load questions from `/data.json` at game start.
- **Local Game Engine**: Execute game logic, scoring, and level progression entirely within the browser.
- **Local Persistence**: Save game state, session updates, and final results locally using `localStorage`.
- **Reusable Libraries**: Maintain game-types and game-utils as shared libraries.

## Out of Scope

- **API URL Question Loading**: Not implemented in current app behavior.
- **File Upload Question Loading**: Not implemented in current app behavior.
- **Dedicated Backend Service**: No server-side API endpoints for game sessions.
- **Remote Database Storage**: Storing sessions or user accounts in a remote database.
