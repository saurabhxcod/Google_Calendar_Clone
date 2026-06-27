import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import {
  format, isToday, isSameDay, parseUTCtoLocal, startOfDay, endOfDay,
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

export default function DayView() {
  const { currentDate, visibleEvents: events, openCreate } = useCalendar();
  const { holidays } = useHolidayContext();
  const { isVisible } = useCalendarVisibilityContext();
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

  const dayEvents = events.filter(
    (e) => !e.allDay && isSameDay(parseUTCtoLocal(e.startTime), currentDate)
  );

  const allDayEvents = events.filter(
    (e) => e.allDay && isSameDay(parseUTCtoLocal(e.startTime), currentDate)
  );

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top + (scrollRef.current?.scrollTop || 0);
    const hour = Math.floor(y / HOUR_HEIGHT);
    openCreate(currentDate, hour);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopoverState({ event, anchorRect: rect });
  };

  const today = isToday(currentDate);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white select-none relative">
      {/* Header */}
      <div className="flex items-center border-b border-[#dadce0] py-3 px-4 bg-white sticky top-0 z-20">
        <div className="w-[60px]" />
        <div className="text-left pl-4">
          <div className={`text-[11px] font-medium uppercase tracking-wider ${today ? 'text-[#1a73e8]' : 'text-[#70757a]'}`}>
            {format(currentDate, 'EEEE')}
          </div>
          <div className={`
            text-2xl font-normal w-11 h-11 flex items-center justify-center rounded-full mt-0.5 font-sans
            ${today ? 'bg-[#1a73e8] text-white font-medium shadow-xs' : 'text-[#3c4043]'}
          `}>
            {format(currentDate, 'd')}
          </div>
        </div>
      </div>

      {/* All-day row if any */}
      {allDayEvents.length > 0 && (
        <div className="flex border-b border-[#dadce0] bg-white z-10">
          <div className="w-[60px] text-[11px] font-medium text-right pr-3 py-1.5 text-[#70757a] border-r border-[#dadce0]">
            all-day
          </div>
          <div className="flex-1 p-1.5 space-y-1">
            {allDayEvents.map((e) => (
              <div
                key={e._id}
                onClick={(ev) => handleEventClick(ev, e)}
                style={{ backgroundColor: e.color || '#039be5' }}
                className="text-white text-[12px] font-medium rounded-md px-2.5 py-1 truncate cursor-pointer shadow-2xs hover:brightness-95 transition-all"
              >
                {e.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Holiday banner */}
      {isVisible('holidays') && (() => {
        const dayHolidays = filterHolidaysByDateRange(
          holidays,
          startOfDay(currentDate),
          endOfDay(currentDate)
        );
        if (dayHolidays.length === 0) return null;
        return (
          <div className="px-4 py-1 border-b border-[#dadce0] bg-green-50">
            {dayHolidays.map(h => (
              <HolidayChip key={h.id} holiday={h} compact={false} />
            ))}
          </div>
        );
      })()}

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="flex relative">
          {/* Time gutter */}
          <div className="w-[60px] flex-shrink-0 border-r border-[#dadce0]">
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

          {/* Event column */}
          <div
            className={`flex-1 relative cursor-pointer ${today ? 'bg-[#1a73e8]/[0.02]' : ''}`}
            style={{ height: `${HOUR_HEIGHT * 24}px` }}
            onClick={handleClick}
          >
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

            {dayEvents.map((event) => {
              const start = parseUTCtoLocal(event.startTime);
              const end = parseUTCtoLocal(event.endTime);

              const startHours = start.getHours() + start.getMinutes() / 60;
              const endHours = end.getHours() + end.getMinutes() / 60;
              const durationHours = Math.max(endHours - startHours, 0.25);

              const top = startHours * HOUR_HEIGHT;
              const height = durationHours * HOUR_HEIGHT;

              return (
                <div
                  key={event._id}
                  onClick={(ev) => handleEventClick(ev, event)}
                  style={{
                    position: 'absolute',
                    top: `${top}px`,
                    height: `${height}px`,
                    left: '8px', right: '16px',
                    backgroundColor: event.color || '#039be5',
                  }}
                  className="rounded-lg text-white text-xs p-2.5 cursor-pointer hover:shadow-md hover:brightness-95 transition-all overflow-hidden z-10 shadow-2xs border border-white/20"
                >
                  <div className="font-medium text-sm leading-tight">{event.title}</div>
                  <div className="text-[11px] opacity-90 mt-0.5">
                    {format(start, 'h:mm a')} – {format(end, 'h:mm a')}
                  </div>
                  {event.location && (
                    <div className="text-[11px] opacity-90 mt-1 flex items-center gap-1">
                      <MapPin size={12} className="flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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