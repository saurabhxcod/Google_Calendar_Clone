import React, { createContext, useContext } from 'react';
import { useCalendarVisibility } from '../hooks/useCalendarVisibility';
import type { UseCalendarVisibilityReturn } from '../hooks/useCalendarVisibility';

const CalendarVisibilityContext = createContext<UseCalendarVisibilityReturn | null>(null);

export const CalendarVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useCalendarVisibility();
  return (
    <CalendarVisibilityContext.Provider value={value}>
      {children}
    </CalendarVisibilityContext.Provider>
  );
};

export const useCalendarVisibilityContext = (): UseCalendarVisibilityReturn => {
  const context = useContext(CalendarVisibilityContext);
  if (!context) {
    throw new Error('useCalendarVisibilityContext must be used within a CalendarVisibilityProvider');
  }
  return context;
};
