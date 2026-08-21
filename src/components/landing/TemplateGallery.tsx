import React from 'react';
import { motion } from 'framer-motion';
import { useBoard } from '../../context/BoardContext';

import { Network, Film, Palette } from 'lucide-react';

const templates = [
  {
    id: 'mindmap',
    title: 'Mind Map',
    icon: Network,
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100/50">
        <div className="absolute w-16 h-16 rounded-full bg-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:scale-125 transition-transform duration-700 ease-out" />
        <div className="absolute w-8 h-8 rounded-full bg-blue-500 shadow-lg z-10 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-8 left-6 w-4 h-4 rounded-full bg-indigo-400 shadow-md group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 delay-75" />
        <div className="absolute bottom-10 right-6 w-5 h-5 rounded-full bg-cyan-400 shadow-md group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 delay-100" />
        <div className="absolute top-12 right-10 w-3 h-3 rounded-full bg-blue-300 shadow-md group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-500 delay-150" />
        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500" viewBox="0 0 100 100">
          <line x1="50" y1="50" x2="30" y2="30" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50" y1="50" x2="70" y2="70" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50" y1="50" x2="70" y2="35" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>
    ),
    iconColor: 'text-blue-500',
    shadowColor: 'group-hover:shadow-blue-500/20',
  },
  {
    id: 'storyboard',
    title: 'Video Storyboard',
    icon: Film,
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-fuchsia-100/50 overflow-hidden">
        <div className="absolute w-full h-40 bg-purple-500/10 rotate-12 group-hover:rotate-6 transition-transform duration-700 ease-out flex gap-3 p-3 items-center" style={{ width: '140%' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 aspect-[16/9] bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-[100ms]" />
              <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-purple-300" />
            </div>
          ))}
        </div>
      </div>
    ),
    iconColor: 'text-purple-500',
    shadowColor: 'group-hover:shadow-purple-500/20',
  },
  {
    id: 'moodboard',
    title: 'Brand Moodboard',
    icon: Palette,
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-100/50">
        <div className="absolute w-14 h-16 bg-white rounded-xl shadow-md -rotate-12 group-hover:-rotate-6 group-hover:-translate-x-2 transition-transform duration-500 ease-out border border-rose-100 flex flex-col p-1.5 gap-1.5 z-10">
          <div className="flex-1 w-full rounded-lg bg-rose-400" />
          <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
        </div>
        <div className="absolute w-16 h-12 bg-white rounded-xl shadow-md rotate-12 group-hover:rotate-6 group-hover:translate-x-3 transition-transform duration-500 ease-out border border-orange-100 p-1.5 flex gap-1 z-20">
          <div className="w-1/2 h-full bg-orange-400 rounded-lg" />
          <div className="w-1/2 h-full bg-amber-300 rounded-lg" />
        </div>
        <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-fuchsia-400 to-rose-400 shadow-lg -bottom-2 -left-2 mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-500 z-30" />
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 shadow-lg -top-2 right-2 mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-500 z-30" />
      </div>
    ),
    iconColor: 'text-rose-500',
    shadowColor: 'group-hover:shadow-rose-500/20',
  }
];

export const TemplateGallery: React.FC = () => {
  const { createBoard, setCurrentBoardId, setViewMode, applyTemplate } = useBoard();

  const handleUseTemplate = (templateId: string, templateTitle: string) => {
    // 1. Create a new board with the template's title
    const newBoardId = createBoard(`New ${templateTitle}`);
    
    // 2. Set it as current so when we switch to canvas, it opens this board
    setCurrentBoardId(newBoardId);
    
    // 3. Apply the template objects to the newly created board
    applyTemplate(templateId, newBoardId);
    
    // 4. Navigate to canvas
    setViewMode('canvas');
  };

  return (
    <section id="templates" className="w-full max-w-7xl px-6 py-32 mt-20 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl font-black text-premium-black tracking-tight mb-4">Start with a template.</h2>
          <p className="text-sm font-medium text-premium-gray">Or start from a blank canvas. Your choice.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative cursor-pointer"
            onClick={() => handleUseTemplate(t.id, t.title)}
          >
            <div className={`w-full aspect-[4/5] bg-white rounded-[32px] border border-black/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.04),_0_4px_10px_rgba(0,0,0,0.02)] p-4 flex flex-col items-center justify-center relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-3 group-hover:scale-[1.02] group-hover:rotate-1 ${t.shadowColor} group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]`}>
              <div className={`w-full aspect-square rounded-[24px] overflow-hidden border border-black/[0.03] shadow-inner relative z-10 group-hover:shadow-md transition-all duration-500 flex items-center justify-center bg-slate-50`}>
                {t.illustration}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[32px] z-20 pointer-events-none">
                <button className="px-4 py-2 bg-premium-black text-white text-xs font-bold rounded-full shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                  Use Template
                </button>
              </div>
            </div>
            <h3 className="mt-4 text-sm font-bold text-premium-black flex items-center justify-center gap-2">
              <t.icon className="w-4 h-4 text-premium-gray group-hover:text-premium-black transition-colors" />
              {t.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
