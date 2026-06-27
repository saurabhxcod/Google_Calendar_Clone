import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Event from '../models/Event';
import { detectOverlap } from '../utils/overlap';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(authenticate);

// GET /api/events?start=ISO&end=ISO
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const start = Array.isArray(req.query.start) ? req.query.start[0] as string : req.query.start as string;
        const end = Array.isArray(req.query.end) ? req.query.end[0] as string : req.query.end as string;

        const filter: any = { userId: req.userId };
        if (start && end) {
            filter.$or = [
                { startTime: { $gte: new Date(start), $lte: new Date(end) } },
                { endTime: { $gte: new Date(start), $lte: new Date(end) } },
                { startTime: { $lte: new Date(start) }, endTime: { $gte: new Date(end) } },
            ];
        }

        const events = await Event.find(filter).sort({ startTime: 1 });
        res.json(events);
    } catch (err) {
        console.error('GET /api/events error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/events
router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const {
            title, description, startTime, endTime,
            allDay, color, location, recurrence, recurrenceEnd,
        } = req.body;

        if (!title || !startTime || !endTime) {
            return res.status(400).json({ error: 'title, startTime, endTime required' });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end <= start) {
            return res.status(400).json({ error: 'endTime must be after startTime' });
        }

        // Overlap detection
        if (!allDay) {
            const { hasOverlap, overlappingEvents } = await detectOverlap(
                req.userId!, start, end
            );
            if (hasOverlap) {
                return res.status(409).json({
                    error: 'overlap',
                    message: 'This event overlaps with existing events.',
                    overlappingEvents: overlappingEvents.map((e) => ({
                        id: e._id,
                        title: e.title,
                        startTime: e.startTime,
                        endTime: e.endTime,
                    })),
                });
            }
        }

        const groupId = recurrence !== 'none' ? uuidv4() : undefined;

        const event = await Event.create({
            userId: req.userId,
            title, description, startTime: start, endTime: end,
            allDay: allDay || false,
            color: color || '#039be5',
            location, recurrence: recurrence || 'none',
            recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : undefined,
            recurrenceGroupId: groupId,
        });

        res.status(201).json(event);
    } catch (err) {
        console.error('POST /api/events error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/events/:id
router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { editMode, ...updates } = req.body;
        // editMode: 'this' | 'following' | 'all'

        const event = await Event.findOne({ _id: id, userId: req.userId });
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (updates.startTime && updates.endTime) {
            const start = new Date(updates.startTime);
            const end = new Date(updates.endTime);
            if (!updates.allDay) {
                const { hasOverlap, overlappingEvents } = await detectOverlap(
                    req.userId!, start, end, String(id)
                );
                if (hasOverlap) {
                    return res.status(409).json({
                        error: 'overlap',
                        message: 'This event overlaps with existing events.',
                        overlappingEvents,
                    });
                }
            }
        }

        // Handle recurring edits
        if (event.recurrenceGroupId && editMode === 'all') {
            await Event.updateMany(
                { recurrenceGroupId: event.recurrenceGroupId, userId: req.userId },
                { $set: updates }
            );
        } else if (event.recurrenceGroupId && editMode === 'following') {
            await Event.updateMany(
                {
                    recurrenceGroupId: event.recurrenceGroupId,
                    userId: req.userId,
                    startTime: { $gte: event.startTime },
                },
                { $set: updates }
            );
        } else {
            Object.assign(event, updates);
            if (event.recurrenceGroupId) event.isException = true;
            await event.save();
        }

        const updated = await Event.findById(id);
        res.json(updated);
    } catch (err) {
        console.error('PUT /api/events/:id error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/events/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const rawDeleteMode = req.query.deleteMode;
        const deleteMode: string | undefined = Array.isArray(rawDeleteMode)
            ? (rawDeleteMode[0] as string)
            : (rawDeleteMode as string | undefined);

        const event = await Event.findOne({ _id: id, userId: req.userId });
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (event.recurrenceGroupId) {
            if (deleteMode === 'all') {
                await Event.deleteMany({
                    recurrenceGroupId: event.recurrenceGroupId,
                    userId: req.userId,
                });
            } else if (deleteMode === 'following') {
                await Event.deleteMany({
                    recurrenceGroupId: event.recurrenceGroupId,
                    userId: req.userId,
                    startTime: { $gte: event.startTime },
                });
            } else {
                await event.deleteOne();
            }
        } else {
            await event.deleteOne();
        }

        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('DELETE /api/events/:id error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
export default router;