import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { useHolidayContext } from '../context/HolidayContext';
import { searchEvents } from '../services/searchService';
import type { SearchResult } from '../types/search';
import { SearchResultCard } from '../components/search/SearchResultCard';
import CalendarHeader from '../components/Calendar/CalendarHeader';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const navigate = useNavigate();
  const { setCurrentDate, setView, events, setActivePopoverEvent } = useCalendar();
  const { holidays, setActiveHolidayModal } = useHolidayContext();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    searchEvents(q)
      .then((data) => {
        const term = q.trim().toLowerCase();
        const matchingHolidays: SearchResult[] = holidays
          .filter(
            (h) =>
              h.title.toLowerCase().includes(term) ||
              (h.description && h.description.toLowerCase().includes(term))
          )
          .map((h) => ({
            id: h.id,
            title: h.title,
            description: h.description,
            startTime: h.startTime,
            endTime: h.endTime,
            location: 'India',
            color: h.color || '#0F9D58',
            allDay: true,
            calendarId: 'holidays',
            isHoliday: true,
            type: h.type,
          }));

        setResults([...data, ...matchingHolidays]);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Search failed');
        setIsLoading(false);
      });
  }, [q, holidays]);

  const handleCardClick = (result: SearchResult) => {
    const date = new Date(result.startTime);
    setCurrentDate(date);
    setView('day');
    navigate('/');

    if (result.isHoliday) {
      const holidayEvent = holidays.find((h) => h.id === result.id) || {
        id: result.id,
        title: result.title,
        description: result.description,
        startTime: result.startTime,
        endTime: result.endTime,
        allDay: true,
        color: '#0F9D58',
        calendarId: 'holidays',
        type: result.type || ['Holiday'],
        isHoliday: true,
      };
      setTimeout(() => {
        setActiveHolidayModal(holidayEvent as any);
      }, 100);
      return;
    }

    const existing = events.find((e) => e._id === result.id);
    const popoverEvent = existing || {
      _id: result.id,
      userId: '',
      calendarId: result.calendarId || 'primary',
      title: result.title,
      description: result.description,
      startTime: result.startTime,
      endTime: result.endTime,
      allDay: result.allDay,
      color: (result.color as any) || '#039be5',
      location: result.location,
      recurrence: 'none',
      isException: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setActivePopoverEvent(popoverEvent as any);
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f6f8fc] overflow-hidden select-none font-sans">
      <CalendarHeader />
      <div className="flex-1 overflow-y-auto bg-white rounded-tl-2xl border-l border-t border-[#dadce0] shadow-sm p-6 max-w-5xl mx-auto w-full my-0">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 text-[#5f6368] transition-colors focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
              Search results for "{q}"
            </h1>
            <p className="text-sm text-[#5f6368] mt-0.5">
              {!isLoading && !error && `${results.length} event${results.length === 1 ? '' : 's'} found`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500 font-medium">Searching events...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-500 text-base">{error}</div>
        ) : results.length === 0 && q.trim() !== '' ? (
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
              <SearchIcon size={32} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              No events found for "{q}"
            </h2>
            <p className="text-sm text-[#5f6368] leading-relaxed">
              Try searching with different keywords like title, description, or location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 pb-10">
            {results.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                query={q}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
