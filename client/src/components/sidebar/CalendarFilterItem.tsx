import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MoreVertical, Plus } from 'lucide-react';
import type { CalendarDefinition } from '../../utils/calendarVisibility';
import { useCalendarVisibilityContext } from '../../context/CalendarVisibilityContext';

interface CalendarFilterItemProps {
  calendar: CalendarDefinition;
}

const PALETTE_COLORS = [
  '#8e24aa', '#e67c73', '#f6bf26', '#0b8043', '#3f51b5', '#ab47bc',
  '#d81b60', '#f4511e', '#c0ca33', '#00897b', '#7986cb', '#795548',
  '#d50000', '#fb8c00', '#7cb342', '#039be5', '#b39ddb', '#616161',
  '#ef5350', '#ffb300', '#33b679', '#4285f4', '#9c27b0', '#a1887f',
];

export const CalendarFilterItem: React.FC<CalendarFilterItemProps> = React.memo(({ calendar }) => {
  const { toggleCalendar, displayOnlyThis, changeCalendarColor } = useCalendarVisibilityContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    toggleCalendar(calendar.id);
  }, [calendar.id, toggleCalendar]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  const handleMoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      const POPOVER_HEIGHT = 270;
      const viewportHeight = window.innerHeight;
      let top = rect.top;
      if (top + POPOVER_HEIGHT > viewportHeight - 16) {
        top = Math.max(16, viewportHeight - POPOVER_HEIGHT - 16);
      }
      setMenuPos({ top, left: rect.right + 6 });
      setIsMenuOpen(true);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div
      className="relative group flex items-center justify-between h-8 px-2 rounded-md hover:bg-[rgba(60,64,67,0.08)] cursor-pointer transition-colors select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox and Calendar Name */}
      <div
        className="flex items-center gap-3 min-w-0 flex-1 py-1"
        onClick={handleToggle}
        role="checkbox"
        aria-checked={calendar.visible}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className="w-[18px] h-[18px] rounded-xs flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            backgroundColor: calendar.visible ? calendar.color : 'transparent',
            borderColor: calendar.color,
            borderWidth: calendar.visible ? '0px' : '2px',
          }}
        >
          <AnimatePresence>
            {calendar.visible && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Check size={12} className="text-white stroke-[3]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-sm text-[#3c4043] truncate font-sans font-normal">
          {calendar.name}
        </span>
      </div>

      {/* Three-dot options button */}
      <AnimatePresence>
        {(isHovered || isMenuOpen) && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={handleMoreClick}
            aria-label={`Options for ${calendar.name}`}
            className="p-1 rounded-full hover:bg-[rgba(60,64,67,0.12)] text-[#5f6368] focus:outline-none"
          >
            <MoreVertical size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && menuPos && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 999 }}
            className="bg-[#f0f4f9] text-[#1f1f1f] rounded-2xl shadow-xl border border-[#dadce0]/80 py-2 w-[225px] select-none font-sans flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => {
                displayOnlyThis(calendar.id);
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 text-sm text-[#1f1f1f] hover:bg-[#e1e6ed]/60 cursor-pointer transition-colors font-sans font-normal"
            >
              Display this only
            </div>

            <div
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm text-[#1f1f1f] hover:bg-[#e1e6ed]/60 cursor-pointer transition-colors font-sans font-normal"
            >
              Settings and sharing
            </div>

            <div className="border-b border-[#dadce0]/80 my-1.5" />

            {/* Color Palette Swatches (6 cols x 4 rows) */}
            <div className="grid grid-cols-6 gap-2 mb-2 px-4 pt-1">
              {PALETTE_COLORS.map((hex) => {
                const isSelected = calendar.color.toLowerCase() === hex.toLowerCase();
                return (
                  <button
                    key={hex}
                    onClick={() => {
                      changeCalendarColor(calendar.id, hex);
                      setIsMenuOpen(false);
                    }}
                    style={{ backgroundColor: hex }}
                    aria-label={`Change color to ${hex}`}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none shadow-2xs"
                  >
                    {isSelected && <Check size={12} className="text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Plus button at bottom left of palette */}
            <div className="px-4 pt-0.5 pb-1">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-6 h-6 rounded-full bg-[#e1e6ed] hover:bg-[#d0d6e0] text-[#444746] flex items-center justify-center transition-colors focus:outline-none"
              >
                <Plus size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CalendarFilterItem.displayName = 'CalendarFilterItem';
