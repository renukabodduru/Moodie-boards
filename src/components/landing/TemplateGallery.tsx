import React from 'react';
import { motion } from 'framer-motion';
import { useBoard } from '../../context/BoardContext';

const templates = [
  {
    id: 'mindmap',
    title: 'Mind Map',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&fit=crop',
  },
  {
    id: 'storyboard',
    title: 'Video Storyboard',
    image: 'https://images.unsplash.com/photo-1550614000-4b95d4ebf5dc?w=600&fit=crop',
  },
  {
    id: 'moodboard',
    title: 'Brand Moodboard',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&fit=crop',
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
        <button className="text-xs font-bold uppercase tracking-widest text-premium-black hover:text-accent transition-colors">
          View all templates &rarr;
        </button>
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
            <div className="w-full aspect-[4/5] bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 flex flex-col items-center justify-center relative transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-premium-elevated group-hover:bg-white/60 group-hover:border-white">
              <div className="w-3/4 aspect-square rounded-xl overflow-hidden border border-premium shadow-sm relative z-10 group-hover:shadow-md transition-shadow">
                <img 
                  src={t.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={t.title}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-20 pointer-events-none">
                <button className="px-4 py-2 bg-premium-black text-white text-xs font-bold rounded-full shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                  Use Template
                </button>
              </div>
            </div>
            <h3 className="mt-4 text-sm font-bold text-premium-black text-center">{t.title}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
