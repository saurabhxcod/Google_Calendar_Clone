export type ViewType = 'month' | 'week' | 'day';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export type EventColor =
    | '#4285f4' | '#0f9d58' | '#f4b400' | '#db4437'
    | '#9c27b0' | '#00bcd4' | '#ff5722' | '#607d8b';

export interface CalendarEvent {
    _id: string;
    userId: string;
    calendarId?: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    allDay: boolean;
    color: EventColor;
    location?: string;
    recurrence: RecurrenceType;
    recurrenceEnd?: string;
    recurrenceGroupId?: string;
    isException: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
}

export interface OverlapError {
    error: 'overlap';
    message: string;
    overlappingEvents: Array<{
        id: string;
        title: string;
        startTime: string;
        endTime: string;
    }>;
}

export interface EventFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    allDay: boolean;
    color: EventColor;
    location: string;
    recurrence: RecurrenceType;
    recurrenceEnd: string;
}

export type DeleteMode = 'this' | 'following' | 'all';
export type EditMode = 'this' | 'following' | 'all';