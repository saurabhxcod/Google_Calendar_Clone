import Event, { IEvent } from '../models/Event';

interface OverlapResult {
    hasOverlap: boolean;
    overlappingEvents: IEvent[];
}

export async function detectOverlap(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string
): Promise<OverlapResult> {
    const query: any = {
        userId,
        allDay: false,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    const overlappingEvents = await Event.find(query);

    return {
        hasOverlap: overlappingEvents.length > 0,
        overlappingEvents,
    };
}