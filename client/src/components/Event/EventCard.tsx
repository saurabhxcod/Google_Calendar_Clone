
import { motion } from 'framer-motion';
import { format, parseUTCtoLocal } from '../../utils/dateUtils';
import type { CalendarEvent } from '../../types';

interface Props {
  event: CalendarEvent;
  onClick: () => void;
  compact?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  '#4285f4': 'bg-blue-500 hover:bg-blue-600',
  '#0f9d58': 'bg-green-600 hover:bg-green-700',
  '#f4b400': 'bg-yellow-500 hover:bg-yellow-600',
  '#db4437': 'bg-red-500 hover:bg-red-600',
  '#9c27b0': 'bg-purple-600 hover:bg-purple-700',
  '#00bcd4': 'bg-cyan-500 hover:bg-cyan-600',
  '#ff5722': 'bg-orange-600 hover:bg-orange-700',
  '#607d8b': 'bg-slate-500 hover:bg-slate-600',
};

export default function EventCard({ event, onClick, compact = false }: Props) {
  const bg = COLOR_MAP[event.color] || 'bg-blue-500 hover:bg-blue-600';
  const start = parseUTCtoLocal(event.startTime);

  return (
    <motion.button
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -2 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        ${bg} text-white rounded px-1.5 py-0.5 w-full text-left
        truncate cursor-pointer transition-colors mb-0.5
        ${compact ? 'text-[11px]' : 'text-xs'}
      `}
    >
      {/* All-day events show just title */}
      {event.allDay ? (
        <span className="font-medium">{event.title}</span>
      ) : (
        <span className="flex items-center gap-1 min-w-0">
          {!compact && (
            <span className="opacity-80 flex-shrink-0">
              {format(start, 'h:mm a')}
            </span>
          )}
          <span className="font-medium truncate">{event.title}</span>
        </span>
      )}
    </motion.button>
  );
}