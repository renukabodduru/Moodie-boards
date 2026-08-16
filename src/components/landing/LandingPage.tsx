import React, { useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { FloatingNav } from './FloatingNav';
import { HeroSection } from './HeroSection';
import { ValueStrip } from './ValueStrip';
import { FeatureParticleSection } from './FeatureParticleSection';
import { TemplateGallery } from './TemplateGallery';
import { Footer } from './Footer';
import { PremiumCursor } from './PremiumCursor';

export const LandingPage: React.FC = () => {
  const { setViewMode } = useBoard();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative h-screen overflow-y-auto bg-premium-canvas text-premium-black font-sans selection:bg-orange-200">
      <FloatingNav />
      
      <main className="flex flex-col items-center w-full relative z-10 overflow-hidden">
        <HeroSection />
        <ValueStrip />
        <FeatureParticleSection />
        <TemplateGallery />
      </main>

      <Footer />
    </div>
  );
};
