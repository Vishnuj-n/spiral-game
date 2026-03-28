# Requirements — Spiral Game (Frontend-Only, Dynamic Loading)

## 1. Functional Requirements

### 1.1 Dynamic Content Loading
- The application shall provide an interface to load question data via a direct API URL.
- The application shall support importing question data from a local JSON file payload.
- No dedicated backend service is necessary or bundled for core application behavior.

### 1.2 Game Engine (Frontend)
- The frontend shall parse the incoming source data into a structured format instantly.
- The runtime shall instantiate a new session in-memory and mirror the state to `localStorage`.
- The presentation layer shall render a sequence of questions matching the user's level.
- Input answers shall be validated locally by the active browser tab.
- Correct answers shall advance the player to the next consecutive level.
- Incorrect answers shall permanently end the session.
- The user interface shall provide an explicit cash-out mechanism reflecting point security.
- Comprehensive session summaries and results shall be maintained client-side over time.

### 1.3 Scoring Architecture
- Scores accumulate per successive valid response.
- Utilizing the cash-out mechanism induces a configurable penalty (e.g., 20%).
- Concluding a run early due to a missed question zeroes out the current run payload.

### 1.4 Abstract Question Model
A parsed question adheres strictly to this structure:

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

## 2. Non-Functional Specifications

| Element             | Description                                                          |
|---------------------|----------------------------------------------------------------------|
| Agility             | Dynamic payloads allow instant game scenario switching               |
| Extensibility       | Leveraging Nx isolates functional bounds via libraries and utilities |
| Interactivity       | Real-time computations in-browser enable latency-free response UI    |
| Reusability         | Libraries like `game-types` expose types for possible future APIs    |
| Tenacity            | Page refreshing persists progress via unified `localStorage` hooks   |

## 3. Technology Alignment

- **Structure:** Nx Monorepo Toolkit
- **SPA Framework:** React 18, utilizing TypeScript (`apps/spiral-game`)
- **Shared Entities:** `game-types`, `game-utils`
- **Architectural Flow:** Local-First, client-side only processing

## 4. Feature Exclusions (Out of Scope)

- Native backend API scaffolding
- Database provision or integration
- Account authorization/registration systems
- Hosted file manipulations
