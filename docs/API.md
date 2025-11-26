# API Documentation

## Overview

Office Intrigue exposes both Bot Framework activities and REST API endpoints.

## Bot Framework Endpoint

### POST `/api/messages`

Handles all Microsoft Teams bot interactions via Bot Framework protocol.

**Authentication**: Bot Framework validates requests using bot credentials.

**Message Types**:

- `message` - Text messages from users
- `invoke` - Adaptive Card button submissions
- `conversationUpdate` - Member added/removed events

## REST API Endpoints

### Game Management

#### POST `/api/game/start`

Start a new game in a Teams channel or group chat.

**Request Body**:

```json path=null start=null
{
  "tenantId": "string",
  "teamId": "string",
  "environment": "office | spaceship | pirate-ship | deserted-island",
  "settings": {
    "maxPlayers": 20,
    "impostorCount": 2
  }
}
```

**Response**:

```json path=null start=null
{
  "gameId": "uuid",
  "status": "pending"
}
```

#### GET `/api/game/state/:gameId`

Retrieve current game state.

**Response**: See `schemas/gamestate.schema.json`

### Task Operations

#### POST `/api/task/join`

Player joins a task slot.

#### POST `/api/task/complete`

Submit task completion.

### Voting

#### POST `/api/vote/cast`

Cast a vote to eject a player.

## OpenAPI Specification

See [openapi.yaml](openapi.yaml) for full Swagger/OpenAPI 3.0 specification.

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Resource not found
- `500` - Internal server error

Error body:

```json path=null start=null
{
  "error": "string",
  "message": "string"
}
```
