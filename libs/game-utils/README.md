# game-utils

Shared pure utilities for Spiral Game.

## Exports

- `calculateScore(levels, currentLevel)` from `src/lib/scoring.ts`
- `gameUtils()` placeholder from `src/lib/game-utils.ts`

## Behavior

`calculateScore` adds `points` from level `0` through `currentLevel - 1`.

## Usage

```ts
import { calculateScore } from '@spiral-game/game-utils';
```

## Build

```bash
npx nx build @spiral-game/game-utils
```
