# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Office Intrigue is an asynchronous, text-based multiplayer social deduction game for Microsoft Teams, inspired by Among Us. Players work as crew members completing tasks or impostors sabotaging the mission across themed environments (Office, Spaceship, Pirate Ship).

**Current Status**: Web version fully playable, Teams integration in development.

**Tech Stack**: Node.js, TypeScript, Express, Microsoft Bot Framework SDK, Azure Cosmos DB (with in-memory storage fallback)

## Essential Commands

```bash
# Development
npm run dev              # Start dev server with hot reload (ts-node + nodemon)
npm run build            # Compile TypeScript to dist/
npm start                # Run production build from dist/

# Code Quality
npm run lint             # ESLint on src/**/*.ts
npm run format           # Prettier format all files
npm test                 # Run Jest tests

# Utilities
npm run docs:serve       # Serve OpenAPI documentation
npm run schema:validate  # Validate JSON schemas
```

**Default Port**: 3978  
**Web UI**: http://localhost:3978

## Architecture

### Application Modes

- **Web Mode** (default): Standalone web app with session-based auth
- **Teams Mode**: Microsoft Teams bot integration via Bot Framework

Set via `APP_MODE` in `.env` (copy from `.env.example`)

### Core Architecture

```
src/
├── server.ts              # Express app setup, middleware, route registration
├── index.ts               # Entry point, starts server
├── routes/                # API endpoints
│   ├── game.ts            # POST /api/game/create, /join, /start/:id, GET /state/:id
│   ├── task.ts            # POST /api/task/join, /complete
│   └── vote.ts            # POST /api/vote/cast
├── services/
│   ├── GameEngine.ts      # Core business logic (createGame, joinGame, startGame, etc.)
│   └── MemoryStorage.ts   # In-memory storage abstraction (development/demo mode)
├── models/types.ts        # TypeScript interfaces (Player, Task, GameState, etc.)
├── bot/                   # Bot Framework handlers (Teams integration)
├── cards/                 # Adaptive Card templates
└── utils/                 # Shared utilities
```

### Multi-Tenant Design

- Partition key: `{tenantId}#{gameId}` for game-scoped data
- Cosmos DB containers: games, players, events, leaderboards
- MemoryStorage mirrors Cosmos structure for local dev

### Game Engine

Core game lifecycle managed in `GameEngine.ts`:

- **createGame()** - Initialize with environment theme
- **joinGame()** - Add player, assign pending role
- **startGame()** - Assign impostor/crew roles (1 impostor per 5 players)
- **joinTask()** - Player joins task slot
- **completeTask()** - Mark task done, boost integrity meter
- **castVote()** - Record vote for elimination
- **getGameState()** - Return game state (hides roles from crew members)

### Environment Configuration

Game themes loaded from `config/environments/{theme}.json`:

- `office.json`, `spaceship.json`, `pirate-ship.json`
- Each contains: tasks array, eliminationFlavors

Task types: riddle, trivia, coordination, puzzle, documentation

## OpenSpec Workflow

This project uses spec-driven development. Before implementing features:

1. Review `openspec/AGENTS.md` for full workflow
2. Check existing specs: `openspec list --specs`
3. Create change proposals in `openspec/changes/[change-id]/`
4. Validate: `openspec validate [change-id] --strict`
5. Get approval before implementing

Key files in change proposals:

- `proposal.md` - Why/what/impact
- `tasks.md` - Implementation checklist
- `design.md` - Technical decisions (if needed)
- `specs/[capability]/spec.md` - Delta changes (ADDED/MODIFIED/REMOVED)

**Do not start implementation until proposal is approved.**

## Configuration

Copy `.env.example` to `.env` and configure:

**Required for Web Mode:**

- `APP_MODE=web`
- `PORT=3978`
- `SESSION_SECRET` (change from default)

**Required for Teams Mode:**

- `APP_MODE=teams`
- `MicrosoftAppId`, `MicrosoftAppPassword`, `MicrosoftAppTenantId`

**Optional:**

- Cosmos DB credentials (uses in-memory storage if not configured)
- `APPINSIGHTS_CONNECTIONSTRING` for monitoring
- `TIMEZONE_DEFAULT`, `QUIETHOURS_START/END` for async gameplay

## Storage

**Development**: Uses `MemoryStorage.ts` (singleton in-memory store)  
**Production**: Azure Cosmos DB (SQL API)

Both implement the same interface:

- `create(container, item)`
- `read(container, id, partitionKey)`
- `update(container, item)`
- `delete(container, id, partitionKey)`
- `query(container, filter?)`

**Containers**: games, players, events, leaderboards

## Key Concepts

### Roles & Loyalty

- **Crew** (loyal to crew) - complete tasks
- **Impostor** (loyal to impostor) - sabotage
- **Double-agent**, **Sheriff** (future roles)

### Integrity Meter

- 0-100 scale, starts at 100
- Tasks boost integrity (+5)
- Impostor actions lower it
- Game ends when reaches 0 or all impostors eliminated

### Slot-Based Tasks

- Tasks have `slotsAvailable` and `requiredPlayers`
- Players join tasks, collaborate to complete
- Completion tracked in game events

### Game States

- **pending** - Waiting for players to join
- **active** - Game in progress, roles assigned
- **paused** - Quiet hours (timezone-based)
- **ended** - Winner determined

## Testing

Jest configuration not yet finalized (no `jest.config.js` present). Tests should go in `test/` directory.

When Jest is configured, run a single test with:

```bash
npm test -- path/to/test.spec.ts
```

## Documentation

- [README.md](README.md) - Project overview and quick start
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design, runtime components
- [docs/API.md](docs/API.md) - REST endpoints reference
- [docs/PREREQUISITES.md](docs/PREREQUISITES.md) - Required software
- [openspec/AGENTS.md](openspec/AGENTS.md) - AI assistant instructions for spec-driven development

## Common Workflows

### Creating a New Game

1. `POST /api/game/create` with `{ environment: "office" }`
2. Share returned `gameId`
3. Players `POST /api/game/join` with `{ gameId, playerName }`
4. `POST /api/game/start/:gameId` when ready (requires 2+ players)

### Adding a New Environment

1. Create `config/environments/{theme}.json`
2. Define tasks array with required fields:
   - `id`, `type`, `title`, `description`
   - `slotsAvailable`, `requiredPlayers`, `duration`
3. Add `eliminationFlavors` array
4. Update TypeScript types in `models/types.ts` if needed

### Implementing a Feature with OpenSpec

1. Read `openspec/AGENTS.md` for the complete workflow
2. Create a change proposal: `openspec/changes/[change-id]/`
3. Write `proposal.md`, `tasks.md`, and spec deltas
4. Validate: `openspec validate [change-id] --strict`
5. Get approval before coding
6. Implement tasks sequentially from `tasks.md`
7. After deployment, archive: `openspec archive [change-id]`
