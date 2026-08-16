import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ParticleSystem } from '../ui/ParticleSystem';

export const FeatureParticleSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  return (
    <section ref={containerRef} className="relative w-full h-[150vh] mt-20">
      {/* Sticky container to hold the canvas and text in place while scrolling */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background Generative Particle System */}
        <ParticleSystem scrollProgress={smoothProgress} />
        
        {/* Foreground Typography */}
        <div className="absolute inset-0 flex items-center max-w-7xl mx-auto px-6 pointer-events-none">
          <div className="w-full md:w-1/2 flex flex-col justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-6xl font-light text-premium-black mb-8 tracking-tight leading-[1.1]">
                A workspace that <br />
                <span className="font-medium">thinks visually.</span>
              </h2>
              
              <p className="text-lg md:text-xl text-premium-gray font-medium max-w-md leading-relaxed">
                Collect inspiration, organize ideas, and build the connections that matter most. 
                Your thoughts don't happen in a straight line—your tools shouldn't either.
              </p>
            </motion.div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
