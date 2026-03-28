# Schema Definitions

Below are the domain abstractions used by both the frontend user interface and the associated `libs/` workspace utility suites. The schema emphasizes a decoupled architecture where backend integration only needs to supply structurally matching JSON.

## Question

Represents a single query point in the escalation spiral.

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

A locally persisted tracking mechanism for the active game runtime. It tracks the payload loaded via an API endpoint or local file.

```ts
export type SpiralSession = {
  sessionId: string;
  questions: Question[];
  createdAt: string;
};
```

## GameResult

Produced following the user cashing out or missing a question. Also stored locally to view past achievements.

```ts
export type GameResult = {
  sessionId: string;
  finalScore: number;
  levelsReached: number;
  cashedOut: boolean;
  completedAt: string;
};
```
