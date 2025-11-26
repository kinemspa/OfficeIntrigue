# Office Intrigue - Copilot Instructions

## Project Overview
Office Intrigue is an asynchronous, text-based multiplayer social deduction game designed for Microsoft Teams and web browsers. It aims to bring the engagement of games like "Among Us" into a corporate environment through themed "productivity" gameplay that fits into the workday.

## Tech Stack
- **Runtime**: Node.js (LTS), TypeScript
- **Framework**: Express.js, Microsoft Bot Framework SDK v4
- **Database**: In-Memory (Dev), Azure Cosmos DB (Prod - Planned)
- **Frontend**: Vanilla JS, HTML/CSS (Web), Adaptive Cards (Teams)

## Project Conventions

### Code Style
- **Linter**: ESLint with TypeScript support
- **Formatter**: Prettier
- **Naming**: PascalCase for classes, camelCase for variables/functions, kebab-case for files.

### Architecture Patterns
- **Service-Oriented**: Core logic in `src/services/` (GameEngine, MemoryStorage).
- **Singleton**: Key services are singletons.
- **Routes**: Express routers in `src/routes/` handle API requests.

## Domain Context
- **Integrity Meter**: Represents the "health" of the company/ship. Crew wants it high; Impostors want it low.
- **Tasks**: Slot-based activities. "Joining" a task blocks a slot. "Completing" it frees the slot and adds Integrity.
- **Tenants**: The game is multi-tenant by design (Teams Tenant ID), though currently running in single-tenant dev mode.

## Important Constraints
- **Asynchronous Play**: Games can last hours or days. Mechanics must support players being offline.
- **Teams Integration**: The primary target is MS Teams; web is a fallback/dev interface.

## External Dependencies
- **Microsoft Graph / Bot Framework**: For Teams user identity and messaging.
- **Azure Cosmos DB**: For persistent state.

## Documentation
- See `docs/GAMEPLAY_ENHANCEMENTS.md` for the latest design on Random Events, Progression, and Theming.
