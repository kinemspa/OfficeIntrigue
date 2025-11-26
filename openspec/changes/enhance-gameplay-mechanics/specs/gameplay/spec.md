## ADDED Requirements

### Requirement: Win Conditions

The game MUST support multiple distinct ways for each team to win.

#### Scenario: Crew Task Victory
- **WHEN** the Integrity Meter reaches 100%
- **THEN** the game ends immediately with a Crew Victory (Productivity Target Met)

#### Scenario: Impostor Sabotage Victory
- **WHEN** the Integrity Meter reaches 0%
- **THEN** the game ends immediately with an Impostor Victory (Hostile Takeover)

#### Scenario: Crew Elimination Victory
- **WHEN** all Impostors are eliminated (voted out)
- **THEN** the game ends with a Crew Victory

#### Scenario: Impostor Parity Victory
- **WHEN** the number of living Impostors equals or exceeds the number of living Crewmates
- **THEN** the game ends with an Impostor Victory

### Requirement: Random Events

The system SHALL periodically trigger random global events that alter gameplay state.

#### Scenario: Server Crash Event
- **WHEN** a "Server Crash" event triggers
- **THEN** 20% of completed tasks revert to "incomplete" status
- **AND** all players receive a notification

#### Scenario: Mandatory Meeting
- **WHEN** a "Mandatory Meeting" event triggers
- **THEN** task progression is locked
- **AND** players are forced to the voting screen for 60 seconds

### Requirement: Progression System

The system SHALL track player experience and assign ranks based on performance.

#### Scenario: Earning XP
- **WHEN** a game concludes
- **THEN** all participants receive XP based on the outcome (Win/Loss)
- **AND** bonus XP is awarded for individual stats (Tasks Completed, Correct Votes)

#### Scenario: Level Up
- **WHEN** a player's XP exceeds the threshold for the next level
- **THEN** their Title is updated (e.g., from "Intern" to "Junior Associate")
- **AND** the new Title is displayed in the lobby

### Requirement: Thematic Terminology Overrides

The system SHALL allow environments to define custom terminology for core game concepts to ensure total thematic immersion.

#### Scenario: Pirate Theme Overrides
- **WHEN** the "Pirate Ship" theme is active
- **THEN** "Integrity Meter" is displayed as "Ship Morale"
- **AND** "Impostor" is displayed as "Mutineer"
- **AND** "Vote Out" is displayed as "Walk the Plank"
- **AND** no corporate jargon appears in the UI

#### Scenario: Spaceship Theme Overrides
- **WHEN** the "Spaceship" theme is active
- **THEN** "Integrity Meter" is displayed as "Hull Integrity"
- **AND** "Impostor" is displayed as "Alien Parasite"
- **AND** "Vote Out" is displayed as "Eject"

### Requirement: Pure Thematic Content

The system SHALL support themes that contain zero references to corporate life or office humor.

#### Scenario: Fantasy Dungeon Theme
- **WHEN** a "Fantasy Dungeon" theme is selected
- **THEN** tasks are "Slay Goblin", "Disarm Trap" (not "File Report")
- **AND** elimination text is "was devoured by a mimic" (not "downsized")
