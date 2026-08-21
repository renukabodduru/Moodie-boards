import React, { useRef, useState, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Edit3, Eraser, RotateCcw } from 'lucide-react';

export const SketchCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState<string>(object.content.color || '#4f46e5');
  const [isEraser, setIsEraser] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load saved drawing paths if available
    if (object.content.imageData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = object.content.imageData;
    }
  }, []);

  const startDrawing = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = isEraser ? '#ffffff' : strokeColor;
    ctx.lineWidth = isEraser ? 14 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    updateObject(object.id, { content: { ...object.content, imageData: dataUrl, color: strokeColor } });
  };

  const clearCanvas = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateObject(object.id, { content: { ...object.content, imageData: null } });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between relative group/sketch">
      {/* Sketching Tool palette */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-premium-canvas/80 backdrop-blur text-white p-1 rounded-xl shadow opacity-0 group-hover/sketch:opacity-100 transition-opacity">
        {['#4f46e5', '#ec4899', '#10b981', '#000000'].map((c) => (
          <button
            key={c}
            onClick={() => {
              setStrokeColor(c);
              setIsEraser(false);
            }}
            className={`w-4 h-4 rounded-full border border-white/30 ${
              strokeColor === c && !isEraser ? 'scale-125 ring-2 ring-white' : ''
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`p-1 rounded hover:bg-premium-canvas ${isEraser ? 'bg-premium-black text-white' : 'text-premium-gray'}`}
          title="Eraser"
        >
          <Eraser className="w-3 h-3" />
        </button>
        <button onClick={clearCanvas} className="p-1 rounded hover:bg-premium-canvas text-red-400" title="Clear Canvas">
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={object.width - 32}
        height={object.height - 32}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        className="w-full h-full cursor-crosshair rounded-xl bg-white border border-premium touch-none"
      />
    </div>
  );
};
