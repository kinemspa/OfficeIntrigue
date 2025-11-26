# Game Design Document

## Overview

**Hidden Agenda** is an asynchronous, text-based multiplayer social deduction game. This document serves as the comprehensive guide to the game's mechanics, technical design, and player experience.

## 1. Core Gameplay Loop

The game revolves around two **Rival Factions** competing for dominance, with **Double Agents** (Moles) hidden within each team.

### 1.1 The Hook: "Rival Factions & Double Agents"
The core tension is **External Competition vs. Internal Betrayal**.
- **Scenario**: Two visible teams (e.g., "Red Fleet" vs "Blue Fleet") are racing to complete their objective.
- **The Twist**: Each team has 1 or more "Moles" who are secretly loyal to the *opposing* team.
- **Mole Goal**: Sabotage their *current* team's progress so the *other* team wins.
- **Loyalist Goal**: Identify and eliminate the Moles in their own ranks while racing to beat the rival team.

### 1.2 Win Conditions

The game ends immediately when one of the following conditions is met:

| Condition | Winner | Description |
| :--- | :--- | :--- |
| **Mission Accomplished** | Faction A | Faction A's Progress Meter reaches **100%**. |
| **Enemy Collapse** | Faction A | Faction B's Progress Meter reaches **0%** (due to sabotage). |
| **Mole Victory** | Moles | If a specific "Mole Objective" is met (e.g., both teams fail). |

---

## 2. Detailed Mechanics

### 2.1 Team Structure
- **Visible Team**: The team you appear to be on (e.g., "Red Team"). You share a chat channel and task list with them.
- **Hidden Loyalty**: Your true allegiance.
    - **Loyalist**: Wants their Visible Team to win.
    - **Mole**: Wants their Visible Team to lose (helping the rival team).

### 2.2 Task System
- **Progress Tasks**: Adding to the team's meter (e.g., "Calibrate Shields").
- **Sabotage**: Moles can "fail" tasks intentionally or trigger negative events.
- **Counter-Espionage**: Tasks that reveal information about other players (e.g., "Audit Logs" reveals if a player did a task correctly).

### 2.3 Voting & Elimination
- **Internal Tribunal**: Teams vote to "Brig" or "Eject" their own members.
- **Consequence**: Ejected players are removed from the team channel and can no longer perform tasks.
- **Risk**: Ejecting a Loyalist slows down the team (fewer hands on deck). Ejecting a Mole stops the sabotage.

---

## 3. Bot Operations & Technical Flow

### 3.1 Bot Architecture
The game is driven by a Microsoft Teams Bot (or Web Socket server for web) that acts as the Game Master.

**State Management**:
- The Bot maintains the "Truth" (who is a Mole, what the real scores are).
- It filters information based on the user's role.

### 3.2 Chat Rooms & Channels
The game relies on a specific channel topology to manage information flow.

| Channel Type | Visibility | Purpose |
| :--- | :--- | :--- |
| **Global News** | Public (All) | Announcements, Game Start/End, Public Events. |
| **Faction A Channel** | Team A Only | Strategy, Task Coordination. Moles in Team A *can* see this. |
| **Faction B Channel** | Team B Only | Strategy, Task Coordination. Moles in Team B *can* see this. |
| **Handler Channel** | Moles Only | (Optional) A secure line for Moles to coordinate with their true masters? |
| **Direct Message (DM)** | Private (Bot <-> User) | Role assignment, private alerts ("You have been sabotaged!"), Voting UI. |

### 3.3 Message Flow (Adaptive Cards)

1.  **Game Start**:
    - Bot sends a **DM** to every player: "You are on **Red Team**. Your Loyalty is **[REDACTED]**."
    - Bot creates/unlocks the **Faction Channels**.

2.  **Turn / Tick**:
    - Bot posts a **Status Card** in Faction Channels: "Progress: 45%. Alert: Shield Generator Malfunction."
    - Players click buttons on the card ("Repair", "Investigate").

3.  **Sabotage**:
    - A Mole clicks "Sabotage" on a task in their DM.
    - Bot updates the Faction Channel: "Task Failed! Progress -5%." (Does not reveal who did it).

4.  **Voting**:
    - Player clicks "Call Vote" in DM.
    - Bot posts a **Vote Card** in the Faction Channel.
    - Votes are cast anonymously via DM to the Bot.
    - Bot announces result in Faction Channel.

---

## 4. Thematic Immersion System

The game engine dynamically re-skins the entire interface based on the selected environment.

### 4.1 Terminology Map

| Concept | Spaceship (Default) | Pirate Ship | Cold War |
| :--- | :--- | :--- | :--- |
| **Faction A** | Starfleet | Royal Navy | CIA |
| **Faction B** | Klingons | Pirates | KGB |
| **Mole** | Changeling | Mutineer | Double Agent |
| **Progress** | Warp Drive Charge | Treasure Map | Intel Decrypted |
| **Vote** | Court Martial | Maroon | Burn Notice |

---

## 5. Technical Architecture

### 5.1 Data Models

**Player Schema**:
```typescript
interface Player {
  id: string;
  visibleTeam: 'A' | 'B';
  loyalty: 'A' | 'B'; // If visible != loyalty, they are a Mole
  isAlive: boolean;
  stats: UserStats;
}
```

**Game State Schema**:
```typescript
interface GameState {
  teams: {
    A: { score: number; members: string[] };
    B: { score: number; members: string[] };
  };
  status: 'active' | 'ended';
  turn: number;
}
```

### 5.2 Strategy Patterns
- **WinConditionEvaluator**: Checks `TeamA.score >= 100` or `TeamB.score >= 100`.
- **EventScheduler**: Triggers random events that might affect one or both teams.

---

## 6. Migration Plan

1.  **Update Types**: Refactor `Player` and `GameState` to support Factions.
2.  **Bot Logic**: Implement the "Split Channel" logic (sending different messages to different groups).
3.  **Frontend**: Update the UI to show "My Team" vs "Enemy Team" progress.
