import { useState, useEffect, useRef, useCallback } from 'react';
import type { HolidayEvent } from '../types/holiday';
import { fetchHolidays } from '../services/calendarificApi';
import { transformHolidays } from '../utils/holidayUtils';

export interface UseHolidaysReturn {
  holidays: HolidayEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHolidays(year: number, country?: string): UseHolidaysReturn {
  const [holidays, setHolidays] = useState<HolidayEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, HolidayEvent[]>>(new Map());

  const targetCountry = country || 'IN';
  const cacheKey = `${targetCountry}-${year}`;

  const loadHolidays = useCallback(async () => {
    if (cacheRef.current.has(cacheKey)) {
      setHolidays(cacheRef.current.get(cacheKey)!);
      setIsLoading(false);
      setError(null);
      return;
    }

    const sessionKey = `holidays_${targetCountry}_${year}`;
    try {
      const stored = sessionStorage.getItem(sessionKey);
      if (stored) {
        const parsed = JSON.parse(stored) as HolidayEvent[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          cacheRef.current.set(cacheKey, parsed);
          setHolidays(parsed);
          setIsLoading(false);
          setError(null);
          return;
        }
      }
    } catch {
    }

    setIsLoading(true);
    setError(null);

    try {
      const rawHolidays = await fetchHolidays({ country: targetCountry, year });
      const transformed = transformHolidays(rawHolidays);

      cacheRef.current.set(cacheKey, transformed);
      try {
        sessionStorage.setItem(sessionKey, JSON.stringify(transformed));
      } catch {
      }

      setHolidays(transformed);
    } catch (err: any) {
      const msg = err?.message || 'Could not load holidays. Check your API key or connection.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, targetCountry, year]);

  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);

  return {
    holidays,
    isLoading,
    error,
    refetch: loadHolidays,
  };
}
