import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format, getMonthGrid, addMonths, isSameDay, isToday, isSameMonth,
} from '../../utils/dateUtils';
import { useCalendar } from '../../context/CalendarContext';

export default function MiniCalendar() {
  const { currentDate, setCurrentDate, setView } = useCalendar();
  const [miniDate, setMiniDate] = useState(new Date());

  const weeks = getMonthGrid(miniDate);
  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleDayClick = (day: Date) => {
    setCurrentDate(day);
    setView('day');
  };

  return (
    <div className="px-4 py-3 select-none">
      <div className="flex items-center justify-between mb-3 pl-1 pr-1">
        <span className="text-sm font-medium text-[#3c4043] tracking-normal font-sans">
          {format(miniDate, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setMiniDate((d) => addMonths(d, -1))}
            aria-label="Previous month in mini calendar"
            className="p-1.5 rounded-full hover:bg-[rgba(60,64,67,0.08)] text-[#5f6368] transition-colors focus:outline-none"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setMiniDate((d) => addMonths(d, 1))}
            aria-label="Next month in mini calendar"
            className="p-1.5 rounded-full hover:bg-[rgba(60,64,67,0.08)] text-[#5f6368] transition-colors focus:outline-none"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-[11px] text-[#70757a] font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks grid */}
      <div className="space-y-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const selected = isSameDay(day, currentDate);
              const today = isToday(day);
              const inMonth = isSameMonth(day, miniDate);

              let buttonStyle = 'text-[#3c4043] hover:bg-[rgba(60,64,67,0.08)]';
              if (!inMonth) {
                buttonStyle = 'text-[#bdc1c6]';
              }
              if (selected && !today) {
                buttonStyle = 'bg-[#c2e7ff] text-[#001d35] font-medium';
              }
              if (today) {
                buttonStyle = 'bg-[#1a73e8] text-white font-medium shadow-xs';
              }

              return (
                <button
                  key={di}
                  onClick={() => handleDayClick(day)}
                  aria-label={format(day, 'EEEE, MMMM d, yyyy')}
                  className={`
                    text-[12px] w-6 h-6 mx-auto flex items-center justify-center rounded-full
                    transition-all focus:outline-none focus:ring-2 focus:ring-[#1a73e8]
                    ${buttonStyle}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}