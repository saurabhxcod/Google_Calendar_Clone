import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { HolidayEvent } from '../types/holiday';
import { useHolidays } from '../hooks/useHolidays';
import { HolidayDetailModal } from '../components/holidays/HolidayDetailModal';

export interface HolidayContextType {
  holidays: HolidayEvent[];
  isLoading: boolean;
  error: string | null;
  selectedCountry: string;
  setSelectedCountry: (c: string) => void;
  visibleHolidayTypes: string[];
  toggleHolidayType: (type: string) => void;
  activeHolidayModal: HolidayEvent | null;
  setActiveHolidayModal: (h: HolidayEvent | null) => void;
}

const HolidayContext = createContext<HolidayContextType | null>(null);

export const HolidayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('IN');
  const [activeHolidayModal, setActiveHolidayModal] = useState<HolidayEvent | null>(null);
  const [visibleHolidayTypes, setVisibleHolidayTypes] = useState<string[]>([
    'National holiday',
    'Religious holiday',
    'Observance',
    'Season',
    'Local holiday',
  ]);

  const currentYear = new Date().getFullYear();
  const { holidays, isLoading, error } = useHolidays(currentYear, selectedCountry);

  const toggleHolidayType = useCallback((type: string) => {
    setVisibleHolidayTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  return (
    <HolidayContext.Provider
      value={{
        holidays,
        isLoading,
        error,
        selectedCountry,
        setSelectedCountry,
        visibleHolidayTypes,
        toggleHolidayType,
        activeHolidayModal,
        setActiveHolidayModal,
      }}
    >
      {children}
      <HolidayDetailModal
        holiday={activeHolidayModal}
        isOpen={!!activeHolidayModal}
        onClose={() => setActiveHolidayModal(null)}
      />
    </HolidayContext.Provider>
  );
};

export const useHolidayContext = (): HolidayContextType => {
  const context = useContext(HolidayContext);
  if (!context) {
    throw new Error('useHolidayContext must be used within a HolidayProvider');
  }
  return context;
};
