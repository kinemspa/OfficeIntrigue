# Gameplay Deep Dive & Player Perspectives

This document expands on the technical design in `GAMEPLAY_ENHANCEMENTS.md`, focusing on the user experience, game flow, and narrative perspectives for different player roles.

## 1. Thematic Immersion System

The game engine dynamically re-skins the entire interface based on the selected environment. This is not just a text swap; it changes the emotional context of the gameplay.

### How It Works
When a client loads, it fetches the `TerminologyMap` for the active game.
- **Office**: "Integrity" = Stock Value. "Eliminate" = Fire.
- **Pirate**: "Integrity" = Ship Morale. "Eliminate" = Walk the Plank.
- **Sci-Fi**: "Integrity" = Hull Integrity. "Eliminate" = Eject.

### Player Perspectives

#### The "Office" Player (The Intern)
> "I just logged in to check the **Stock Value**. It's down to 45% because someone keeps deleting the **TPS Reports**. I suspect 'Dave from Accounting' is actually a **Corporate Spy**. I'm going to **File a Complaint** (Vote) against him before we all get **Downsized**."

#### The "Pirate" Player (The Swabbie)
> "The **Ship Morale** is sinking fast! The **Main Sail** keeps getting unfurled. I think 'One-Eyed Jack' is a **Mutineer**. If we don't **Make him Walk the Plank** soon, the Captain will have us all **Keelhauled**."

---

## 2. Random Events System

Random events break the monotony of task completion and force players to react to global crises.

### How It Works
The `EventScheduler` runs on a "tick" (e.g., every minute). It rolls a die against the environment's event table.
- **Global Debuffs**: "Server Crash" (Office) / "Solar Flare" (Sci-Fi).
- **Interaction Locks**: "Mandatory Meeting" (Office) / "Becalmed" (Pirate).
- **Hidden Information**: "Power Outage" (Hides the Integrity Meter).

### Scenario: "The Server Crash" (Office Theme)

**Trigger**: 5% chance per tick.
**Effect**: 20% of all "Completed" tasks revert to "In Progress".
**Duration**: Instant.

#### Perspective: The Crew (Loyal Employee)
> "Are you kidding me? I just finished the **Expense Report**! Now the server crashed and I have to do it again? Wait... did the server crash, or did *someone* pull the plug? I saw **Sarah** near the server room (Task List)..."

#### Perspective: The Impostor (Saboteur)
> "Perfect timing. The server crash just undid three tasks. While everyone is scrambling to redo them, I can slip away and **Sabotage** the Coffee Machine without anyone noticing. Chaos is my ladder."

---

## 3. Progression & XP

A persistent layer that rewards loyalty and skill, regardless of the specific game outcome.

### How It Works
- **XP Gain**:
    - **Play**: +50 XP
    - **Win**: +100 XP
    - **Task Completed**: +10 XP
    - **Correct Vote**: +25 XP
- **Leveling**: `Level = sqrt(XP / 100)`
- **Titles**: Unlocked at specific levels.

### The Career Ladder (Office Theme)
1.  **Intern** (Level 1)
2.  **Probationary Hire** (Level 5)
3.  **Junior Associate** (Level 10)
4.  **Middle Manager** (Level 20)
5.  **Regional VP** (Level 35)
6.  **CEO** (Level 50)

### Player Perspectives

#### The Veteran (Level 42 "Senior VP")
> "I've survived 200 hostile takeovers. When I see a Level 1 'Intern' accusing me of sabotage, I just laugh. I have the **Golden Stapler** badge. I know how to spot a spy."

#### The Newbie (Level 2 "Intern")
> "I want that **Corner Office** background for my profile. I just need to win two more games. I'm going to focus on tasks and keep my head down."

---

## 4. Win Conditions

The game ends when specific criteria are met. These are checked after every action.

### 4.1 Hostile Takeover (Impostor Win)
**Condition**: Integrity Meter reaches 0%.

#### Perspective: The Saboteur
> "It's done. The stock is worthless. The investors are pulling out. I've successfully tanked the company from the inside. My bonus from the rival firm is going to be huge."

### 4.2 Productivity Goals Met (Crew Win)
**Condition**: Integrity Meter reaches 100%.

#### Perspective: The Team Lead
> "Great work everyone! We hit our Q4 targets despite the... internal friction. The company is safe, bonuses are secured, and we can all go home. Except for Dave. Dave got fired."

### 4.3 Boardroom Coup (Impostor Win)
**Condition**: Impostors >= Crewmates.

#### Perspective: The Last Crewmate
> "I looked around the conference room. It was just me, Sarah, and Mike. I knew Sarah was a spy. I looked at Mike for support... and he smiled. That's when I knew. I wasn't voting them out. They were voting *me* out."
