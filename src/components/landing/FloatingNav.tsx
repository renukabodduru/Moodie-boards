import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useBoard } from '../../context/BoardContext';

export const FloatingNav: React.FC = () => {
  const { setViewMode } = useBoard();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-8 transition-all duration-500 ease-out w-[95%] max-w-7xl h-16 glass-panel rounded-full ${
        isScrolled ? 'shadow-md border-white/60' : 'shadow-sm border-white/30'
      }`}
    >
      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setViewMode('landing')}>
        <span className="font-medium text-xl tracking-wide text-primary-text hidden sm:block">
          <span className="font-bold">Moodie</span> board
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 px-6 py-2">
        <motion.button
          onClick={() => setViewMode('dashboard')}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm font-medium text-primary-text hover:opacity-70 transition-opacity"
        >
          Boards
        </motion.button>
        <motion.a
          href="#templates"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm font-medium text-primary-text hover:opacity-70 transition-opacity"
        >
          Templates
        </motion.a>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={() => setViewMode('dashboard')}
          className="group relative flex items-center gap-2 px-6 py-2 pill-button text-primary-text text-xs font-bold uppercase tracking-widest"
        >
          <span>Create Board</span>
        </motion.button>
      </nav>
    </motion.header>
  );
};
