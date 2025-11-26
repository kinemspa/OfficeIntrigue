# Gameplay Enhancements Proposal & Design

## Overview

This document outlines the plan to enhance the game's depth with new mechanics, including random events, a progression system, and a dynamic theming engine.

## 1. Proposal

### Why
The current game loop is functional but lacks depth and replayability. We need to enhance engagement through:
- A stronger game hook (Productivity vs. Sabotage).
- Varied win conditions.
- Random events to disrupt the flow.
- A progression system (upgrades/levels).

### What Changes
- **New Win Conditions**: Explicit "Hostile Takeover" (Impostor win) and "Productivity Goals" (Crew win).
- **Random Events System**: A new engine component that triggers global effects (e.g., "Server Crash" resets tasks, "HR Audit" blocks voting).
- **Progression System**: Persistent user stats (XP) across games, unlocking titles (Intern -> CEO) and cosmetic perks.
- **Thematic Engine**: Decoupling UI text from "Office" terminology to support Pirate, Sci-Fi, and Fantasy themes.

## 2. Technical Design

### 2.1 Thematic Terminology System

**Decision**: Implement a `TerminologyMap` in the `Environment` interface.
**Rationale**: Hardcoding "Office" terms in the frontend prevents true multi-genre support.

**Schema**:
```typescript
interface TerminologyMap {
  integrity: string; // e.g., "Hull Integrity", "Stock Value"
  crew: string;      // e.g., "Crewmates", "Employees"
  impostor: string;  // e.g., "Parasite", "Corporate Spy"
  task: string;      // e.g., "Repair", "Deliverable"
  vote: string;      // e.g., "Eject", "Fire"
  dead: string;      // e.g., "KIA", "Downsized"
}
```

### 2.2 Random Event Scheduler

**Decision**: Use a "Tick-based" scheduler.
**Rationale**: A central game loop (tick every 1s) allows for easier synchronization and pausing of events.

**Implementation**:
- `GameEngine` maintains a `lastTick` timestamp.
- On every tick, `EventScheduler` checks probability tables defined in `Environment`.

### 2.3 Progression & XP

**Decision**: Store XP in a separate `UserProfiles` container, linked by `userId`.
**Rationale**: Game state is ephemeral; User Profile state is permanent.
**Formula**: `Level = floor(sqrt(XP / 100))` (Simple quadratic curve).

### 2.4 Win Condition Strategy Pattern

**Decision**: Implement a `WinConditionEvaluator` that iterates through a list of active conditions.
**Rationale**: Allows easy addition of new modes (e.g., "Speed Run", "Sudden Death") without modifying the core loop.

## 3. Migration Plan

1. Update `types.ts` with new interfaces.
2. Update all JSON environment files with default terminology.
3. Refactor `GameEngine` to include the Scheduler.
4. Refactor Frontend to fetch terminology on `joinGame`.
