import { Router, Request, Response } from 'express';
import { gameEngine } from '../services/GameEngine';

const router = Router();

// Join a task
router.post('/join', async (req: Request, res: Response) => {
  try {
    const { gameId, taskId } = req.body;
    const playerId = req.session?.playerId;
    
    if (!gameId || !taskId || !playerId) {
      return res.status(400).json({ error: 'gameId, taskId, and player session required' });
    }
    
    await gameEngine.joinTask(gameId, playerId, taskId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Complete a task
router.post('/complete', async (req: Request, res: Response) => {
  try {
    const { gameId, taskId } = req.body;
    const playerId = req.session?.playerId;
    
    if (!gameId || !taskId || !playerId) {
      return res.status(400).json({ error: 'gameId, taskId, and player session required' });
    }
    
    const result = await gameEngine.completeTask(gameId, playerId, taskId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
