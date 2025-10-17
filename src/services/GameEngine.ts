import { v4 as uuidv4 } from 'uuid';
import { memoryStorage } from './MemoryStorage';
import type { GameState, Player, Task, CreateGameRequest, JoinGameRequest } from '../models/types';
import * as fs from 'fs';
import * as path from 'path';

export class GameEngine {
  private loadEnvironment(theme: string): { tasks: Task[]; eliminationFlavors: string[] } {
    try {
      const envPath = path.join(process.cwd(), 'config', 'environments', `${theme}.json`);
      const data = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
      
      // Transform tasks to include runtime properties
      const tasks: Task[] = data.tasks.map((t: Partial<Task>) => ({
        ...t,
        participants: [],
        completed: false,
      }));
      
      return {
        tasks,
        eliminationFlavors: data.eliminationFlavors,
      };
    } catch {
      // Fallback if config file doesn't exist
      return {
        tasks: [
          {
            id: 'default-task',
            type: 'trivia',
            title: 'Default Task',
            description: 'A placeholder task',
            slotsAvailable: 3,
            requiredPlayers: 2,
            duration: '1h',
            participants: [],
            completed: false,
          },
        ],
        eliminationFlavors: ['eliminated', 'voted out', 'ejected'],
      };
    }
  }

  async createGame(request: CreateGameRequest): Promise<{ gameId: string }> {
    const gameId = uuidv4();
    const environment = this.loadEnvironment(request.environment);

    const game: GameState = {
      id: gameId,
      tenantId: request.tenantId || 'default-tenant',
      environment: {
        theme: request.environment,
        ...environment,
      },
      integrityMeter: 100,
      players: [],
      events: [],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await memoryStorage.create('games', {
      ...game,
      partitionKey: game.tenantId,
    });

    return { gameId };
  }

  async joinGame(request: JoinGameRequest): Promise<Player> {
    const game = await memoryStorage.read('games', request.gameId, 'default-tenant');
    if (!game) throw new Error('Game not found');

    const playerId = uuidv4();
    const player: Player = {
      id: playerId,
      displayName: request.playerName,
      role: { name: 'crew', loyalty: 'crew' }, // Roles assigned when game starts
      isAlive: true,
      stats: {
        tasksCompleted: 0,
        votesReceived: 0,
        votesCast: 0,
      },
    };

    game.players.push(player);
    game.events.push({
      id: uuidv4(),
      type: 'player-joined',
      timestamp: new Date(),
      playerId: player.id,
      data: { playerName: request.playerName },
    });
    game.updatedAt = new Date();

    await memoryStorage.update('games', game);
    return player;
  }

  async startGame(gameId: string): Promise<void> {
    const game = await memoryStorage.read('games', gameId, 'default-tenant');
    if (!game) throw new Error('Game not found');
    if (game.status !== 'pending') throw new Error('Game already started');

    // Assign roles (simple: 1 impostor for every 5 players)
    const impostorCount = Math.max(1, Math.floor(game.players.length / 5));
    const shuffled = [...game.players].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((player, idx) => {
      player.role = idx < impostorCount
        ? { name: 'impostor', loyalty: 'impostor' }
        : { name: 'crew', loyalty: 'crew' };
    });

    game.status = 'active';
    game.events.push({
      id: uuidv4(),
      type: 'game-started',
      timestamp: new Date(),
    });
    game.updatedAt = new Date();

    await memoryStorage.update('games', game);
  }

  async getGameState(gameId: string): Promise<GameState | null> {
    const game = await memoryStorage.read('games', gameId, 'default-tenant');
    return game as GameState | null;
  }

  async joinTask(gameId: string, playerId: string, taskId: string): Promise<void> {
    const game = await memoryStorage.read('games', gameId, 'default-tenant');
    if (!game) throw new Error('Game not found');

    const task = game.environment.tasks.find((t: Task) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    if (task.participants.includes(playerId)) throw new Error('Already joined');
    if (task.participants.length >= task.slotsAvailable) throw new Error('Task full');

    task.participants.push(playerId);
    game.events.push({
      id: uuidv4(),
      type: 'task-started',
      timestamp: new Date(),
      playerId,
      data: { taskId },
    });
    game.updatedAt = new Date();

    await memoryStorage.update('games', game);
  }

  async completeTask(gameId: string, playerId: string, taskId: string): Promise<{ success: boolean }> {
    const game = await memoryStorage.read('games', gameId, 'default-tenant');
    if (!game) throw new Error('Game not found');

    const task = game.environment.tasks.find((t: Task) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    if (!task.participants.includes(playerId)) throw new Error('Not in this task');
    if (task.completed) throw new Error('Task already completed');

    // Simple completion: mark as done
    task.completed = true;
    const player = game.players.find((p: Player) => p.id === playerId);
    if (player) player.stats.tasksCompleted++;

    game.integrityMeter = Math.min(100, game.integrityMeter + 5); // Boost integrity
    game.events.push({
      id: uuidv4(),
      type: 'task-completed',
      timestamp: new Date(),
      playerId,
      data: { taskId },
    });
    game.updatedAt = new Date();

    await memoryStorage.update('games', game);
    return { success: true };
  }

  async castVote(gameId: string, voterId: string, suspectId: string): Promise<void> {
    const game = await memoryStorage.read('games', gameId, 'default-tenant');
    if (!game) throw new Error('Game not found');

    const voter = game.players.find((p: Player) => p.id === voterId);
    const suspect = game.players.find((p: Player) => p.id === suspectId);
    if (!voter || !suspect) throw new Error('Player not found');

    voter.stats.votesCast++;
    suspect.stats.votesReceived++;

    game.events.push({
      id: uuidv4(),
      type: 'vote-cast',
      timestamp: new Date(),
      playerId: voterId,
      data: { suspectId },
    });
    game.updatedAt = new Date();

    await memoryStorage.update('games', game);
  }

  async listGames(): Promise<GameState[]> {
    const games = await memoryStorage.query('games');
    return games as unknown as GameState[];
  }
}

// Singleton
export const gameEngine = new GameEngine();
