import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CalendarProvider } from './context/CalendarContext';
import { useCalendar } from './context/CalendarContext';
import CalendarHeader from './components/Calendar/CalendarHeader';
import Sidebar from './components/Sidebar';
import MonthView from './components/Calendar/MonthView';
import WeekView from './components/Calendar/WeekView';
import DayView from './components/Calendar/DayView';
import EventModal from './components/Event/EventModal';
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import SearchPage from './pages/SearchPage';

import { CalendarVisibilityProvider } from './context/CalendarVisibilityContext';
import { HolidayProvider } from './context/HolidayContext';
import { HolidayLoadingBar } from './components/holidays/HolidayLoadingBar';

import EventPopover from './components/Event/EventPopover';

function CalendarApp() {
  const { view, activePopoverEvent, setActivePopoverEvent } = useCalendar();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex flex-col h-screen bg-[#f6f8fc] overflow-hidden select-none">
            <CalendarHeader />
            <div className="flex flex-1 overflow-hidden relative">
              <Sidebar />
              <main className="flex-1 flex flex-col overflow-hidden bg-white rounded-tl-2xl border-l border-t border-[#dadce0] shadow-sm ml-0 my-0 mr-0 relative">
                <HolidayLoadingBar />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    {view === 'month' && <MonthView />}
                    {view === 'week' && <WeekView />}
                    {view === 'day' && <DayView />}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
            <EventModal />
            <EventPopover
              event={activePopoverEvent}
              onClose={() => setActivePopoverEvent(null)}
            />
          </div>
        }
      />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
}

function AuthGate() {
  const { user, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gcal-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return showRegister
      ? <RegisterModal onSwitch={() => setShowRegister(false)} />
      : <LoginModal onSwitch={() => setShowRegister(true)} />;
  }

  return (
    <HolidayProvider>
      <CalendarVisibilityProvider>
        <CalendarProvider>
          <CalendarApp />
        </CalendarProvider>
      </CalendarVisibilityProvider>
    </HolidayProvider>
  );
}

export default function App() {
  return (
    <AuthGate />
  );
}