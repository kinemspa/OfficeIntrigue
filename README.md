# Office Intrigue

An asynchronous, text-based multiplayer social deduction game for Microsoft Teams.

## Overview

Office Intrigue is a social deduction game built for Microsoft Teams and playable as a standalone web app. Support 4-100 players in asynchronous gameplay across themed environments with collaborative tasks, impostor mechanics, and voting.

**Current Status**: ✅ **Web version fully playable!** Teams integration coming soon.

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

### Play the Game (Web Version)

1. **Start the server**:

   ```bash path=null start=null
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3978`

3. **Create or join a game**:
   - Click "Create Game" and select an environment (Office, Spaceship, or Pirate Ship)
   - Share the Game ID with friends
   - Friends can join using the Game ID

4. **Start playing**:
   - Once 2+ players join, click "Start Game"
   - Roles are assigned (Crew vs. Impostor)
   - Complete tasks, vote out suspects, and find the impostors!

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

- [WARP.md](WARP.md) - Guidance for Warp AI development
- [Prerequisites](docs/PREREQUISITES.md) - Required software and tools
- [Architecture](docs/ARCHITECTURE.md) - System design and architecture
- [API Documentation](docs/API.md) - REST API endpoints
- [OpenSpec](docs/OPENSPEC.md) - Comprehensive specification
- [Configuration](docs/CONFIGURATION.md) - Environment and deployment setup

## License

MIT License - See LICENSE file for details

## Contributing

See CONTRIBUTING.md for contribution guidelines (coming soon).
