# Architecture

## Overview

Hidden Agenda is a cloud-native, multi-tenant Microsoft Teams bot application built on Node.js and the Bot Framework SDK. This document describes the system architecture, runtime components, and data flow.

## Technology Stack

- **Runtime**: Node.js (LTS 20+), TypeScript
- **Bot Framework**: Microsoft Bot Framework SDK v4 (CloudAdapter)
- **Database**: Azure Cosmos DB (SQL API, multi-tenant partitioning)
- **Authentication**: Microsoft Entra ID (Teams SSO)
- **Hosting**: Azure App Service
- **Monitoring**: Application Insights

## Runtime Components

### 1. Bot Framework Pipeline

**Entry Point**: `/api/messages`

- CloudAdapter handles Bot Framework protocol
- TeamsActivityHandler processes messages and card submissions
- Captures user context (AAD Object ID) for authentication

### 2. REST API Endpoints

Complement bot interactions with programmatic access:

- `/api/game/*` - Game lifecycle management
- `/api/task/*` - Task operations
- `/api/vote/*` - Voting mechanics
- `/api/card/*` - Adaptive Card webhook handlers

### 3. Game Engine

Core business logic for game state management:

- `startGame()` - Initialize new game instance
- `joinTask()` - Player joins slot-based task
- `completeTask()` - Validate and process task completion
- `castVote()` - Process elimination votes

### 4. Quiet Hours Scheduler

Timezone-aware async gameplay management:

- Runs every 15 minutes (node-cron)
- Pauses games outside tenant-specific active hours
- Resumes games when business hours begin

## Multi-Tenant Architecture

### Tenant Isolation

**Cosmos DB Partitioning**:

- Partition Key: `{tenantId}#{gameId}` for game-scoped documents
- Partition Key: `{tenantId}` for leaderboard aggregates
- Each tenant's data is physically isolated

**Authentication**:

- Microsoft Entra ID validates user identity
- Bot Framework handles tenant context automatically

## Data Model

See [DATA_MODEL.md](DATA_MODEL.md) for Cosmos containers and schemas.

## Scalability

- **Horizontal Scaling**: Azure App Service autoscale based on CPU/memory
- **Database**: Cosmos DB auto-scales RU/s per partition
- **Caching**: In-memory caching for environment configs (TODO)

## To Be Documented

- Detailed game state machine
- Event sourcing patterns
- Plugin system architecture
- Deployment topology
