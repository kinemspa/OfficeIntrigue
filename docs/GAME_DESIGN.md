# Game Design Document

## Overview

Office Intrigue is an asynchronous, text-based multiplayer social deduction game. This document serves as the comprehensive guide to the game's mechanics, technical design, and player experience.

## 1. Core Gameplay Loop

The game revolves around two opposing teams: **The Crew** (Productivity) and **The Impostors** (Sabotage).

### 1.1 The Hook: "Corporate Espionage"
The core tension is **Productivity vs. Sabotage**.
- **Crew Goal**: Keep the company afloat by completing mundane tasks to fill the "Integrity Meter" (Stock Value).
- **Impostor Goal**: Tank the company's value or eliminate the crew without being caught.
- **Engagement**: Asynchronous play allows suspicion to build over hours or days. You might log in to find the "Server Crashed" or that your "TPS Report" was deleted.

### 1.2 Win Conditions

The game ends immediately when one of the following conditions is met:

| Condition | Winner | Description |
| :--- | :--- | :--- |
| **Productivity Goals Met** | Crew | Integrity Meter reaches **100%**. |
| **Clean House** | Crew | All Impostors are eliminated (voted out). |
| **Hostile Takeover** | Impostor | Integrity Meter reaches **0%**. |
| **Boardroom Coup** | Impostor | Impostors outnumber or equal the Crew. |

---

## 2. Thematic Immersion System

The game engine dynamically re-skins the entire interface based on the selected environment. This is not just a text swap; it changes the emotional context of the gameplay.

### 2.1 Terminology Map
When a client loads, it fetches the `TerminologyMap` for the active game to render the UI.

| Concept | Office (Default) | Pirate Ship | Sci-Fi |
| :--- | :--- | :--- | :--- |
| **Integrity** | Stock Value | Ship Morale | Hull Integrity |
| **Crew** | Employees | Sailors | Crewmates |
| **Impostor** | Corporate Spy | Mutineer | Alien Parasite |
| **Task** | Deliverable | Duty | Repair |
| **Vote** | Fire | Walk the Plank | Eject |
| **Eliminated** | Downsized | Keelhauled | KIA |

### 2.2 Player Perspectives

#### The "Office" Player (The Intern)
> "I just logged in to check the **Stock Value**. It's down to 45% because someone keeps deleting the **TPS Reports**. I suspect 'Dave from Accounting' is actually a **Corporate Spy**. I'm going to **File a Complaint** (Vote) against him before we all get **Downsized**."

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
- **"Server Crash" (Office)**: 20% of "Completed" tasks revert to "In Progress".
- **"Mandatory Meeting" (Office)**: Locks all tasks and forces players into a 60-second voting window.
- **"Power Outage" (Sci-Fi)**: Hides the Integrity Meter for 5 minutes.

### 3.2 Progression & XP
A persistent layer that rewards loyalty and skill, regardless of the specific game outcome.

**XP Formula**: `Level = floor(sqrt(XP / 100))`

**XP Sources**:
- **Play**: +50 XP
- **Win**: +100 XP
- **Task Completed**: +10 XP
- **Correct Vote**: +25 XP

**The Career Ladder (Office Theme)**:
1.  **Intern** (Level 1)
2.  **Probationary Hire** (Level 5)
3.  **Junior Associate** (Level 10)
4.  **Middle Manager** (Level 20)
5.  **Regional VP** (Level 35)
6.  **CEO** (Level 50)

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
