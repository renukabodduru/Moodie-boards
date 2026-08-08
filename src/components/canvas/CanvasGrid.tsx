import React from 'react';
import { useBoard } from '../../context/BoardContext';

export const CanvasGrid: React.FC = () => {
  const { zoom, pan } = useBoard();

  const gridGap = 24 * zoom;
  const dotSize = Math.max(1.5 * zoom, 1);

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle, #cbd5e1 ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gridGap}px ${gridGap}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    />
  );
};
