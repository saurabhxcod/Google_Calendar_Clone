
import { useState } from 'react';
import { format, getMonthGrid, isSameDay, isToday, isSameMonth, parseUTCtoLocal } from '../../utils/dateUtils';
import { useCalendar } from '../../context/CalendarContext';
import EventPopover from '../Event/EventPopover';
import type { CalendarEvent } from '../../types';

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function EventChip({ event, onClick }: { event: CalendarEvent; onClick: (e: React.MouseEvent) => void }) {
  const hexColor = event.color || '#039be5';

  if (event.allDay) {
    return (
      <div
        onClick={onClick}
        style={{ backgroundColor: hexColor }}
        className="text-white text-[12px] font-medium rounded-md px-2 py-0.5 mb-1 truncate cursor-pointer hover:brightness-95 transition-all shadow-2xs select-none"
      >
        {event.title}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: hexColor }}
      className="text-white text-[12px] font-medium rounded-md px-2 py-0.5 mb-1 truncate cursor-pointer hover:brightness-95 transition-all shadow-2xs flex items-center gap-1.5 select-none"
    >
      <span className="opacity-90 text-[11px] font-normal flex-shrink-0">
        {format(parseUTCtoLocal(event.startTime), 'h:mm a')}
      </span>
      <span className="truncate font-medium">{event.title}</span>
    </div>
  );
}

export default function MonthView() {
  const { currentDate, visibleEvents: events, openCreate } = useCalendar();
  const weeks = getMonthGrid(currentDate);

  const [popoverState, setPopoverState] = useState<{
    event: CalendarEvent | null;
    anchorRect: DOMRect | null;
  }>({ event: null, anchorRect: null });

  const getEventsForDay = (day: Date) =>
    events
      .filter((e) => isSameDay(parseUTCtoLocal(e.startTime), day))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopoverState({ event, anchorRect: rect });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white select-none relative">
      {/* Day labels header */}
      <div className="grid grid-cols-7 border-b border-[#dadce0] bg-white">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-medium text-[#70757a] tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks grid */}
      <div className="flex-1 grid" style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-[#dadce0] last:border-b-0">
            {week.map((day, di) => {
              const dayEvents = getEventsForDay(day);
              const visible = dayEvents.slice(0, 3);
              const overflow = dayEvents.length - 3;
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);

              return (
                <div
                  key={di}
                  onClick={() => openCreate(day)}
                  className={`
                    border-r border-[#dadce0] last:border-r-0 p-1 min-h-[90px] cursor-pointer
                    hover:bg-[rgba(60,64,67,0.04)] transition-colors relative flex flex-col justify-start
                    ${!inMonth ? 'bg-[#f8f9fa]/60' : 'bg-white'}
                  `}
                >
                  {/* Date number */}
                  <div className="flex justify-center mb-1.5 pt-0.5">
                    <span className={`
                      text-[12px] w-6 h-6 flex items-center justify-center rounded-full font-sans
                      ${today ? 'bg-[#1a73e8] text-white font-medium shadow-xs' : ''}
                      ${!inMonth ? 'text-[#70757a]/60' : !today ? 'text-[#3c4043] font-medium' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Events stack */}
                  <div className="flex-1 overflow-hidden">
                    {visible.map((event) => (
                      <EventChip
                        key={event._id}
                        event={event}
                        onClick={(e) => handleEventClick(e, event)}
                      />
                    ))}
                  </div>

                  {/* Overflow button */}
                  {overflow > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreate(day);
                      }}
                      className="text-[11px] font-medium text-[#5f6368] hover:bg-[rgba(60,64,67,0.08)] rounded px-1.5 py-0.5 self-start transition-colors"
                    >
                      +{overflow} more
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Interactive Floating Popover */}
      <EventPopover
        event={popoverState.event}
        anchorRect={popoverState.anchorRect}
        onClose={() => setPopoverState({ event: null, anchorRect: null })}
      />
    </div>
  );
}