# Plan and Scope

## Goal

Maintain a frontend-only, local-first Spiral Game application within an Nx monorepo. The core application provides dynamic game loading by ingesting game questions via either a direct API URL or a local demo file, removing the need for a dedicated backend service.

## In Scope

- **Dynamic Question Ingestion**: Load questions dynamically from an external API URL or a local JSON demo file.
- **Local Game Engine**: Execute game logic, scoring, and level progression entirely within the browser.
- **Local Persistence**: Save game state, session updates, and final results locally using `localStorage`.
- **Reusable Libraries**: Maintain game-types and game-utils as shared libraries.

## Out of Scope

- **Dedicated Backend Service**: No server-side API endpoints for game sessions.
- **Server-Side File Processing**: Processing or parsing files on a backend server (e.g., PDF processing).
- **Remote Database Storage**: Storing game sessions or user accounts in a remote database.
