import React, { useEffect, useRef } from 'react';

interface DotMatrixTextProps {
  text: string;
  className?: string;
  fontSize?: number;
  dotSize?: number;
  gap?: number;
}

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  opacity: number;
}

export const DotMatrixText: React.FC<DotMatrixTextProps> = ({ 
  text, 
  className = "",
  fontSize = 200,
  dotSize = 3,
  gap = 6
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect() || { width: 800, height: 400 };
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;

    // 1. Measure full size text
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.font = `bold ${fontSize}px "PP Neue Montreal", -apple-system, sans-serif`;
    const metrics = tempCtx.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    const textHeight = fontSize * 1.5; // generous bounding box

    // 2. Render high-res text to offscreen canvas
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;
    
    const offWidth = textWidth + gap * 4;
    const offHeight = textHeight;
    offscreen.width = offWidth;
    offscreen.height = offHeight;
    
    offCtx.fillStyle = 'white';
    offCtx.font = `bold ${fontSize}px "PP Neue Montreal", -apple-system, sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(text, offWidth / 2, offHeight / 2);

    // Calculate how much we need to scale down the final result to fit the screen
    const drawScale = Math.min(1, (width - 40) / offWidth);
    const scaledDotSize = Math.max(1, dotSize * drawScale);
    
    // Calculate offsets to center the point cloud on the screen
    const offsetX = (width - offWidth * drawScale) / 2;
    const offsetY = (height - offHeight * drawScale) / 2;

    // 3. Extract pixel data and create dots
    const imageData = offCtx.getImageData(0, 0, offWidth, offHeight);
    const data = imageData.data;
    const dots: Dot[] = [];

    // Scan the high-res grid
    for (let y = 0; y < offHeight; y += gap) {
      for (let x = 0; x < offWidth; x += gap) {
        const i = (y * offWidth + x) * 4;
        const alpha = data[i + 3];
        
        if (alpha > 128) { // If pixel is mostly solid
          // Start scattered relative to the offscreen size
          const startX = offWidth / 2 + (Math.random() - 0.5) * offWidth * 1.5;
          const startY = offHeight / 2 + (Math.random() - 0.5) * offHeight * 1.5;
          
          dots.push({
            x: startX,
            y: startY,
            baseX: x,
            baseY: y,
            targetX: x,
            targetY: y,
            vx: 0,
            vy: 0,
            opacity: 0
          });
        }
      }
    }

    // Animation variables
    let animationFrame: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Mouse coordinates relative to the canvas
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // 4. Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#111111';

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        // Calculate the dot's final screen position for mouse repulsion
        const screenBaseX = dot.baseX * drawScale + offsetX;
        const screenBaseY = dot.baseY * drawScale + offsetY;
        
        // Mouse repulsion
        const dx = mouseX - screenBaseX;
        const dy = mouseY - screenBaseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 80;
        
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          // Push away from mouse in the unscaled coordinate space
          dot.targetX = dot.baseX - (Math.cos(angle) * force * 20) / drawScale;
          dot.targetY = dot.baseY - (Math.sin(angle) * force * 20) / drawScale;
        } else {
          dot.targetX = dot.baseX;
          dot.targetY = dot.baseY;
        }

        // Spring physics
        const ax = (dot.targetX - dot.x) * 0.05;
        const ay = (dot.targetY - dot.y) * 0.05;
        
        dot.vx += ax;
        dot.vy += ay;
        dot.vx *= 0.8; // friction
        dot.vy *= 0.8;
        
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Fade in
        if (dot.opacity < 1) {
          dot.opacity += 0.02 + Math.random() * 0.02;
        }

        // Draw dot
        ctx.globalAlpha = Math.min(1, dot.opacity);
        ctx.beginPath();
        
        const finalX = dot.x * drawScale + offsetX;
        const finalY = dot.y * drawScale + offsetY;
        
        ctx.arc(finalX, finalY, scaledDotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(animate);
    };

    // Start animation with a slight delay
    setTimeout(() => {
      animate();
    }, 100);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [text, fontSize, dotSize, gap]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
