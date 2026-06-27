import { useState, useCallback, useMemo } from 'react';
import type { CalendarDefinition, VisibilityMap } from '../utils/calendarVisibility';
import {
  DEFAULT_CALENDARS,
  loadVisibilityFromStorage,
  saveVisibilityToStorage,
  buildDefaultVisibilityMap,
  ensureAtLeastOneVisible,
} from '../utils/calendarVisibility';

export interface UseCalendarVisibilityReturn {
  visibleCalendars: VisibilityMap;
  calendars: CalendarDefinition[];
  toggleCalendar: (id: string) => void;
  displayOnlyThis: (id: string) => void;
  showAll: () => void;
  isVisible: (id: string) => boolean;
  changeCalendarColor: (id: string, color: string) => void;
  myCalendarsOpen: boolean;
  setMyCalendarsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  otherCalendarsOpen: boolean;
  setOtherCalendarsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useCalendarVisibility(): UseCalendarVisibilityReturn {
  const [calendarList, setCalendarList] = useState<CalendarDefinition[]>(DEFAULT_CALENDARS);

  const [visibleCalendars, setVisibleCalendars] = useState<VisibilityMap>(() => {
    const stored = loadVisibilityFromStorage();
    if (stored) {
      return ensureAtLeastOneVisible(stored);
    }
    return buildDefaultVisibilityMap();
  });

  const [myCalendarsOpen, setMyCalendarsOpen] = useState<boolean>(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState<boolean>(true);

  const updateVisibilityMap = useCallback((newMap: VisibilityMap) => {
    const validated = ensureAtLeastOneVisible(newMap);
    setVisibleCalendars(validated);
    saveVisibilityToStorage(validated);
  }, []);

  const toggleCalendar = useCallback(
    (id: string) => {
      setVisibleCalendars((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        const validated = ensureAtLeastOneVisible(next);
        saveVisibilityToStorage(validated);
        return validated;
      });
    },
    []
  );

  const displayOnlyThis = useCallback(
    (id: string) => {
      setVisibleCalendars((prev) => {
        const next: VisibilityMap = {};
        Object.keys(prev).forEach((key) => {
          next[key] = key === id;
        });
        // Ensure requested calendar is true even if not in keys
        next[id] = true;
        const validated = ensureAtLeastOneVisible(next);
        saveVisibilityToStorage(validated);
        return validated;
      });
    },
    []
  );

  const showAll = useCallback(() => {
    setVisibleCalendars((prev) => {
      const next: VisibilityMap = {};
      Object.keys(prev).forEach((key) => {
        next[key] = true;
      });
      DEFAULT_CALENDARS.forEach((cal) => {
        next[cal.id] = true;
      });
      saveVisibilityToStorage(next);
      return next;
    });
  }, []);

  const isVisible = useCallback(
    (id: string) => {
      return visibleCalendars[id] ?? true;
    },
    [visibleCalendars]
  );

  const changeCalendarColor = useCallback((id: string, color: string) => {
    setCalendarList((prev) =>
      prev.map((cal) => (cal.id === id ? { ...cal, color } : cal))
    );
  }, []);

  const calendars = useMemo(() => {
    return calendarList.map((cal) => ({
      ...cal,
      visible: visibleCalendars[cal.id] ?? cal.visible,
    }));
  }, [calendarList, visibleCalendars]);

  return {
    visibleCalendars,
    calendars,
    toggleCalendar,
    displayOnlyThis,
    showAll,
    isVisible,
    changeCalendarColor,
    myCalendarsOpen,
    setMyCalendarsOpen,
    otherCalendarsOpen,
    setOtherCalendarsOpen,
  };
}
