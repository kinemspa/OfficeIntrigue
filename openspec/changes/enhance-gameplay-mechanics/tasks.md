## 1. Core Mechanics

- [ ] 1.1 Define `WinCondition` types in `src/models/types.ts` (Crew: Task Completion, Elimination; Impostor: Sabotage, Parity).
- [ ] 1.2 Implement win condition checks in `GameEngine.ts` after every task completion and vote.

## 2. Random Events

- [ ] 2.1 Create `RandomEvent` interface (id, type, duration, effect).
- [ ] 2.2 Implement `EventScheduler` in `GameEngine` to trigger events (e.g., 5% chance per tick or action).
- [ ] 2.3 Implement specific events: "Server Crash" (un-complete random tasks), "Mandatory Meeting" (force voting phase).

## 3. Progression System

- [ ] 3.1 Update `Player` model to include `xp` and `level`.
- [ ] 3.2 Create `LevelCalculator` service (XP curve, title mapping).
- [ ] 3.3 Implement XP awards at end-of-game (Win: +100, Loss: +50, MVP: +25).
- [ ] 3.4 Add API endpoint `GET /api/profile` to view progress.

## 4. UI Updates

- [ ] 4.1 Add "Game Over" screen with win reason and XP gains.
- [ ] 4.2 Add "Event Notification" banner in the game HUD.
- [ ] 4.3 Add "Profile" section to Main Menu showing Rank/Title.

## 5. Thematic Engine

- [ ] 5.1 Update `Environment` interface in `src/models/types.ts` to include `terminology` map.
- [ ] 5.2 Refactor frontend `game.js` to use dynamic labels from the active environment config.
- [ ] 5.3 Update `pirate-ship.json` and `spaceship.json` to remove corporate puns and use pure thematic text.
