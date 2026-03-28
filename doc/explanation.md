# Architectural Explanation

Spiral Game acts as a fully self-contained, frontend-centric client constructed within an Nx monorepo paradigm.

## System Characteristics

- **Dynamic Loading First**: To support disparate services, game payloads (incorporating `Question[]` subsets) are loaded via a **direct API URL** request or a standard **local JSON file**.
- **Self-Contained Resolution**: Zero server dependence allows instantaneous validation of gameplay responses and dynamic level progression in the host browser.
- **Robustness via Decoupling**: Because the app merely expects a structured array of Questions, any external system or generator can output the file formatting and immediately be run by the `spiral-game` UI.

## Runtime Interaction

1. Users access the initial application render.
2. A generic input prompt permits loading external questions via URL or Desktop File.
3. Once accepted and structurally matched to `types`, a `SpiralSession` runs in browser memory.
4. Active logic cascades through the `libs/game-utils` suite to resolve inputs.
5. All data persists robustly inside the DOM's `localStorage` capability, preventing accidental process interruption.
