import React from 'react';
import { motion } from 'framer-motion';
import type { SearchResult } from '../../types/search';
import { HighlightMatch } from './HighlightMatch';
import { format, parseISO } from '../../utils/dateUtils';

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  isSelected: boolean;
  onSelect: (result: SearchResult) => void;
  onHover: (index: number) => void;
  index: number;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = React.memo(
  ({ result, query, isSelected, onSelect, onHover, index }) => {
    const startDate = parseISO(result.startTime);
    const formattedDate = format(startDate, 'EEE, MMM d');
    const formattedTime = !result.allDay ? ` · ${format(startDate, 'h:mm a')}` : '';
    const truncatedLocation = result.location
      ? ` · ${result.location.length > 30 ? result.location.substring(0, 30) + '...' : result.location}`
      : '';

    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, delay: Math.min(index * 0.03, 0.3) }}
        onClick={(e) => {
          e.preventDefault();
          onSelect(result);
        }}
        onMouseEnter={() => onHover(index)}
        className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors cursor-pointer select-none ${
          isSelected ? 'bg-blue-50/80' : 'hover:bg-gray-50'
        }`}
      >
        <span
          className="w-3 h-3 rounded-full flex-shrink-0 mt-1 shadow-2xs"
          style={{ backgroundColor: result.color || '#4285f4' }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-800 truncate leading-snug">
            <HighlightMatch text={result.title} query={query} />
          </div>
          <div className="text-xs text-gray-500 truncate mt-0.5">
            {formattedDate}
            {formattedTime}
            {truncatedLocation}
          </div>
        </div>
      </motion.button>
    );
  }
);

SearchResultItem.displayName = 'SearchResultItem';
