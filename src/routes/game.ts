import { Router, Request, Response } from 'express';
import { gameEngine } from '../services/GameEngine';
import type { CreateGameRequest } from '../models/types';

const router = Router();

// Create a new game
router.post('/create', async (req: Request, res: Response) => {
  try {
    const request: CreateGameRequest = {
      tenantId: 'default-tenant',
      environment: req.body.environment || 'office',
      maxPlayers: req.body.maxPlayers,
      impostorCount: req.body.impostorCount,
    };
    const result = await gameEngine.createGame(request);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Join a game
router.post('/join', async (req: Request, res: Response) => {
  try {
    const { gameId, playerName } = req.body;
    if (!gameId || !playerName) {
      return res.status(400).json({ error: 'gameId and playerName required' });
    }
    const player = await gameEngine.joinGame({ gameId, playerName });

    // Store player ID in session
    if (req.session) {
      req.session.playerId = player.id;
      req.session.gameId = gameId;
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Start a game
router.post('/start/:gameId', async (req: Request, res: Response) => {
  try {
    await gameEngine.startGame(req.params.gameId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get game state
router.get('/state/:gameId', async (req: Request, res: Response) => {
  try {
    const game = await gameEngine.getGameState(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Hide impostor roles if game is active (only show to impostor players)
    const playerId = req.session?.playerId;
    if (game.status === 'active' && playerId) {
      const currentPlayer = game.players.find((p) => p.id === playerId);
      const isImpostor = currentPlayer?.role.loyalty === 'impostor';

      if (!isImpostor) {
        // Hide other players' roles
        game.players = game.players.map((p) => ({
          ...p,
          role: p.id === playerId ? p.role : { name: 'crew', loyalty: 'crew' },
        }));
      }
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// List all games
router.get('/list', async (_req: Request, res: Response) => {
  try {
    const games = await gameEngine.listGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
