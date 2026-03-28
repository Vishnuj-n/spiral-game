# Spiral Game

Spiral Game is a frontend-only quiz game in an Nx monorepo.

## What Is Implemented

- React app at `apps/spiral-game`.
- Shared types at `libs/game-types`.
- Shared scoring utility at `libs/game-utils`.
- Question loading from local `/data.json`.
- Client-side gameplay state machine with cash-out decision.
- Browser persistence with `localStorage`.

## Workspace Layout

```txt
apps/
  spiral-game/
libs/
  game-types/
  game-utils/
doc/
```

## Local Development

```bash
npm install
npx nx serve spiral-game
```

## Build

```bash
npx nx build spiral-game
```

## Quality Checklist

Run this checklist before merging:

- [ ] Unit tests pass:

```bash
npx nx test spiral-game --skip-nx-cache --outputStyle=static
```

- [ ] Lint passes:

```bash
npx nx lint spiral-game --skip-nx-cache --outputStyle=static
```

- [ ] App starts and loads questions from `/data.json`.
- [ ] Core flow verified manually:
  - Correct answer -> decision state
  - Cash out -> 20% penalty
  - Wrong answer -> score resets to 0
  - Completed run -> finished state
- [ ] Persistence verified:
  - `spiral_active_session`
  - `spiral_game_state_<sessionId>`
  - `spiral_result_<sessionId>`

## Documentation

See `doc/README.md` for detailed project docs.
