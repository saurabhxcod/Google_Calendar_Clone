import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, addDays, addWeeks, addMonths, isSameDay,
    isSameMonth, isToday, parseISO, startOfDay, endOfDay,
    differenceInMinutes, setHours, setMinutes,
} from 'date-fns';

export const formatDateForAPI = (date: Date): string => date.toISOString();

export const parseUTCtoLocal = (isoString: string): Date => parseISO(isoString);

export const getMonthGrid = (date: Date): Date[][] => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks;
};

export const getWeekDays = (date: Date): Date[] => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const getHours = (): string[] =>
    Array.from({ length: 24 }, (_, i) => {
        const h = i % 12 || 12;
        const ampm = i < 12 ? 'AM' : 'PM';
        return `${h} ${ampm}`;
    });

export const getEventTop = (startTime: Date): number => {
    const minutes = startTime.getHours() * 60 + startTime.getMinutes();
    return (minutes / 60) * 64; // 64px per hour
};

export const getEventHeight = (startTime: Date, endTime: Date): number => {
    const mins = differenceInMinutes(endTime, startTime);
    return Math.max((mins / 60) * 64, 22); // min height 22px
};

export const snapToQuarterHour = (date: Date): Date => {
    const mins = date.getMinutes();
    const snapped = Math.round(mins / 15) * 15;
    return setMinutes(setHours(date, date.getHours()), snapped % 60);
};

export {
    format, isSameDay, isSameMonth, isToday, addDays, addWeeks,
    addMonths, startOfDay, endOfDay, parseISO, startOfWeek, endOfWeek,
    startOfMonth, endOfMonth
};