import type { CalendarificHoliday, HolidayEvent } from '../types/holiday';

export function transformHolidays(holidays: CalendarificHoliday[]): HolidayEvent[] {
  if (!Array.isArray(holidays)) return [];
  return holidays.map((holiday, index) => {
    // Handle ISO string format safety
    const isoDateStr = holiday.date?.iso
      ? holiday.date.iso.split('T')[0]
      : `${holiday.date.datetime.year}-${String(holiday.date.datetime.month).padStart(2, '0')}-${String(holiday.date.datetime.day).padStart(2, '0')}`;

    const start = new Date(`${isoDateStr}T00:00:00`);
    const end = new Date(`${isoDateStr}T23:59:59`);

    return {
      id: `holiday-${isoDateStr}-${index}`,
      title: holiday.name || 'Holiday',
      description: holiday.description || '',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      allDay: true,
      color: '#0F9D58',
      calendarId: 'holidays',
      type: Array.isArray(holiday.type) ? holiday.type : [holiday.type || 'Holiday'],
      isHoliday: true,
    };
  });
}

export function filterHolidaysByDateRange(
  holidays: HolidayEvent[],
  start: Date,
  end: Date
): HolidayEvent[] {
  if (!Array.isArray(holidays)) return [];
  const startTimeMs = start.getTime();
  const endTimeMs = end.getTime();

  return holidays.filter((holiday) => {
    const hTime = new Date(holiday.startTime).getTime();
    return hTime >= startTimeMs && hTime <= endTimeMs;
  });
}

export function getHolidayTypeColor(types: string[]): string {
  if (!Array.isArray(types) || types.length === 0) return '#0F9D58';
  const primaryType = types[0];

  switch (primaryType) {
    case 'National holiday':
      return '#DB4437';
    case 'Religious holiday':
      return '#9C27B0';
    case 'Observance':
      return '#FF5722';
    case 'Season':
      return '#0F9D58';
    case 'Local holiday':
      return '#00BCD4';
    case 'United Nations':
      return '#4285F4';
    default:
      return '#0F9D58';
  }
}

export function getHolidayTypeLabel(types: string[]): string {
  if (Array.isArray(types) && types.length > 0 && types[0]) {
    return types[0];
  }
  return 'Holiday';
}
