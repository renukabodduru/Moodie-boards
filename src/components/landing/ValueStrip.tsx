import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Maximize, GitMerge, PenTool } from 'lucide-react';

const MetricItem = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className="flex flex-col items-center text-center p-6 sm:p-8"
  >
    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-premium flex items-center justify-center mb-6 text-premium-black shadow-sm group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-5 h-5" strokeWidth={1.5} />
    </div>
    <h3 className="text-sm font-bold text-premium-black mb-3 tracking-widest uppercase">{title}</h3>
    <p className="text-xs text-premium-gray font-medium leading-relaxed max-w-[200px]">
      {description}
    </p>
  </motion.div>
);

export const ValueStrip: React.FC = () => {
  return (
    <section className="w-full max-w-6xl px-6 relative z-10 -mt-10 mb-32">
      <div className="w-full bg-white rounded-3xl border border-premium shadow-premium-elevated overflow-hidden relative">
        <div className="absolute inset-0 dot-matrix-bg opacity-30 pointer-events-none"></div>
        
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-premium group">
          <MetricItem 
            icon={Layers} 
            title="Collect" 
            description="Save images, links, notes, colors and references effortlessly." 
            delay={0.1} 
          />
          <MetricItem 
            icon={Maximize} 
            title="Organize" 
            description="Arrange everything freely on one infinite visual canvas." 
            delay={0.2} 
          />
          <MetricItem 
            icon={GitMerge} 
            title="Connect" 
            description="Turn scattered inspiration into meaningful visual connections." 
            delay={0.3} 
          />
          <MetricItem 
            icon={PenTool} 
            title="Create" 
            description="Build stunning moodboards that communicate your vision." 
            delay={0.4} 
          />
        </div>
      </div>
    </section>
  );
};
