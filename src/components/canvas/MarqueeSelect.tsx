import React from 'react';

interface MarqueeProps {
  rect: { x: number; y: number; width: number; height: number } | null;
}

export const MarqueeSelect: React.FC<MarqueeProps> = ({ rect }) => {
  if (!rect) return null;

  return (
    <div
      className="absolute border border-indigo-500 bg-indigo-500/10 pointer-events-none z-[9999] rounded"
      style={{
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    />
  );
};
