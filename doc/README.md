# Spiral Game Documentation

This folder contains implementation-aligned documentation for the current Spiral Game behavior.

## Contents

- `Requirements.md`: functional and non-functional requirements for current implementation.
- `Architecture.md`: app and library responsibilities, storage keys, and flow.
- `APP_Flow.md`: UI state and runtime transitions.
- `Schema.md`: shared domain types.
- `Plan_Scope.md`: in-scope and out-of-scope boundaries.
- `explanation.md`: concise architecture narrative.

## Current Product Facts

- Frontend app: `apps/spiral-game` (React + TypeScript).
- Question source: bundled local `/data.json`.
- Persistence: `localStorage` for active session, state snapshots, and final results.
- Backend services: not required for gameplay.
