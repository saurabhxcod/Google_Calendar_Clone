import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import type { SearchResult } from '../../types/search';
import { HighlightMatch } from './HighlightMatch';
import { format, parseISO } from '../../utils/dateUtils';

interface SearchResultCardProps {
  result: SearchResult;
  query: string;
  onClick: (result: SearchResult) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = React.memo(({ result, query, onClick }) => {
  const startDate = parseISO(result.startTime);
  const formattedDate = format(startDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = !result.allDay ? ` · ${format(startDate, 'h:mm a')}` : ' · All day';

  const truncatedDesc = result.description
    ? result.description.length > 150
      ? result.description.substring(0, 150) + '...'
      : result.description
    : '';

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.998 }}
      onClick={() => onClick(result)}
      className="bg-white rounded-xl border border-[#dadce0] p-4 hover:shadow-md transition-all cursor-pointer flex gap-4 relative select-none font-sans text-gray-800"
    >
      {/* Left colored bar */}
      <div
        className="w-1.5 self-stretch rounded-full flex-shrink-0"
        style={{ backgroundColor: result.color || '#4285f4' }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-800 leading-snug truncate">
          <HighlightMatch text={result.title} query={query} />
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-[#5f6368] mt-1">
          <CalendarIcon size={14} className="flex-shrink-0 text-[#5f6368]" />
          <span>
            {formattedDate}
            {formattedTime}
          </span>
        </div>

        {result.location && (
          <div className="flex items-center gap-1.5 text-sm text-[#5f6368] mt-1">
            <MapPin size={14} className="flex-shrink-0 text-[#5f6368]" />
            <span className="truncate">
              <HighlightMatch text={result.location} query={query} />
            </span>
          </div>
        )}

        {truncatedDesc && (
          <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
            <HighlightMatch text={truncatedDesc} query={query} />
          </div>
        )}
      </div>
    </motion.div>
  );
});

SearchResultCard.displayName = 'SearchResultCard';
