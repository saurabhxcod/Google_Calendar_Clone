import {
  createContext, useContext, useState, useCallback,
  useEffect, useMemo, type ReactNode,
} from 'react';
import type { CalendarEvent, ViewType, EventFormData } from '../types';
import * as api from '../services/api';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, addWeeks, addDays,
} from '../utils/dateUtils';
import { useAuth } from './AuthContext';

interface CalendarContextType {
  view: ViewType;
  setView: (v: ViewType) => void;
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  events: CalendarEvent[];
  visibleEvents: CalendarEvent[];
  isLoading: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  navigate: (direction: 'prev' | 'next' | 'today') => void;
  openCreate: (date?: Date, startHour?: number) => void;
  openEdit: (event: CalendarEvent) => void;
  closeModal: () => void;
  modalState: ModalState;
  saveEvent: (data: Partial<EventFormData>, editMode?: string) => Promise<void>;
  removeEvent: (id: string, deleteMode?: string) => Promise<void>;
  refreshEvents: () => void;
  activePopoverEvent: CalendarEvent | null;
  setActivePopoverEvent: (event: CalendarEvent | null) => void;
}

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  event?: CalendarEvent;
  defaultDate?: Date;
  defaultHour?: number;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activePopoverEvent, setActivePopoverEvent] = useState<CalendarEvent | null>(null);

  const [visibilityTick, setVisibilityTick] = useState(0);

  useEffect(() => {
    const handler = () => setVisibilityTick(t => t + 1);
    window.addEventListener('storage', handler);
    const id = setInterval(handler, 300);
    return () => { window.removeEventListener('storage', handler); clearInterval(id); };
  }, []);

  const visibleEvents = useMemo(() => {
    try {
      const raw = localStorage.getItem('calendar_visibility');
      const visibility: Record<string, boolean> = raw ? JSON.parse(raw) : {};
      if (Object.keys(visibility).length === 0) return events;
      return events.filter(e => visibility[e.calendarId ?? 'primary'] !== false);
    } catch {
      return events;
    }
  }, [events, visibilityTick]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
  });

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const getDateRange = useCallback(() => {
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
      return { start, end };
    } else if (view === 'week') {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 0 }),
        end: endOfWeek(currentDate, { weekStartsOn: 0 }),
      };
    } else {
      return { start: currentDate, end: currentDate };
    }
  }, [view, currentDate]);

  const loadEvents = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { start, end } = getDateRange();
      const { data } = await api.fetchEvents(start.toISOString(), end.toISOString());
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, getDateRange]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const navigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }
    const delta = direction === 'next' ? 1 : -1;
    if (view === 'month') setCurrentDate((d) => addMonths(d, delta));
    else if (view === 'week') setCurrentDate((d) => addWeeks(d, delta));
    else setCurrentDate((d) => addDays(d, delta));
  };

  const openCreate = (date?: Date, startHour?: number) => {
    setModalState({ isOpen: true, mode: 'create', defaultDate: date, defaultHour: startHour });
  };

  const openEdit = (event: CalendarEvent) => {
    setModalState({ isOpen: true, mode: 'edit', event });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create' });
  };

  const saveEvent = async (data: Partial<EventFormData>, editMode?: string) => {
    if (modalState.mode === 'create') {
      await api.createEvent(data);
    } else if (modalState.event) {
      await api.updateEvent(modalState.event._id, { ...data, editMode });
    }
    await loadEvents();
    closeModal();
  };

  const removeEvent = async (id: string, deleteMode?: string) => {
    await api.deleteEvent(id, deleteMode);
    await loadEvents();
    closeModal();
  };

  return (
    <CalendarContext.Provider value={{
      view, setView, currentDate, setCurrentDate,
      events, visibleEvents, isLoading, isSidebarOpen, toggleSidebar, navigate,
      openCreate, openEdit, closeModal, modalState,
      saveEvent, removeEvent, refreshEvents: loadEvents,
      activePopoverEvent, setActivePopoverEvent,
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
};