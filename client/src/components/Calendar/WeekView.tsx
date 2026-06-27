import { useRef, useState, useEffect } from 'react';
import {
  format, getWeekDays, isToday, isSameDay, parseUTCtoLocal,
  startOfDay, endOfDay,
} from '../../utils/dateUtils';
import { useCalendar } from '../../context/CalendarContext';
import EventPopover from '../Event/EventPopover';
import type { CalendarEvent } from '../../types';
import { useHolidayContext } from '../../context/HolidayContext';
import { filterHolidaysByDateRange } from '../../utils/holidayUtils';
import { HolidayChip } from '../holidays/HolidayChip';
import { useCalendarVisibilityContext } from '../../context/CalendarVisibilityContext';

const HOUR_HEIGHT = 48;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function EventBlock({ event, onClick }: { event: CalendarEvent; onClick: (e: React.MouseEvent) => void }) {
  const start = parseUTCtoLocal(event.startTime);
  const end = parseUTCtoLocal(event.endTime);

  // Recalculate top and height for 48px HOUR_HEIGHT
  const startHours = start.getHours() + start.getMinutes() / 60;
  const endHours = end.getHours() + end.getMinutes() / 60;
  const durationHours = Math.max(endHours - startHours, 0.25);

  const top = startHours * HOUR_HEIGHT;
  const height = durationHours * HOUR_HEIGHT;
  const hexColor = event.color || '#039be5';

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: `${top}px`,
        height: `${height}px`,
        left: '3px', right: '3px',
        backgroundColor: hexColor,
        borderRadius: '8px',
        cursor: 'pointer',
        zIndex: 10,
      }}
      className="text-white text-[12px] p-1.5 overflow-hidden hover:shadow-md hover:brightness-95 transition-all select-none shadow-2xs border border-white/20"
    >
      <div className="font-medium truncate leading-snug">{event.title}</div>
      {height >= 36 && (
        <div className="opacity-90 text-[10px] truncate">
          {format(start, 'h:mm a')} – {format(end, 'h:mm a')}
        </div>
      )}
    </div>
  );
}

export default function WeekView() {
  const { currentDate, visibleEvents: events, openCreate } = useCalendar();
  const { holidays } = useHolidayContext();
  const { isVisible } = useCalendarVisibilityContext();
  const days = getWeekDays(currentDate);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [popoverState, setPopoverState] = useState<{
    event: CalendarEvent | null;
    anchorRect: DOMRect | null;
  }>({ event: null, anchorRect: null });

  const [nowTop, setNowTop] = useState<number | null>(null);

  useEffect(() => {
    const updateNow = () => {
      const now = new Date();
      const hours = now.getHours() + now.getMinutes() / 60;
      setNowTop(hours * HOUR_HEIGHT);
    };
    updateNow();
    const interval = setInterval(updateNow, 60000);
    return () => clearInterval(interval);
  }, []);

  const getEventsForDay = (day: Date): CalendarEvent[] =>
    events.filter((e) =>
      !e.allDay && isSameDay(parseUTCtoLocal(e.startTime), day)
    );

  const getAllDayEvents = (day: Date): CalendarEvent[] =>
    events.filter((e) =>
      e.allDay && isSameDay(parseUTCtoLocal(e.startTime), day)
    );

  const handleColumnClick = (e: React.MouseEvent, day: Date) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top + (scrollRef.current?.scrollTop || 0);
    const hour = Math.floor(y / HOUR_HEIGHT);
    openCreate(day, hour);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopoverState({ event, anchorRect: rect });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white select-none relative">
      {/* Day headers */}
      <div
        className="grid border-b border-[#dadce0] bg-white sticky top-0 z-20"
        style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}
      >
        <div className="border-r border-[#dadce0]" /> {/* time gutter */}
        {days.map((day, i) => {
          const today = isToday(day);
          return (
            <div
              key={i}
              className={`py-2 text-center border-r border-[#dadce0] last:border-r-0 ${
                today ? 'bg-[#1a73e8]/[0.04]' : ''
              }`}
            >
              <div className={`text-[11px] font-medium uppercase tracking-wider ${today ? 'text-[#1a73e8]' : 'text-[#70757a]'}`}>
                {format(day, 'EEE')}
              </div>
              <div className={`
                text-xl font-normal w-10 h-10 mx-auto flex items-center justify-center rounded-full mt-0.5 font-sans
                ${today ? 'bg-[#1a73e8] text-white font-medium shadow-xs' : 'text-[#3c4043]'}
              `}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day row */}
      <div
        className="grid border-b border-[#dadce0] bg-white z-10"
        style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}
      >
        <div className="text-[11px] font-medium text-right pr-3 py-1.5 text-[#70757a] border-r border-[#dadce0] self-center">
          all-day
        </div>
        {days.map((day, i) => (
          <div key={i} className="border-r border-[#dadce0] last:border-r-0 p-1 min-h-[28px]">
            {getAllDayEvents(day).map((e) => (
              <div
                key={e._id}
                onClick={(ev) => handleEventClick(ev, e)}
                style={{ backgroundColor: e.color || '#039be5' }}
                className="text-white text-[12px] font-medium rounded-md px-2 py-0.5 truncate cursor-pointer mb-1 shadow-2xs hover:brightness-95 transition-all"
              >
                {e.title}
              </div>
            ))}
            {isVisible('holidays') && filterHolidaysByDateRange(
              holidays,
              startOfDay(day),
              endOfDay(day)
            ).map(holiday => (
              <HolidayChip key={holiday.id} holiday={holiday} compact={true} />
            ))}
          </div>
        ))}
      </div>

      {/* Time grid (scrollable) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="grid relative" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
          {/* Time labels column */}
          <div className="relative border-r border-[#dadce0]">
            {HOURS.map((h) => (
              <div
                key={h}
                style={{ height: `${HOUR_HEIGHT}px` }}
                className="relative border-b border-[#e8eaed] last:border-b-0"
              >
                {h > 0 && (
                  <span className="absolute -top-2.5 right-2 text-[10px] font-medium text-[#70757a]">
                    {h === 12 ? '12 PM' : h < 12 ? `${h} AM` : `${h - 12} PM`}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, di) => {
            const today = isToday(day);
            return (
              <div
                key={di}
                className={`relative border-r border-[#dadce0] last:border-r-0 cursor-pointer ${
                  today ? 'bg-[#1a73e8]/[0.03]' : ''
                }`}
                style={{ height: `${HOUR_HEIGHT * 24}px` }}
                onClick={(e) => handleColumnClick(e, day)}
              >
                {/* Hour gridlines */}
                {HOURS.map((h) => (
                  <div
                    key={h}
                    style={{ top: `${h * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                    className="absolute inset-x-0 border-b border-[#e8eaed]"
                  />
                ))}

                {/* Live "Now" indicator */}
                {today && nowTop !== null && (
                  <div
                    style={{ top: `${nowTop}px` }}
                    className="absolute inset-x-0 h-[2px] bg-[#ea4335] z-20 pointer-events-none"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ea4335] absolute -left-1.25 -top-1" />
                  </div>
                )}

                {/* Timed Events */}
                {getEventsForDay(day).map((event) => (
                  <EventBlock
                    key={event._id}
                    event={event}
                    onClick={(ev) => handleEventClick(ev, event)}
                  />
                ))}
              </div>
            );
          })}
        </div>
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