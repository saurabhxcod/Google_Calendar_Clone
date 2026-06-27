import React from 'react';
import { useCalendarVisibilityContext } from '../../context/CalendarVisibilityContext';
import { CalendarSection } from './CalendarSection';

export const CalendarFilterList: React.FC = () => {
  const {
    calendars,
    myCalendarsOpen,
    setMyCalendarsOpen,
    otherCalendarsOpen,
    setOtherCalendarsOpen,
  } = useCalendarVisibilityContext();

  const myCalendars = calendars.filter((cal) => cal.section === 'my');
  const otherCalendars = calendars.filter((cal) => cal.section === 'other');

  return (
    <div className="flex flex-col">
      <CalendarSection
        title="My calendars"
        calendars={myCalendars}
        isOpen={myCalendarsOpen}
        onToggle={() => setMyCalendarsOpen((prev) => !prev)}
      />
      <CalendarSection
        title="Other calendars"
        calendars={otherCalendars}
        isOpen={otherCalendarsOpen}
        onToggle={() => setOtherCalendarsOpen((prev) => !prev)}
      />
    </div>
  );
};
