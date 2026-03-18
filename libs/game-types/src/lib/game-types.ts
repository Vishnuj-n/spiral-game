// Shared Game Types for Spiral Game

export type Question = {
  id: number           // Unique question identifier
  level: number        // Spiral level (1 = easiest, N = hardest)
  question: string     // The question text displayed to the player
  options: string[]    // Array of answer choices (typically 4)
  correctIndex: number // Zero-based index of the correct option in `options[]`
  hint: string         // Optional hint text shown to player
  points: number       // Points awarded for a correct answer at this level
}

export type SpiralSession = {
  sessionId: string       // Unique session UUID
  questions: Question[]   // Ordered array of questions (by level)
  createdAt: string       // ISO 8601 timestamp of session creation
}

export type GameResult = {
  sessionId: string       // Links result to original session
  finalScore: number      // Score locked in via cash-out or last correct answer
  levelsReached: number   // Number of levels the player successfully completed
  cashedOut: boolean      // true if player chose to cash out; false if game ended on wrong answer
  completedAt: string     // ISO 8601 timestamp of game completion
}
