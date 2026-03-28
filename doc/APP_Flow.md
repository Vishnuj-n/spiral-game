# App Flow (Implemented)

```txt
User opens application
  -> App attempts to restore spiral_active_session
  -> User clicks Start New Game
  -> App fetches /data.json
  -> App validates questions payload
  -> App creates session and stores spiral_active_session
  -> Playing state: user answers current question
       -> correct: score updates, move to decision state
       -> wrong: score becomes 0, game finishes
  -> Decision state: user chooses
       -> continue: next level, back to playing
       -> cash out: 20% penalty, game finishes
  -> Finished state: final score shown, result persisted
  -> Play Again clears active session cache and returns to start screen
```

## UI States

- Start screen
- Playing
- Decision
- Finished
