## Context

The project is evolving from a simple prototype to a feature-rich game. We are introducing complex mechanics (Random Events, Progression) and a dynamic theming engine that requires decoupling the UI from hardcoded strings.

## Goals

- **Modular Mechanics**: Win conditions and events should be pluggable strategies, not hardcoded `if` statements.
- **Data-Driven UI**: The frontend must render text based entirely on the active environment configuration.
- **Persistence**: Player stats must survive server restarts (preparing for DB migration).

## Decisions

### 1. Thematic Terminology System

**Decision**: We will implement a `TerminologyMap` in the `Environment` interface.
**Rationale**: Hardcoding "Office" terms in the frontend prevents true multi-genre support.
**Schema**:
```typescript
interface TerminologyMap {
  integrity: string; // e.g., "Hull Integrity"
  crew: string;      // e.g., "Crewmates"
  impostor: string;  // e.g., "Parasite"
  task: string;      // e.g., "Repair"
  vote: string;      // e.g., "Eject"
  dead: string;      // e.g., "KIA"
}
```

### 2. Random Event Scheduler

**Decision**: Use a "Tick-based" scheduler rather than pure `setTimeout`.
**Rationale**: A central game loop (tick every 1s) allows for easier synchronization and pausing of events compared to scattered timers.
**Implementation**:
- `GameEngine` maintains a `lastTick` timestamp.
- On every tick, `EventScheduler` checks probability tables defined in `Environment`.

### 3. Progression & XP

**Decision**: Store XP in a separate `UserProfiles` container, linked by `userId` (AAD Object ID or simple string).
**Rationale**: Game state is ephemeral; User Profile state is permanent. Separation of concerns.
**Formula**: `Level = floor(sqrt(XP / 100))` (Simple quadratic curve).

### 4. Win Condition Strategy Pattern

**Decision**: Implement a `WinConditionEvaluator` that iterates through a list of active conditions.
**Rationale**: Allows easy addition of new modes (e.g., "Speed Run", "Sudden Death") without modifying the core loop.

## Risks / Trade-offs

- **Complexity**: The frontend will need a significant refactor to stop using hardcoded strings.
- **Migration**: Existing `office.json` config will need to be updated to include the new `terminology` map immediately, or the UI will break.

## Migration Plan

1. Update `types.ts` with new interfaces.
2. Update all JSON environment files with default terminology.
3. Refactor `GameEngine` to include the Scheduler.
4. Refactor Frontend to fetch terminology on `joinGame`.
