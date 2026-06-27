export interface CalendarificHoliday {
  name: string;
  description: string;
  country?: { id: string; name: string };
  date: {
    iso: string;
    datetime: {
      year: number;
      month: number;
      day: number;
    };
  };
  type: string[];
  locations: string;
  states: string;
}

export interface HolidayEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;       // ISO string at 00:00:00 local
  endTime: string;         // ISO string at 23:59:59 local
  allDay: true;
  color: '#0F9D58';        // always holidays green
  calendarId: 'holidays';
  type: string[];
  isHoliday: true;
}
