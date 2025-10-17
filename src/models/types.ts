export interface Player {
  id: string;
  displayName: string;
  role: Role;
  isAlive: boolean;
  stats: {
    tasksCompleted: number;
    votesReceived: number;
    votesCast: number;
  };
}

export interface Role {
  name: 'crew' | 'impostor' | 'double-agent' | 'sheriff';
  loyalty: 'crew' | 'impostor';
  abilities?: string[];
}

export interface Task {
  id: string;
  type: 'riddle' | 'trivia' | 'coordination' | 'puzzle' | 'documentation';
  title: string;
  description: string;
  slotsAvailable: number;
  requiredPlayers: number;
  duration: string; // e.g., "2h", "30m"
  participants: string[]; // Player IDs
  completed: boolean;
  environmentSpecific?: Record<string, unknown>;
  successCriteria?: Record<string, unknown>;
  rewards?: {
    points: number;
  };
}

export interface Environment {
  theme: 'office' | 'spaceship' | 'pirate-ship' | 'deserted-island';
  tasks: Task[];
  eliminationFlavors: string[];
  settings?: Record<string, unknown>;
}

export interface GameState {
  id: string;
  tenantId: string;
  environment: Environment;
  integrityMeter: number; // 0-100
  players: Player[];
  events: GameEvent[];
  status: 'pending' | 'active' | 'paused' | 'ended';
  createdAt: Date;
  updatedAt: Date;
  winner?: 'crew' | 'impostor';
}

export interface GameEvent {
  id: string;
  type:
    | 'game-started'
    | 'player-joined'
    | 'task-started'
    | 'task-completed'
    | 'vote-cast'
    | 'player-eliminated'
    | 'game-ended';
  timestamp: Date;
  playerId?: string;
  data?: Record<string, unknown>;
}

export interface TenantContext {
  tenantId: string;
  teamId?: string;
  timezone: string;
}

export interface CreateGameRequest {
  tenantId: string;
  environment: 'office' | 'spaceship' | 'pirate-ship' | 'deserted-island';
  maxPlayers?: number;
  impostorCount?: number;
}

export interface JoinGameRequest {
  gameId: string;
  playerName: string;
}

export interface TaskAction {
  gameId: string;
  playerId: string;
  taskId: string;
  action: 'join' | 'complete';
  payload?: Record<string, unknown>;
}

export interface VoteAction {
  gameId: string;
  voterId: string;
  suspectId: string;
}
