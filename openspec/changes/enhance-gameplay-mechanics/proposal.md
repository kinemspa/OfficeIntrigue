## Why

The current game loop is functional but lacks depth and replayability. The user has requested specific features to enhance engagement: a stronger game hook, varied win conditions, random events to disrupt the flow, and a progression system (upgrades/levels).

## What Changes

- **New Win Conditions**: Explicit "Hostile Takeover" (Impostor win) and "Productivity Goals" (Crew win).
- **Random Events System**: A new engine component that triggers global effects (e.g., "Server Crash" resets tasks, "HR Audit" blocks voting).
- **Progression System**: Persistent user stats (XP) across games, unlocking titles (Intern -> CEO) and cosmetic perks.
- **Game Hook Definition**: Solidifying the "Corporate Espionage" theme in the mechanics.

## Impact

- **Affected Specs**: New `gameplay` capability.
- **Affected Code**:
    - `src/services/GameEngine.ts`: Needs event trigger logic and win condition checks.
    - `src/models/types.ts`: Add `RandomEvent`, `UserStats` (extended), `Level`.
    - `src/routes/`: New endpoints for retrieving player profile/level.
