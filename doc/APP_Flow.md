# App Flow (Frontend-Only, Dynamic Loading)

```txt
User opens spiral-game application
  --> Prompted to provide data input source (Direct API URL or Local Demo File)
  --> Application fetches/loads JSON question data from specified source
  --> Application parses the data and initializes a local game session
  --> Active state (sessionId, questions list) saved locally
  --> Gameplay executes completely within browser boundaries
  --> State transitions, scores, and final results persisted in localStorage
```

## Key Architectural Notes

- **No Remote API Dependency**: No dedicated backend API calls are necessary to begin or submit a game. Everything required to play and score is fetched initially or run locally.
- **Dynamic Configuration**: The frontend supports ingesting a payload (via URL or local file upload), enabling flexible and dynamic content generation from external services without binding the monorepo to a specific backend.
- **Robust Persistence**: Because game state and results exist in browser local storage, user session remains persistent across page refreshes.
