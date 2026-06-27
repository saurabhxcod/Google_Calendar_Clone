import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../context/CalendarContext';
import { useHolidayContext } from '../context/HolidayContext';
import { searchEvents, getCachedResults, setCachedResults } from '../services/searchService';
import type { SearchResult, UseEventSearchReturn } from '../types/search';

export function useEventSearch(): UseEventSearchReturn {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();
  const { setCurrentDate, setView, events, setActivePopoverEvent } = useCalendar();
  const { holidays, setActiveHolidayModal } = useHolidayContext();

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    setSelectedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const cached = getCachedResults(q);
    if (cached) {
      setResults(cached);
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchEvents(q);
        const term = q.trim().toLowerCase();
        const matchingHolidays: SearchResult[] = holidays
          .filter(
            (h) =>
              h.title.toLowerCase().includes(term) ||
              (h.description && h.description.toLowerCase().includes(term))
          )
          .map((h) => ({
            id: h.id,
            title: h.title,
            description: h.description,
            startTime: h.startTime,
            endTime: h.endTime,
            location: 'India',
            color: h.color || '#0F9D58',
            allDay: true,
            calendarId: 'holidays',
            isHoliday: true,
            type: h.type,
          }));

        const combined = [...data, ...matchingHolidays];
        setResults(combined);
        setCachedResults(q, combined);
        setError(null);
      } catch {
        setError('Unable to search events.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [holidays]);

  const clearSearch = useCallback(() => {
    setQueryState('');
    setResults([]);
    setIsOpen(false);
    setError(null);
    setSelectedIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  const navigateToEvent = useCallback((result: SearchResult) => {
    const date = new Date(result.startTime);
    setCurrentDate(date);
    setView('day');
    closeDropdown();
    setQueryState('');

    if (result.isHoliday) {
      const holidayEvent = holidays.find((h) => h.id === result.id) || {
        id: result.id,
        title: result.title,
        description: result.description,
        startTime: result.startTime,
        endTime: result.endTime,
        allDay: true,
        color: '#0F9D58',
        calendarId: 'holidays',
        type: result.type || ['Holiday'],
        isHoliday: true,
      };
      setTimeout(() => {
        setActiveHolidayModal(holidayEvent as any);
      }, 50);
      return;
    }

    const existing = events.find((e) => e._id === result.id);
    const popoverEvent = existing || {
      _id: result.id,
      userId: '',
      calendarId: result.calendarId || 'primary',
      title: result.title,
      description: result.description,
      startTime: result.startTime,
      endTime: result.endTime,
      allDay: result.allDay,
      color: (result.color as any) || '#039be5',
      location: result.location,
      recurrence: 'none',
      isException: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setActivePopoverEvent(popoverEvent as any);
    }, 50);
  }, [events, holidays, setCurrentDate, setView, closeDropdown, setActivePopoverEvent, setActiveHolidayModal]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        navigateToEvent(results[selectedIndex]);
      } else if (query.trim()) {
        closeDropdown();
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }

    if (e.key === 'Escape') {
      closeDropdown();
    }
  }, [isOpen, results, selectedIndex, query, navigateToEvent, navigate, closeDropdown]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    isOpen,
    selectedIndex,
    setSelectedIndex,
    clearSearch,
    handleKeyDown,
    closeDropdown,
  };
}
