# Office Intrigue

An asynchronous, text-based multiplayer social deduction game for Microsoft Teams, inspired by Among Us.

## Overview

Office Intrigue is a cloud-native, multi-tenant game that supports 4-100 players across hours or weeks of gameplay. Players complete collaborative tasks, identify impostors/double-agents, and navigate timezone-aware quiet hours in themed environments like Office, Spaceship, Pirate Ship, and Deserted Island.

## Features

- **Asynchronous Gameplay**: Play across hours or weeks with timezone shutdowns
- **Multiple Environments**: Office, Spaceship, Pirate Ship, Deserted Island
- **Team Modes**: Double-agent mechanics with crew vs. impostor loyalty
- **Slot-Based Tasks**: Collaborative riddles, trivia, puzzles, and documentation
- **Adaptive Cards**: Button-based interactions in Teams
- **Leaderboards**: Track performance across games
- **Fictional Eliminations**: Cluedo-style themed flavor text

## Technology Stack

- **Backend**: Node.js, TypeScript, Microsoft Bot Framework
- **Database**: Azure Cosmos DB
- **Authentication**: Microsoft Entra ID (SSO)
- **Hosting**: Azure App Service
- **Architecture**: Cloud-native, multi-tenant, extensible via JSON schemas

## Quick Start

### Installation

```bash path=null start=null
npm install
```

### Development

```bash path=null start=null
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Configuration

Copy `.env.example` to `.env` and configure:
- Microsoft Bot Framework credentials
- Azure Cosmos DB connection
- Environment settings

See `docs/CONFIGURATION.md` for details.

## Documentation

- [Prerequisites](docs/PREREQUISITES.md) - Required software and tools
- [Architecture](docs/ARCHITECTURE.md) - System design and architecture
- [API Documentation](docs/API.md) - REST API endpoints
- [OpenSpec](docs/OPENSPEC.md) - Comprehensive specification
- [Configuration](docs/CONFIGURATION.md) - Environment and deployment setup

## License

MIT License - See LICENSE file for details

## Contributing

See CONTRIBUTING.md for contribution guidelines (coming soon).
