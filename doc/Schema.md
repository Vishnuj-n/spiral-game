# Schema Definitions

Shared domain contracts are defined in `libs/game-types/src/lib/game-types.ts` and used by both app and utility code.

## Question

```ts
export type Question = {
  id: number;
  level: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  points: number;
};
```

## SpiralSession

```ts
export type SpiralSession = {
  sessionId: string;
  questions: Question[];
  createdAt: string;
};
```

## GameResult

```ts
export type GameResult = {
  sessionId: string;
  finalScore: number;
  levelsReached: number;
  cashedOut: boolean;
  completedAt: string;
};
```
