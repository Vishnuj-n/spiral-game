# Requirements - Spiral Game (Implemented)

## 1. Functional Requirements

### 1.1 Question Loading
- The app loads questions from the bundled local file `/data.json`.
- The loaded payload must include a non-empty `questions` array.
- If loading or validation fails, the app shows an error message and does not start a session.

### 1.2 Session Lifecycle
- Starting a game creates a new `SpiralSession` in memory.
- The active session is persisted to `localStorage` under `spiral_active_session`.
- If a cached session exists, the app attempts to restore it on startup.
- Corrupt cached session data is cleared automatically.

### 1.3 Gameplay Rules
- Questions are answered one level at a time.
- Correct answer: score increases by cumulative points up to the current level and the game enters a decision state.
- Decision state: player can continue or cash out.
- Cash out: score is reduced by 20% and game ends.
- Wrong answer: game ends immediately with score reset to 0.
- Last correct answer on final level: game ends as completed.

### 1.4 Persistence of Progress and Results
- Per-session game state is stored under `spiral_game_state_<sessionId>`.
- Final results are stored under `spiral_result_<sessionId>`.
- Play Again clears active session and per-session state.

### 1.5 Domain Model

```ts
type Question = {
  id: number;
  level: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  points: number;
};
```

## 2. Non-Functional Requirements

- Frontend-only runtime (no backend required for gameplay).
- Responsive interaction with client-side validation and scoring.
- Type-safe boundaries using shared libraries.
- Refresh resilience through `localStorage` state restore.

## 3. Out of Scope

- API URL input workflow.
- Local file upload workflow.
- Backend game services or remote persistence.
- Authentication and user profiles.
