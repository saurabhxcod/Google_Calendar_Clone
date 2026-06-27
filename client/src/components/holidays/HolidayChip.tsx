import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { HolidayEvent } from '../../types/holiday';
import { format, parseUTCtoLocal } from '../../utils/dateUtils';
import { getHolidayTypeColor, getHolidayTypeLabel } from '../../utils/holidayUtils';
import { HolidayDetailModal } from './HolidayDetailModal';

interface HolidayChipProps {
  holiday: HolidayEvent;
  compact?: boolean;
}

export const HolidayChip: React.FC<HolidayChipProps> = React.memo(({ holiday, compact = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<'above' | 'below'>('above');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (chipRef.current) {
      const rect = chipRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight / 2) {
        setTooltipPos('below');
      } else {
        setTooltipPos('above');
      }
    }

    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 400);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowTooltip(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShowTooltip(false);
    setIsModalOpen(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      setIsModalOpen(true);
    }
  }, []);

  const formattedDate = format(parseUTCtoLocal(holiday.startTime), 'EEEE, MMMM d');
  const typeColor = getHolidayTypeColor(holiday.type);
  const typeLabel = getHolidayTypeLabel(holiday.type);

  const truncatedDescription = holiday.description
    ? holiday.description.length > 120
      ? holiday.description.substring(0, 120) + '...'
      : holiday.description
    : '';

  return (
    <>
      <div className="relative w-full my-0.5" ref={chipRef}>
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={`${holiday.title} - ${formattedDate} - ${typeLabel}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`w-full text-white rounded-md cursor-pointer transition-all select-none shadow-2xs flex items-center gap-1.5 px-2 ${
            compact ? 'py-0.5 text-[11px]' : 'py-1 text-[12px]'
          }`}
          style={{ backgroundColor: 'rgba(15, 157, 88, 0.9)' }}
        >
          {/* Type color indicator dot */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 border border-white/40"
            style={{ backgroundColor: typeColor }}
          />
          <span className="font-medium truncate flex-1 leading-tight">{holiday.title}</span>
        </motion.div>

        {/* Hover Tooltip */}
        {showTooltip && (
          <div
            className={`absolute left-0 z-50 bg-white text-[#1f1f1f] shadow-xl border border-[#dadce0] rounded-xl p-3 min-w-48 max-w-64 pointer-events-none font-sans select-none ${
              tooltipPos === 'above' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            }`}
          >
            <div className="font-semibold text-sm text-[#1f1f1f] leading-snug">{holiday.title}</div>
            <div className="text-xs text-gray-500 mt-0.5">{formattedDate}</div>
            <div className="flex flex-wrap gap-1 mt-1.5 mb-1.5">
              {holiday.type.map((t, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: getHolidayTypeColor([t]) }}
                  className="rounded-full px-2 py-0.5 text-white text-[10px] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
            {truncatedDescription && (
              <p className="text-xs text-gray-600 leading-normal border-t border-gray-100 pt-1.5 mt-1">
                {truncatedDescription}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Read-Only Detail Modal */}
      <HolidayDetailModal
        holiday={holiday}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});

HolidayChip.displayName = 'HolidayChip';
