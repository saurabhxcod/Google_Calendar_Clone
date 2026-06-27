import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Edit2, Trash2, Clock, MapPin,
  AlignLeft, Repeat, Calendar
} from 'lucide-react';
import { format, parseUTCtoLocal } from '../../utils/dateUtils';
import type { CalendarEvent } from '../../types';
import { useCalendar } from '../../context/CalendarContext';

interface Props {
  event: CalendarEvent | null;
  anchorRect?: DOMRect | null;
  onClose: () => void;
}

const COLOR_NAMES: Record<string, string> = {
  '#d50000': 'Tomato',
  '#e67c73': 'Flamingo',
  '#f4511e': 'Tangerine',
  '#f6bf26': 'Banana',
  '#33b679': 'Sage',
  '#0b8043': 'Basil',
  '#039be5': 'Peacock',
  '#3f51b5': 'Blueberry',
  '#7986cb': 'Lavender',
  '#8e24aa': 'Grape',
  '#616161': 'Graphite',
  '#4285f4': 'Blueberry',
  '#0f9d58': 'Basil',
  '#f4b400': 'Banana',
  '#db4437': 'Tomato',
  '#9c27b0': 'Grape',
  '#00bcd4': 'Peacock',
  '#ff5722': 'Tangerine',
  '#607d8b': 'Graphite',
};

const RECURRENCE_LABELS: Record<string, string> = {
  daily: 'Repeats daily',
  weekly: 'Repeats weekly',
  monthly: 'Repeats monthly',
};

export default function EventPopover({ event, anchorRect, onClose }: Props) {
  const { openEdit, removeEvent } = useCalendar();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!event) return null;

  const POPOVER_WIDTH = 340;
  const POPOVER_HEIGHT = 280;
  const MARGIN = 12;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = Math.max(MARGIN, (viewportWidth - POPOVER_WIDTH) / 2);
  let top = Math.max(MARGIN, (viewportHeight - POPOVER_HEIGHT) / 2);

  if (anchorRect) {
    left = anchorRect.right + MARGIN;
    if (left + POPOVER_WIDTH > viewportWidth) {
      left = anchorRect.left - POPOVER_WIDTH - MARGIN;
    }
    if (left < MARGIN) left = MARGIN;

    top = anchorRect.top;
    if (top + POPOVER_HEIGHT > viewportHeight) {
      top = viewportHeight - POPOVER_HEIGHT - MARGIN;
    }
    if (top < MARGIN) top = MARGIN;
  }

  const start = parseUTCtoLocal(event.startTime);
  const end = parseUTCtoLocal(event.endTime);

  const handleEdit = () => {
    onClose();
    openEdit(event);
  };

  const handleDelete = async () => {
    onClose();
    await removeEvent(event._id);
  };

  const formatTimeRange = () => {
    if (event.allDay) return 'All day';
    const dateStr = format(start, 'EEEE, MMMM d');
    const timeStr = `${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`;
    return `${dateStr} · ${timeStr}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        key="popover"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ position: 'fixed', top, left, width: POPOVER_WIDTH, zIndex: 999 }}
        className="bg-white rounded-xl shadow-md border border-[#dadce0] overflow-hidden select-none"
        role="dialog"
        aria-label={`Event details for ${event.title}`}
      >
        <div style={{ backgroundColor: event.color || '#039be5' }} className="h-2.5 w-full" />

        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: event.color || '#039be5' }}
            />
            <span className="text-xs font-medium text-[#5f6368] font-sans">
              {COLOR_NAMES[event.color] || 'Peacock'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              aria-label="Edit event"
              className="p-1.5 rounded-full hover:bg-[rgba(60,64,67,0.08)] text-[#5f6368] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete event"
              className="p-1.5 rounded-full hover:bg-red-50 text-[#5f6368] hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close details popover"
              className="p-1.5 rounded-full hover:bg-[rgba(60,64,67,0.08)] text-[#5f6368] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 pt-1 space-y-3.5">
          <h3 className="text-xl font-normal text-[#3c4043] leading-snug font-sans">
            {event.title}
          </h3>

          <div className="flex items-start gap-3.5">
            <Clock size={18} className="text-[#5f6368] flex-shrink-0 mt-0.5" />
            <span className="text-sm text-[#3c4043] font-sans">{formatTimeRange()}</span>
          </div>

          {event.recurrence !== 'none' && (
            <div className="flex items-center gap-3.5">
              <Repeat size={18} className="text-[#5f6368] flex-shrink-0" />
              <span className="text-sm text-[#3c4043] font-sans">
                {RECURRENCE_LABELS[event.recurrence]}
                {event.recurrenceEnd && (
                  <span className="text-[#5f6368]">
                    {' '}until {format(parseUTCtoLocal(event.recurrenceEnd), 'MMM d, yyyy')}
                  </span>
                )}
              </span>
            </div>
          )}

          {event.location && (
            <div className="flex items-start gap-3.5">
              <MapPin size={18} className="text-[#5f6368] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#3c4043] font-sans">{event.location}</span>
            </div>
          )}

          {event.description && (
            <div className="flex items-start gap-3.5">
              <AlignLeft size={18} className="text-[#5f6368] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#3c4043] font-sans line-clamp-3 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="flex items-center gap-3.5">
            <Calendar size={18} className="text-[#5f6368] flex-shrink-0" />
            <span className="text-sm text-[#3c4043] font-sans font-medium">My Calendar</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}