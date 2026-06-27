import Event from '../models/Event';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
  allDay: boolean;
  calendarId: string;
}

export async function searchEvents(
  userId: string,
  query: string
): Promise<SearchResult[]> {
  try {
    const normalized = query.trim().replace(/\s+/g, ' ');
    if (!normalized) {
      return [];
    }

    // Escape special regex characters
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');

    const docs = await Event.find({
      userId,
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
      ],
    })
      .sort({ startTime: -1 })
      .limit(20);

    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title ?? '',
      description: doc.description ?? '',
      startTime: doc.startTime ? doc.startTime.toISOString() : new Date().toISOString(),
      endTime: doc.endTime ? doc.endTime.toISOString() : new Date().toISOString(),
      location: doc.location ?? '',
      color: doc.color ?? '#4285f4',
      allDay: doc.allDay ?? false,
      calendarId: (doc as any).calendarId ?? 'primary',
    }));
  } catch (err: any) {
    console.error('searchEvents service error:', err);
    throw new Error(err?.message || 'Failed to search events in database');
  }
}
