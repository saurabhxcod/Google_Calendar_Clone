import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../../types/search';
import { SearchResultItem } from './SearchResultItem';

interface SearchDropdownProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  selectedIndex: number;
  onSelect: (result: SearchResult) => void;
  onHover: (index: number) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  query,
  isLoading,
  error,
  isOpen,
  selectedIndex,
  onSelect,
  onHover,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-[480px] bg-white rounded-xl shadow-2xl border border-[#dadce0] z-50 max-h-96 overflow-y-auto font-sans select-none"
      >
        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Searching...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 text-center py-6 px-4">{error}</div>
        ) : results.length === 0 && query.trim() !== '' ? (
          <div className="py-8 flex flex-col items-center justify-center gap-1">
            <Search size={32} className="text-gray-300 mb-1" />
            <span className="text-sm text-gray-500 font-medium">No matching events</span>
            <span className="text-xs text-gray-400 italic">"{query}"</span>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="text-[11px] text-gray-500 px-4 py-2 uppercase tracking-wider font-semibold border-b border-gray-100 bg-gray-50/50">
              Events
            </div>
            <div className="divide-y divide-gray-50">
              {results.map((result, idx) => (
                <SearchResultItem
                  key={result.id}
                  result={result}
                  query={query}
                  isSelected={selectedIndex === idx}
                  onSelect={onSelect}
                  onHover={onHover}
                  index={idx}
                />
              ))}
            </div>
            {results.length >= 20 && (
              <div
                onClick={() => navigate(`/search?q=${encodeURIComponent(query.trim())}`)}
                className="text-xs text-[#1a73e8] hover:underline text-center py-2.5 cursor-pointer font-medium border-t border-gray-100 bg-gray-50/30 transition-colors"
              >
                Search for '{query}' in all events →
              </div>
            )}
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
};
