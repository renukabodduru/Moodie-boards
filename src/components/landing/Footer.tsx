import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const { setViewMode } = useBoard();

  return (
    <footer className="w-full bg-white border-t border-premium py-20 px-6 overflow-hidden relative">
      <div className="absolute inset-0 dot-matrix-bg opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-premium-black mb-6 tracking-tight">
          Make your ideas visible.
        </h2>
        
        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setViewMode('dashboard')}
          className="px-8 py-3.5 bg-premium-black text-white rounded-full font-bold text-sm shadow-premium-elevated hover:bg-neutral-800 transition-colors mb-24"
        >
          Create your first board
        </motion.button>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 border-t border-premium pt-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-premium-black text-white flex items-center justify-center font-bold text-[10px] dot-matrix-bg">
              M
            </div>
            <span className="font-bold text-xs tracking-tight text-premium-black">Moodie Boards</span>
          </div>

          <div className="flex items-center gap-6">
            {['Product', 'Features', 'Templates', 'Resources', 'Company'].map(link => (
              <a key={link} href="#" className="text-xs font-semibold text-premium-gray hover:text-premium-black transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="w-full mt-12 flex justify-center">
          <h1 className="text-[12vw] font-black text-slate-100 tracking-tighter leading-none pointer-events-none select-none" style={{ textShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
            MOODIE
          </h1>
        </div>
      </div>
    </footer>
  );
};
