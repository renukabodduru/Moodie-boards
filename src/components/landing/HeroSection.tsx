import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DotMatrixText } from '../ui/DotMatrixText';

const NodeLabel: React.FC<{ text: string, x: number, y: number, delay: number }> = ({ text, x, y, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, type: 'spring' }}
    className="absolute px-2 py-1 bg-white border border-premium shadow-sm rounded-full text-[10px] font-mono-tech tracking-widest text-premium-black uppercase"
    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
  >
    {text}
  </motion.div>
);

export const HeroSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 z-10 overflow-hidden">
      
      {/* Abstract Animated Idea Network (Background/Center) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 md:opacity-100">
        <svg className="absolute w-full h-full max-w-[1200px]" viewBox="0 0 1000 600" fill="none">
          {/* Animated SVG Connections */}
          {mounted && (
            <>
              <motion.path
                d="M 200 150 Q 350 200 450 300"
                stroke="url(#gradient-line)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M 800 120 Q 650 250 550 300"
                stroke="url(#gradient-line)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.7 }}
              />
              <motion.path
                d="M 150 450 Q 300 400 450 350"
                stroke="url(#gradient-line)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
              />
              <motion.path
                d="M 850 480 Q 700 450 550 350"
                stroke="url(#gradient-line)"
                strokeWidth="1.5"
                strokeDasharray="2 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.8 }}
              />
            </>
          )}
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111111" />
              <stop offset="100%" stopColor="#777777" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Idea Nodes */}
        {mounted && (
          <div className="absolute w-full h-full max-w-[1200px]">
            <NodeLabel text="Image" x={20} y={25} delay={1.2} />
            <NodeLabel text="Color" x={80} y={20} delay={1.4} />
            <NodeLabel text="Type" x={15} y={75} delay={1.6} />
            <NodeLabel text="Reference" x={85} y={80} delay={1.8} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-7xl mt-24">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 w-full"
        >
          <span className="px-5 py-2 rounded-full glass-panel text-xs font-bold tracking-widest text-primary-text uppercase mb-8 inline-block shadow-sm">
            Moodie Boards 2.0
          </span>
          
          <div className="w-full flex justify-center items-center h-[200px] md:h-[300px] mb-8 relative">
            <h1 className="text-5xl md:text-8xl font-medium tracking-extra-wide text-primary-text uppercase leading-tight">
              Creative<br />
              <span className="text-3xl md:text-6xl tracking-widest text-secondary-text">Design</span>
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-3xl text-premium-gray max-w-4xl font-medium mb-12 leading-relaxed"
        >
          Your ideas, finally in one place. Collect inspiration, organize your thoughts, and connect concepts on a visual canvas built for creative thinking.
        </motion.p>

      </div>

    </section>
  );
};
