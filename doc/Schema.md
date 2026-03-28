# Schema

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

All schemas are used by frontend app code and shared libs only.
