import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Tag, AlignLeft, MapPin, X } from 'lucide-react';
import type { HolidayEvent } from '../../types/holiday';
import { format, parseUTCtoLocal } from '../../utils/dateUtils';
import { getHolidayTypeColor } from '../../utils/holidayUtils';

interface HolidayDetailModalProps {
  holiday: HolidayEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HolidayDetailModal: React.FC<HolidayDetailModalProps> = ({
  holiday,
  isOpen,
  onClose,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      closeBtnRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !holiday) return null;

  const formattedDate = format(parseUTCtoLocal(holiday.startTime), 'EEEE, MMMM d, yyyy');

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="holiday-modal-title"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-[480px] relative font-sans text-[#1f1f1f] select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-3 bg-[#0F9D58] w-full" />

          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-[#5f6368] transition-colors focus:outline-none"
          >
            <X size={20} />
          </button>

          <div className="p-6 pt-5 space-y-5">
            <h2
              id="holiday-modal-title"
              className="text-2xl font-semibold text-[#1f1f1f] tracking-tight pr-8 font-sans"
            >
              {holiday.title}
            </h2>

            <div className="space-y-3 text-sm text-[#3c4043]">
              <div className="flex items-center gap-3.5">
                <Calendar size={18} className="text-[#5f6368] flex-shrink-0" />
                <span className="font-medium text-[#3c4043]">Holidays in India</span>
              </div>

              <div className="flex items-center gap-3.5">
                <Clock size={18} className="text-[#5f6368] flex-shrink-0" />
                <span>
                  {formattedDate} <span className="text-gray-500 font-normal">· All day</span>
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <Tag size={18} className="text-[#5f6368] flex-shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1.5">
                  {holiday.type.map((t, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: getHolidayTypeColor([t]) }}
                      className="rounded-full px-3 py-0.5 text-white text-xs font-medium shadow-2xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <MapPin size={18} className="text-[#5f6368] flex-shrink-0" />
                <span>India</span>
              </div>

              {holiday.description && (
                <div className="flex items-start gap-3.5 pt-1">
                  <AlignLeft size={18} className="text-[#5f6368] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5f6368] leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {holiday.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-[#0F9D58] hover:bg-[#0b8043] text-white text-sm font-medium transition-colors focus:outline-none shadow-xs"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
