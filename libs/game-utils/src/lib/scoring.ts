import { Question } from '@spiral-game/game-types';

// Base points per level (defined in Question.points)
// Score accumulates multiplicatively or additively as levels increase
export function calculateScore(levels: Question[], currentLevel: number): number {
  return levels
    .slice(0, currentLevel)
    .reduce((acc, q) => acc + q.points, 0)
}
