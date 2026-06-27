import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Search, Menu, X, Camera, Plus, LogOut } from 'lucide-react';
import { format } from '../../utils/dateUtils';
import { useCalendar } from '../../context/CalendarContext';
import { useAuth } from '../../context/AuthContext';
import MiniCalendar from './MiniCalendar';
import type { ViewType } from '../../types';

export default function CalendarHeader() {
  const { view, setView, currentDate, navigate, toggleSidebar, isSidebarOpen } = useCalendar();
  const { user, logout } = useAuth();
  const [showMiniCalDropdown, setShowMiniCalDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const getTitle = () => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') return format(currentDate, 'MMMM yyyy');
    return format(currentDate, 'EEEE, MMMM d, yyyy');
  };

  // Close mini cal dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowMiniCalDropdown(false);
      }
    };
    if (showMiniCalDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMiniCalDropdown]);

  // Close profile popup on click outside
  useEffect(() => {
    const handleClickOutsideProfile = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutsideProfile);
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideProfile);
  }, [showProfileMenu]);

  const firstName = user?.name?.split(' ')[0] || user?.name || 'User';

  return (
    <header className="flex items-center justify-between px-3 h-16 border-b border-[#e8eaed] bg-white sticky top-0 z-30 select-none">
      {/* Left: Hamburger menu icon, Google Calendar wordmark + icon */}
      <div className="flex items-center gap-2 min-w-[230px]">
        <button
          onClick={toggleSidebar}
          aria-label="Main menu"
          className="p-3 rounded-md text-[#5f6368] hover:text-[#3c4043] transition-colors focus:outline-none"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 cursor-pointer pl-1">
          {/* Dynamic Google Calendar Logo Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#4285f4] to-[#1a73e8] shadow-xs flex flex-col items-center justify-between overflow-hidden p-[2px] relative flex-shrink-0 select-none">
            <div className="w-full h-[11px] bg-[#aecbfa]/40 rounded-t-lg" />
            <div className="flex-1 flex items-center justify-center -mt-1">
              <span className="text-[19px] font-bold text-white leading-none font-sans tracking-tighter">
                {new Date().getDate()}
              </span>
            </div>
          </div>
          <span className="text-[22px] font-normal text-[#444746] tracking-normal hidden sm:inline-block font-sans">
            Calendar
          </span>
        </div>
      </div>

      {/* Center-left: "Today" button + chevron arrows + month/year title dropdown */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 pl-2 sm:pl-6">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('today')}
          aria-label="Jump to Today"
          className="px-4 py-1.5 text-sm font-medium text-[#3c4043] border border-[#dadce0] rounded-full hover:bg-[rgba(60,64,67,0.04)] active:bg-[rgba(60,64,67,0.1)] transition-colors mr-2 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
        >
          Today
        </motion.button>
        <div className="flex items-center">
          <button
            onClick={() => navigate('prev')}
            aria-label="Previous period"
            className="p-2 rounded-full hover:bg-[rgba(60,64,67,0.08)] text-[#5f6368] transition-colors focus:outline-none"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigate('next')}
            aria-label="Next period"
            className="p-2 rounded-full hover:bg-[rgba(60,64,67,0.08)] text-[#5f6368] transition-colors focus:outline-none"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dynamic Title / Dropdown container */}
        <div className="relative ml-2" ref={dropdownRef}>
          {!isSidebarOpen ? (
            <button
              onClick={() => setShowMiniCalDropdown(!showMiniCalDropdown)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[rgba(60,64,67,0.08)] transition-colors text-left focus:outline-none"
              aria-label="Toggle mini calendar popup"
            >
              <h1 className="text-[22px] font-normal text-[#3c4043] tracking-normal font-sans">
                {getTitle()}
              </h1>
              <ChevronDown size={20} className={`text-[#5f6368] transition-transform ${showMiniCalDropdown ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <h1 className="text-[22px] font-normal text-[#3c4043] tracking-normal truncate font-sans">
              {getTitle()}
            </h1>
          )}

          {/* Floating MiniCalendar popover */}
          <AnimatePresence>
            {!isSidebarOpen && showMiniCalDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-full left-0 mt-2 bg-[#f6f8fc] rounded-2xl shadow-xl border border-[#dadce0] p-2 z-50 min-w-[260px]"
              >
                <MiniCalendar />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Search, Apps, View switcher, Avatar */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          aria-label="Search"
          className="p-2.5 rounded-full hover:bg-[rgba(60,64,67,0.08)] text-[#5f6368] transition-colors focus:outline-none"
        >
          <Search size={20} />
        </button>

        {/* Segmented View Switcher */}
        <div className="flex border border-[#dadce0] rounded-lg p-0.5 bg-[#f6f8fc] ml-1 mr-2">
          {(['day', 'week', 'month'] as ViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={`Switch to ${v} view`}
              className={`px-3 py-1 text-sm font-medium capitalize rounded-md transition-all focus:outline-none ${
                view === v
                  ? 'bg-white text-[#1a73e8] shadow-xs'
                  : 'text-[#5f6368] hover:bg-[rgba(60,64,67,0.08)]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Profile Avatar & Interactive Popover */}
        <div className="relative group ml-1" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label={`User profile for ${user?.name}`}
            className="w-8 h-8 rounded-full bg-[#0288d1] hover:bg-[#0277bd] text-white text-sm font-medium flex items-center justify-center focus:outline-none transition-all shadow-xs"
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </button>

          {/* Hover Tooltip (Shown when menu is not open) */}
          {!showProfileMenu && (
            <div className="absolute top-full right-0 mt-1.5 hidden group-hover:flex flex-col bg-[#3c4043] text-white px-3 py-2 rounded-lg shadow-xl text-xs z-40 whitespace-nowrap pointer-events-none font-sans leading-snug min-w-[190px] border border-white/10">
              <span className="text-[#bdc1c6] text-[11px] font-medium">Google Account</span>
              <span className="font-medium text-white text-xs mt-0.5">{user?.name || 'User'}</span>
              <span className="text-[#bdc1c6] text-[11px]">{user?.email || ''}</span>
            </div>
          )}

          {/* Google Account Click Popup Card */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-full right-0 mt-2 bg-[#e9eef6] text-[#1f1f1f] rounded-[28px] shadow-2xl border border-[#dadce0]/80 p-6 z-50 w-[360px] font-sans flex flex-col items-center select-none"
              >
                {/* Top Bar with Email & Close button */}
                <div className="w-full flex items-center justify-between relative mb-2">
                  <span className="text-xs font-medium text-[#444746] w-full text-center truncate pr-6 pl-6">
                    {user?.email || 'user@gmail.com'}
                  </span>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    aria-label="Close menu"
                    className="p-1.5 rounded-full hover:bg-[rgba(0,0,0,0.06)] text-[#444746] transition-colors absolute right-0 top-1/2 -translate-y-1/2 focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Avatar with Camera Overlay */}
                <div className="relative mt-2 mb-3">
                  <div className="w-20 h-20 rounded-full bg-[#0288d1] text-white text-3xl font-normal flex items-center justify-center shadow-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <button
                    aria-label="Change profile photo"
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-[#dadce0] flex items-center justify-center text-[#444746] hover:bg-gray-100 shadow-xs focus:outline-none transition-colors"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* Greeting & Manage Account Pill */}
                <h2 className="text-xl font-normal text-[#1f1f1f] mb-3 font-sans">
                  Hi, {firstName}!
                </h2>
                <button className="px-5 py-2 rounded-full border border-[#72777d] text-sm font-medium text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] transition-colors mb-6 focus:outline-none">
                  Manage your Google Account
                </button>

                {/* Action Pill Cards (Add Account & Sign Out) */}
                <div className="grid grid-cols-2 gap-3 w-full mb-5">
                  <div className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-2xs cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#0b57d0] flex-shrink-0">
                      <Plus size={20} />
                    </div>
                    <span className="text-xs font-medium text-[#1f1f1f]">Add account</span>
                  </div>
                  <div
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-2xs cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#444746] flex-shrink-0">
                      <LogOut size={18} />
                    </div>
                    <span className="text-xs font-medium text-[#1f1f1f]">Sign out</span>
                  </div>
                </div>

                {/* Footer text */}
                <div className="flex items-center justify-center gap-2 text-[11px] text-[#444746] font-medium">
                  <span className="cursor-pointer hover:underline">Privacy Policy</span>
                  <span>•</span>
                  <span className="cursor-pointer hover:underline">Terms of Service</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}