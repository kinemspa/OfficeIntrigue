import { Router, Request, Response } from 'express';
import { gameEngine } from '../services/GameEngine';

const router = Router();

// Cast a vote
router.post('/cast', async (req: Request, res: Response) => {
  try {
    const { gameId, suspectId } = req.body;
    const voterId = req.session?.playerId;
    
    if (!gameId || !suspectId || !voterId) {
      return res.status(400).json({ error: 'gameId, suspectId, and player session required' });
    }
    
    await gameEngine.castVote(gameId, voterId, suspectId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
