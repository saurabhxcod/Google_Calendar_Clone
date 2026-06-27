import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { CalendarDefinition } from '../../utils/calendarVisibility';
import { CalendarFilterItem } from './CalendarFilterItem';

interface CalendarSectionProps {
  title: string;
  calendars: CalendarDefinition[];
  isOpen: boolean;
  onToggle: () => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  title,
  calendars,
  isOpen,
  onToggle,
}) => {
  if (!calendars || calendars.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 px-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[rgba(60,64,67,0.08)] transition-colors text-left focus:outline-none select-none"
      >
        <span className="text-xs font-medium text-[#5f6368] tracking-wide font-sans">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronDown size={16} className="text-[#5f6368]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden space-y-0.5 mt-1"
          >
            {calendars.map((cal) => (
              <CalendarFilterItem key={cal.id} calendar={cal} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
