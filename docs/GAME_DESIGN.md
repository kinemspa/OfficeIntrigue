# Game Design Document

## Overview

**Intrigue Engine** (working title) is an asynchronous, text-based multiplayer social deduction game. This document serves as the comprehensive guide to the game's mechanics, technical design, and player experience.

## 1. Core Gameplay Loop

The game revolves around two opposing teams: **The Crew** (Survival) and **The Impostors** (Sabotage).

### 1.1 The Hook: "Survival & Sabotage"
The core tension is **Cooperation vs. Betrayal**.
- **Crew Goal**: Keep the environment stable by completing tasks to fill the "Integrity Meter".
- **Impostor Goal**: Destabilize the environment or eliminate the crew without being caught.
- **Engagement**: Asynchronous play allows suspicion to build over hours or days. You might log in to find the "Life Support Failed" or that your "Navigation Data" was corrupted.

### 1.2 Win Conditions

The game ends immediately when one of the following conditions is met:

| Condition | Winner | Description |
| :--- | :--- | :--- |
| **System Stabilized** | Crew | Integrity Meter reaches **100%**. |
| **Clean House** | Crew | All Impostors are eliminated (voted out). |
| **Critical Failure** | Impostor | Integrity Meter reaches **0%**. |
| **Mutiny Success** | Impostor | Impostors outnumber or equal the Crew. |

---

## 2. Thematic Immersion System

The game engine dynamically re-skins the entire interface based on the selected environment. This is not just a text swap; it changes the emotional context of the gameplay.

### 2.1 Terminology Map
When a client loads, it fetches the `TerminologyMap` for the active game to render the UI.

| Concept | Spaceship (Default) | Pirate Ship | Deserted Island |
| :--- | :--- | :--- | :--- |
| **Integrity** | Hull Integrity | Ship Morale | Camp Hope |
| **Crew** | Crewmates | Sailors | Survivors |
| **Impostor** | Alien Parasite | Mutineer | Traitor |
| **Task** | Repair | Duty | Forage |
| **Vote** | Eject | Walk the Plank | Banish |
| **Eliminated** | KIA | Keelhauled | Lost |

### 2.2 Player Perspectives

#### The "Spaceship" Player (The Engineer)
> "I just logged in to check the **Hull Integrity**. It's down to 45% because someone keeps sabotaging the **Shield Generator**. I suspect 'Unit 734' is actually an **Alien Parasite**. I'm going to **Vote to Eject** them before we all get **KIA**."

#### The "Pirate" Player (The Swabbie)
> "The **Ship Morale** is sinking fast! The **Main Sail** keeps getting unfurled. I think 'One-Eyed Jack' is a **Mutineer**. If we don't **Make him Walk the Plank** soon, the Captain will have us all **Keelhauled**."

---

## 3. Mechanics & Systems

### 3.1 Random Events System
Random events break the monotony of task completion and force players to react to global crises.

**Technical Design**:
- **Scheduler**: A "Tick-based" scheduler runs every minute.
- **Trigger**: Rolls a die against the environment's event table.

**Example Scenarios**:
- **"Solar Flare" (Spaceship)**: 20% of "Completed" tasks revert to "In Progress".
- **"Becalmed" (Pirate)**: Locks all tasks and forces players into a 60-second voting window.
- **"Storm Surge" (Island)**: Hides the Integrity Meter for 5 minutes.

### 3.2 Progression & XP
A persistent layer that rewards loyalty and skill, regardless of the specific game outcome.

**XP Formula**: `Level = floor(sqrt(XP / 100))`

**XP Sources**:
- **Play**: +50 XP
- **Win**: +100 XP
- **Task Completed**: +10 XP
- **Correct Vote**: +25 XP

**The Rank Ladder (Spaceship Theme)**:
1.  **Cadet** (Level 1)
2.  **Ensign** (Level 5)
3.  **Lieutenant** (Level 10)
4.  **Commander** (Level 20)
5.  **Captain** (Level 35)
6.  **Admiral** (Level 50)

---

## 4. Technical Architecture

### 4.1 Data Models

**Terminology Map Schema**:
```typescript
interface TerminologyMap {
  integrity: string;
  crew: string;
  impostor: string;
  task: string;
  vote: string;
  dead: string;
}
```

**User Profile Schema**:
```typescript
interface UserProfile {
  userId: string;
  xp: number;
  level: number;
  title: string;
  gamesPlayed: number;
  gamesWon: number;
}
```

### 4.2 Strategy Patterns
- **WinConditionEvaluator**: Iterates through a list of active conditions to determine game state.
- **EventScheduler**: Manages probability and execution of random events.

---

## 5. Migration Plan

1.  **Update Types**: Add `TerminologyMap` and `UserProfile` interfaces to `src/models/types.ts`.
2.  **Update Configs**: Refactor all JSON environment files to include the `terminology` map.
3.  **Backend Logic**: Implement `EventScheduler` and `WinConditionEvaluator` in `GameEngine.ts`.
4.  **Frontend Refactor**: Update `game.js` to fetch and use dynamic labels instead of hardcoded strings.
