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
  startTime: string;
  endTime: string;
  allDay: true;
  color: '#0F9D58';
  calendarId: 'holidays';
  type: string[];
  isHoliday: true;
}
