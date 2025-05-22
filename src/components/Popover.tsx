// Popover.tsx
import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type PopoverPosition = 'left' | 'center' | 'right';

const positionClasses: Record<PopoverPosition, string> = {
  left: '-left-1 translate-x-0',
  center: 'left-[50%] -translate-x-1/2',
  right: '-right-1 translate-x-0',
};

interface PopoverProps {
  label: string;
  position?: PopoverPosition;
}

export const Popover: FC<PopoverProps> = ({ label, position = 'center' }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className={`absolute -bottom-12 whitespace-nowrap z-50
                 px-3 py-2 rounded-lg bg-[var(--background)] 
                 border border-violet-500/20 shadow-lg shadow-violet-500/10
                 text-sm font-medium text-[var(--text-primary)]
                 before:content-[''] before:absolute before:top-0
                 before:-translate-y-2 before:border-4 before:border-transparent 
                 before:border-b-[var(--background)]
                 ${positionClasses[position]}
                 ${
                   position === 'center'
                     ? 'before:left-1/2 before:-translate-x-1/2'
                     : position === 'left'
                       ? 'before:left-4'
                       : 'before:right-4'
                 }`}
    >
      {label}
    </motion.div>
  </AnimatePresence>
);
