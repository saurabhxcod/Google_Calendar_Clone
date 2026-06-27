import type { CalendarificHoliday } from '../types/holiday';

const API_KEY = import.meta.env.VITE_CALENDARIFIC_API_KEY;
const BASE_URL = 'https://calendarific.com/api/v2';

export interface FetchHolidaysParams {
  country?: string;
  year: number;
}

export async function fetchHolidays(params: FetchHolidaysParams): Promise<CalendarificHoliday[]> {
  if (!API_KEY) {
    console.warn('Calendarific API key not found. Add VITE_CALENDARIFIC_API_KEY to .env');
    return [];
  }

  const country = params.country || 'IN';
  const url = `${BASE_URL}/holidays?api_key=${encodeURIComponent(API_KEY)}&country=${encodeURIComponent(country)}&year=${params.year}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Calendarific API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data && data.meta && data.meta.code === 200 && data.response && Array.isArray(data.response.holidays)) {
      return data.response.holidays as CalendarificHoliday[];
    }

    if (data && data.meta && data.meta.code !== 200) {
      throw new Error(data.meta.error_detail || 'Calendarific API returned non-200 status code');
    }

    return [];
  } catch (err) {
    console.error('Failed to fetch holidays from Calendarific:', err);
    return [];
  }
}
