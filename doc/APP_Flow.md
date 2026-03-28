# App Flow (Frontend-Only)

```txt
User opens spiral-game
  -> app reads /data.json
  -> app creates local session (sessionId + questions)
  -> gameplay runs fully in browser
  -> state and result stored in localStorage
```

## Notes

- No API calls are required for question generation or result submission.
- The flow is resilient to refresh because session state is persisted locally.
