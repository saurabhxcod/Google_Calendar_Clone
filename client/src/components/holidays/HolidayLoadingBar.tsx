import React from 'react';
import { motion } from 'framer-motion';
import { useHolidayContext } from '../../context/HolidayContext';

export const HolidayLoadingBar: React.FC = () => {
  const { isLoading } = useHolidayContext();

  if (!isLoading) return null;

  return (
    <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent z-50 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
        className="h-full bg-[#0F9D58] shadow-xs"
      />
    </div>
  );
};
