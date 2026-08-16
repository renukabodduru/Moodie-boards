import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const ChaosToClarity: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Smooth the scroll progress for springy transitions
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Headline opacity transitions
  const chaosOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const clarityOpacity = useTransform(smoothProgress, [0.6, 1], [0, 1]);

  // Transform states for 6 example cards
  
  // Card 1: Top Left Photo
  const c1X = useTransform(smoothProgress, [0, 1], [-150, 0]);
  const c1Y = useTransform(smoothProgress, [0, 1], [-100, 0]);
  const c1R = useTransform(smoothProgress, [0, 1], [-15, 0]);

  // Card 2: Center Text Note
  const c2X = useTransform(smoothProgress, [0, 1], [200, 160]);
  const c2Y = useTransform(smoothProgress, [0, 1], [150, 20]);
  const c2R = useTransform(smoothProgress, [0, 1], [25, 0]);

  // Card 3: Color Swatch
  const c3X = useTransform(smoothProgress, [0, 1], [-250, -20]);
  const c3Y = useTransform(smoothProgress, [0, 1], [250, 160]);
  const c3R = useTransform(smoothProgress, [0, 1], [-45, 0]);

  // Card 4: Right Image
  const c4X = useTransform(smoothProgress, [0, 1], [300, 320]);
  const c4Y = useTransform(smoothProgress, [0, 1], [-200, 80]);
  const c4R = useTransform(smoothProgress, [0, 1], [40, 0]);

  // Connection Line opacity and drawing
  const lineOpacity = useTransform(smoothProgress, [0.7, 1], [0, 1]);
  const linePath = useTransform(smoothProgress, [0.7, 1], [0, 1]);

  return (
    <section ref={containerRef} className="w-full h-[150vh] relative mt-20">
      <div className="sticky top-0 w-full h-screen flex flex-col md:flex-row items-center justify-center px-8 gap-12 lg:gap-24 overflow-hidden">
        
        {/* Left Side: Editorial Typography */}
        <div className="w-full md:w-1/3 relative h-32 md:h-auto flex items-center">
          <motion.div style={{ opacity: chaosOpacity }} className="absolute inset-0 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-black text-premium-black mb-4 tracking-tight">
              Start with<br/>scattered ideas.
            </h2>
            <p className="text-sm font-medium text-premium-gray">Images. Notes. Screenshots. Colors. Links. Thoughts.</p>
          </motion.div>
          
          <motion.div style={{ opacity: clarityOpacity }} className="absolute inset-0 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-black text-premium-black mb-4 tracking-tight">
              End with a<br/>clear direction.
            </h2>
            <p className="text-sm font-medium text-premium-gray">Turn the chaos into a structured creative vision.</p>
          </motion.div>
        </div>

        {/* Right Side: The Morphing Canvas */}
        <div className="w-full md:w-2/3 h-[500px] relative bg-white border border-premium shadow-premium-elevated rounded-3xl dot-matrix-bg overflow-hidden flex items-center justify-center">
          
          <div className="relative w-[500px] h-[400px]">
            {/* SVG Connection */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
              <motion.path 
                d="M 120 120 C 150 150, 150 150, 200 60" 
                fill="transparent" 
                stroke="#111111" 
                strokeWidth="1.5"
                style={{ opacity: lineOpacity, pathLength: linePath }}
              />
              <motion.path 
                d="M 280 180 C 320 250, 350 250, 380 200" 
                fill="transparent" 
                stroke="#111111" 
                strokeWidth="1.5"
                strokeDasharray="4 4"
                style={{ opacity: lineOpacity, pathLength: linePath }}
              />
            </svg>

            {/* Card 1: Photo */}
            <motion.div 
              style={{ x: c1X, y: c1Y, rotate: c1R }}
              className="absolute top-10 left-10 w-32 h-40 bg-slate-100 rounded-xl border border-premium shadow-sm p-1 z-10"
            >
              <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&fit=crop" className="w-full h-full object-cover rounded-lg pointer-events-none" alt="" />
            </motion.div>

            {/* Card 2: Text Note */}
            <motion.div 
              style={{ x: c2X, y: c2Y, rotate: c2R }}
              className="absolute top-20 left-40 w-48 h-32 bg-amber-50 rounded-xl border border-amber-200 shadow-sm p-4 z-20"
            >
              <h4 className="text-[10px] font-bold text-amber-900 mb-2 uppercase tracking-widest">Core Concept</h4>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">Focus on brutalist typography combined with organic textures. High contrast.</p>
            </motion.div>

            {/* Card 3: Color Swatch */}
            <motion.div 
              style={{ x: c3X, y: c3Y, rotate: c3R }}
              className="absolute top-40 left-10 w-28 h-32 bg-white rounded-xl border border-premium shadow-sm p-2 flex flex-col z-30"
            >
              <div className="w-full flex-1 rounded-lg bg-[#FF6B3D]"></div>
              <div className="mt-2 text-[10px] font-bold text-premium-black text-center">#FF6B3D</div>
            </motion.div>

            {/* Card 4: Right Photo */}
            <motion.div 
              style={{ x: c4X, y: c4Y, rotate: c4R }}
              className="absolute top-32 left-80 w-36 h-48 bg-slate-100 rounded-xl border border-premium shadow-sm p-1 z-10"
            >
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&fit=crop" className="w-full h-full object-cover rounded-lg pointer-events-none" alt="" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
