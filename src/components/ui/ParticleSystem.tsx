import React, { useEffect, useRef } from 'react';
import { MotionValue } from 'framer-motion';

type ParticleType = 'circle' | 'square' | 'plus';

interface Particle {
  id: number;
  type: ParticleType;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number;
  baseOpacity: number;
  drifting: boolean;
  driftVx: number;
  driftVy: number;
}

interface ParticleSystemProps {
  scrollProgress: MotionValue<number>;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const progressRef = useRef(0);

  useEffect(() => {
    return scrollProgress.onChange((v) => {
      progressRef.current = v;
    });
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // optimize
    if (!ctx) return;

    // Accessibility check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrameId: number;

    const initCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      generateParticles();
    };

    const generateParticles = () => {
      particles = [];
      const isMobile = width < 768;
      const particleCount = isMobile ? 400 : (width < 1024 ? 1000 : 2500);

      // Define abstract shapes (Moodboard elements) relative to screen center
      const centerX = width * 0.7; // Weighted to the right
      const centerY = height * 0.5;
      
      const shapes = [
        // Main Card (Image)
        { x: centerX - 100, y: centerY - 150, w: 200, h: 250, weight: 30 },
        // Side Note 1
        { x: centerX + 150, y: centerY - 100, w: 120, h: 100, weight: 15 },
        // Side Note 2
        { x: centerX - 250, y: centerY + 50, w: 150, h: 120, weight: 20 },
        // Bottom Swatch
        { x: centerX + 50, y: centerY + 180, w: 80, h: 80, weight: 10 },
        // Connecting line 1 (represented as a thin dense rect)
        { x: centerX - 120, y: centerY, w: 140, h: 2, weight: 5 },
        // Connecting line 2
        { x: centerX + 80, y: centerY - 40, w: 100, h: 2, weight: 5 },
      ];

      for (let i = 0; i < particleCount; i++) {
        let targetX = 0;
        let targetY = 0;

        // 70% of particles belong to shapes (High density)
        // 30% are scattered background noise (Low density)
        if (Math.random() < 0.7) {
          // Pick a random shape based roughly on weight
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          // Add some gaussian-like clustering towards the center of shapes
          targetX = shape.x + (Math.random() * shape.w);
          targetY = shape.y + (Math.random() * shape.h);
          
          // Fuzz it out a bit to make it abstract
          targetX += (Math.random() - 0.5) * 40;
          targetY += (Math.random() - 0.5) * 40;
        } else {
          // Background scatter
          targetX = Math.random() * width;
          targetY = Math.random() * height;
        }

        // Depth dictates size, opacity, and parallax speed (0.5 to 1.5)
        const depth = 0.5 + Math.random();
        
        // Size: 1px to 2.5px
        const size = Math.max(1, depth * 1.5);
        
        let type: ParticleType = 'circle';
        const rand = Math.random();
        if (rand > 0.95) type = 'plus';
        else if (rand > 0.90) type = 'square';

        // Opacity tiers
        let baseOpacity = 0.06; // faint
        if (Math.random() > 0.6) baseOpacity = 0.12; // secondary
        if (Math.random() > 0.9) baseOpacity = 0.25; // primary

        // Apply depth to opacity
        baseOpacity = Math.min(0.8, baseOpacity * depth);

        // Micro-drifting
        const drifting = Math.random() > 0.9;
        const driftVx = (Math.random() - 0.5) * 0.2;
        const driftVy = (Math.random() - 0.5) * 0.2;

        // Initial scatter (starts offscreen or wide)
        const startX = width / 2 + (Math.random() - 0.5) * width * 1.5;
        const startY = height / 2 + (Math.random() - 0.5) * height * 1.5;

        particles.push({
          id: i,
          type,
          startX,
          startY,
          targetX,
          targetY,
          x: startX,
          y: startY,
          vx: 0,
          vy: 0,
          size,
          depth,
          baseOpacity,
          drifting,
          driftVx,
          driftVy
        });
      }
    };

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    const render = () => {
      // Clear with background color instead of transparent for performance
      ctx.fillStyle = '#F5F4F0';
      ctx.fillRect(0, 0, width, height);

      // We normalize scroll progress for the animation window we care about
      let p = prefersReducedMotion ? 1 : progressRef.current;
      
      // Remap progress to 0-1 range based on when it appears in the viewport
      let animPhase = Math.max(0, Math.min(1, (p - 0.1) * 1.5)); 
      // apply ease
      const easeInOutCubic = animPhase < 0.5 ? 4 * animPhase * animPhase * animPhase : 1 - Math.pow(-2 * animPhase + 2, 3) / 2;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Base target based on scroll interpolation
        const currentTargetX = p.startX + (p.targetX - p.startX) * easeInOutCubic;
        const currentTargetY = p.startY + (p.targetY - p.startY) * easeInOutCubic;

        // Mouse Repulsion
        let repelX = 0;
        let repelY = 0;
        
        if (!prefersReducedMotion) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120; // 120px interaction radius
          
          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            const angle = Math.atan2(dy, dx);
            // Move away 1-15px depending on depth
            const moveMagnitude = force * 15 * p.depth;
            repelX = -Math.cos(angle) * moveMagnitude;
            repelY = -Math.sin(angle) * moveMagnitude;
          }
        }

        // Apply drift
        if (p.drifting && !prefersReducedMotion) {
          p.targetX += p.driftVx;
          p.targetY += p.driftVy;
        }

        // Final target
        const finalTargetX = currentTargetX + repelX;
        const finalTargetY = currentTargetY + repelY;

        if (prefersReducedMotion) {
           p.x = finalTargetX;
           p.y = finalTargetY;
        } else {
           // Spring physics
           // Higher depth = faster spring (foreground)
           const spring = 0.04 * p.depth;
           const friction = 0.85;

           p.vx += (finalTargetX - p.x) * spring;
           p.vy += (finalTargetY - p.y) * spring;
           p.vx *= friction;
           p.vy *= friction;
           
           p.x += p.vx;
           p.y += p.vy;
        }

        // Only draw if visible
        if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) continue;

        // Opacity fades in as they form
        const currentOpacity = p.baseOpacity * (0.2 + easeInOutCubic * 0.8);
        ctx.fillStyle = `rgba(20, 20, 20, ${currentOpacity})`;

        if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'square') {
          ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        } else if (p.type === 'plus') {
          const half = p.size;
          ctx.fillRect(p.x - half, p.y - 0.5, p.size * 2, 1);
          ctx.fillRect(p.x - 0.5, p.y - half, 1, p.size * 2);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    initCanvas();
    render();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (!prefersReducedMotion) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-premium-canvas">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
