import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const PremiumCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      
      // Look for specific hover targets
      const anchor = target.closest('a');
      const button = target.closest('button');
      const template = target.closest('.group');

      if (template && template.querySelector('img')) {
        setCursorText('EXPLORE');
        setIsVisible(true);
      } else if (button && button.textContent?.includes('Create')) {
        setCursorText('CREATE');
        setIsVisible(true);
      } else if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        setCursorText('VIEW');
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-20 h-20 bg-premium-black rounded-full pointer-events-none z-[100] flex items-center justify-center mix-blend-difference"
      animate={{
        x: mousePosition.x - 40,
        y: mousePosition.y - 40,
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
    >
      <span className="text-white text-[10px] font-bold tracking-widest uppercase">{cursorText}</span>
    </motion.div>
  );
};
