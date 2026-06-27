
import { motion } from 'framer-motion';
import MiniCalendar from './Calendar/MiniCalendar';
import { CalendarFilterList } from './sidebar/CalendarFilterList';
import { useCalendar } from '../context/CalendarContext';

export default function Sidebar() {
  const { openCreate, isSidebarOpen } = useCalendar();

  if (!isSidebarOpen) {
    return (
      <aside className="w-16 flex-shrink-0 flex flex-col items-center py-4 bg-[#f6f8fc] border-r border-transparent select-none transition-all duration-200">
        <button
          onClick={() => openCreate()}
          aria-label="Create event"
          className="w-12 h-12 rounded-2xl bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
          title="Create"
        >
          <svg className="w-6 h-6" viewBox="0 0 36 36">
            <path fill="#EA4335" d="M16 6h4v10h-4z" />
            <path fill="#4285F4" d="M16 20h4v10h-4z" />
            <path fill="#FBBC05" d="M6 16h10v4H6z" />
            <path fill="#34A853" d="M20 16h10v4H20z" />
            <path fill="#4285F4" d="M16 16h4v4h-4z" />
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-[256px] flex-shrink-0 flex flex-col bg-[#f6f8fc] select-none transition-all duration-200 overflow-y-auto overflow-x-hidden pr-2 pb-4 relative">
      {/* Floating "Create" button */}
      <div className="p-4 pl-4 pt-3 pb-2">
        <motion.button
          whileHover={{ scale: 1.01, boxShadow: '0 4px 8px rgba(60,64,67,0.15)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openCreate()}
          aria-label="Create event"
          className="flex items-center gap-3 pl-3.5 pr-6 py-3 rounded-full shadow-md bg-white border border-[#dadce0]/60 hover:bg-[#f8f9fa] transition-all text-[#3c4043] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
        >
          {/* Authentic Google Multi-color Plus */}
          <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 36 36">
            <path fill="#EA4335" d="M16 6h4v10h-4z" />
            <path fill="#4285F4" d="M16 20h4v10h-4z" />
            <path fill="#FBBC05" d="M6 16h10v4H6z" />
            <path fill="#34A853" d="M20 16h10v4H20z" />
            <path fill="#4285F4" d="M16 16h4v4h-4z" />
          </svg>
          <span className="text-sm font-medium tracking-wide text-[#3c4043] font-sans">
            Create
          </span>
        </motion.button>
      </div>

      {/* Mini calendar */}
      <MiniCalendar />

      {/* Calendar Visibility Filter List */}
      <CalendarFilterList />
    </aside>
  );
}