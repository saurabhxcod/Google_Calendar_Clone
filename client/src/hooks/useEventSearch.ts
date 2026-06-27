import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../context/CalendarContext';
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
  const { setCurrentDate, setView } = useCalendar();

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
        setResults(data);
        setCachedResults(q, data);
        setError(null);
      } catch {
        setError('Unable to search events.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

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

  const navigateToEvent = useCallback((event: SearchResult) => {
    const date = new Date(event.startTime);
    setCurrentDate(date);
    setView('day');
    closeDropdown();
    setQueryState('');
  }, [setCurrentDate, setView, closeDropdown]);

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
