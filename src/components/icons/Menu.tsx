'use client';

import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';

const lineVariants: Variants = {
  closed: {
    rotate: 0,
    y: 0,
    opacity: 1,
  },
  open: (custom: number) => ({
    rotate: custom === 1 ? 45 : custom === 3 ? -45 : 0,
    y: custom === 1 ? 6 : custom === 3 ? -6 : 0,
    opacity: custom === 2 ? 0 : 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  }),
};

interface MenuIconProps {
  isOpen: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const MenuIcon = ({ isOpen, onToggle }: MenuIconProps) => {
  const handleToggle = () => {
    const newState = !isOpen;
    onToggle?.(newState);
  };

  return (
    <div
      className="cursor-pointer select-none p-2 rounded-md transition-all duration-300
                 bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400 
                 hover:from-violet-700 hover:via-blue-600 hover:to-teal-500
                 text-white shadow-sm"
      onClick={handleToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.line
          x1="4"
          y1="6"
          x2="20"
          y2="6"
          variants={lineVariants}
          animate={isOpen ? 'open' : 'closed'}
          custom={1}
        />
        <motion.line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
          variants={lineVariants}
          animate={isOpen ? 'open' : 'closed'}
          custom={2}
        />
        <motion.line
          x1="4"
          y1="18"
          x2="20"
          y2="18"
          variants={lineVariants}
          animate={isOpen ? 'open' : 'closed'}
          custom={3}
        />
      </svg>
    </div>
  );
};

export { MenuIcon };
