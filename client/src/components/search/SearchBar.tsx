import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendar } from '../../context/CalendarContext';
import { useEventSearch } from '../../hooks/useEventSearch';
import { SearchDropdown } from './SearchDropdown';
import type { SearchResult } from '../../types/search';

export const SearchBar: React.FC = () => {
  const {
    query,
    setQuery,
    results,
    isLoading,
    error,
    isOpen,
    selectedIndex,
    setSelectedIndex,
    clearSearch,
    handleKeyDown,
    closeDropdown,
  } = useEventSearch();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setCurrentDate, setView } = useCalendar();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [closeDropdown]);

  const handleSelect = (result: SearchResult) => {
    const date = new Date(result.startTime);
    setCurrentDate(date);
    setView('day');
    clearSearch();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      {/* Input wrapper */}
      <div className="flex items-center gap-2.5 bg-[#f1f3f4] hover:bg-[#e8eaed] focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-[#1a73e8] rounded-full px-4 py-2 transition-all duration-200 text-[#3c4043]">
        <Search size={18} className="text-[#5f6368] flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-sm text-[#1f1f1f] placeholder-[#5f6368] font-sans"
          aria-label="Search events"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          role="combobox"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1 }}
              onClick={clearSearch}
              className="p-1 rounded-full hover:bg-gray-200/80 text-[#5f6368] transition-colors focus:outline-none flex-shrink-0"
              aria-label="Clear search"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <SearchDropdown
            results={results}
            query={query}
            isLoading={isLoading}
            error={error}
            isOpen={isOpen}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            onHover={setSelectedIndex}
          />
        </div>
      )}
    </div>
  );
};
