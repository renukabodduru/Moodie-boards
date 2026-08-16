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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'w-[90%] max-w-5xl h-14 bg-white/80 backdrop-blur-xl border border-premium shadow-premium-elevated rounded-full' 
          : 'w-full max-w-7xl h-16 bg-transparent border-transparent rounded-none'
      }`}
    >
      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setViewMode('landing')}>
        <div className="w-8 h-8 rounded-lg bg-premium-black text-white flex items-center justify-center font-bold text-lg dot-matrix-bg group-hover:rotate-12 transition-transform duration-300">
          M
        </div>
        <span className="font-bold text-sm tracking-tight text-premium-black hidden sm:block">Moodie Boards</span>
      </div>

      <nav className="hidden md:flex items-center gap-6 px-6 py-2 bg-white/40 backdrop-blur-md border border-neutral-200/60 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <motion.button
          onClick={() => setViewMode('dashboard')}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xs font-semibold text-premium-gray hover:text-premium-black transition-colors"
        >
          Boards
        </motion.button>
        <motion.a
          href="#templates"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xs font-semibold text-premium-gray hover:text-premium-black transition-colors"
        >
          Templates
        </motion.a>
      </nav>

      <div className="flex items-center gap-4">

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={() => setViewMode('dashboard')}
          className="group relative flex items-center gap-2 px-5 py-2 bg-premium-black text-white rounded-full text-xs font-semibold hover:shadow-premium-elevated transition-shadow"
        >
          <span>Create a Board</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </div>
    </motion.header>
  );
};
