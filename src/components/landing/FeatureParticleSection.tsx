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
        
        {/* Foreground Content */}
        <div className="absolute inset-0 flex items-center max-w-7xl mx-auto px-6 pointer-events-none">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 pointer-events-auto">
            <div className="w-full md:w-1/2 flex flex-col justify-center">
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
            
            <div className="w-full md:w-1/2 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent rounded-2xl transform translate-x-4 translate-y-4 -z-10" />
                <img 
                  src="/hero-image.jpg" 
                  alt="Visual workspace abstraction" 
                  className="rounded-2xl shadow-2xl object-cover max-h-[600px] w-full max-w-lg border border-white/20"
                />
              </motion.div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
