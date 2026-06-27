import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { searchEvents } from '../services/eventSearch.service';

export async function searchEventsController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const rawQ = req.query.q;
    const qStr = Array.isArray(rawQ) ? rawQ[0] : (rawQ as string ?? '');
    const trimmed = String(qStr).trim();

    if (!trimmed) {
      res.json([]);
      return;
    }

    const results = await searchEvents(req.userId!, trimmed);
    res.json(results);
  } catch (err) {
    console.error('searchEventsController error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
}
