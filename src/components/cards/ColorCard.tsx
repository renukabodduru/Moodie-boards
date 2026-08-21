import React, { useState, useEffect, useRef } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Copy, Check } from 'lucide-react';

export const ColorCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [hex, setHex] = useState<string>(object.content.hex || '#6366F1');
  const [name, setName] = useState<string>(object.content.name || 'Swatch Color');
  const [copied, setCopied] = useState<boolean>(false);
  const lastFetchedHex = useRef(object.content.name === 'Swatch Color' ? '' : hex);

  useEffect(() => {
    const fetchColorName = async () => {
      try {
        const cleanHex = hex.replace('#', '');
        const res = await fetch(`https://api.color.pizza/v1/${cleanHex}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.colors && data.colors.length > 0) {
            const fetchedName = data.colors[0].name;
            setName(fetchedName);
            lastFetchedHex.current = hex;
            updateObject(object.id, { content: { ...object.content, hex, name: fetchedName } });
          }
        }
      } catch (err) {
        // silently fail and keep current name
      }
    };

    const timer = setTimeout(() => {
      if (hex !== lastFetchedHex.current) {
        fetchColorName();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [hex]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 rounded-xl text-white" style={{ backgroundColor: hex }}>
      <div className="flex items-center justify-between">
        <input
          type="color"
          value={hex}
          onChange={(e) => {
            const val = e.target.value;
            setHex(val);
            updateObject(object.id, { content: { ...object.content, hex: val } });
          }}
          className="w-6 h-6 rounded border-none cursor-pointer bg-transparent"
        />
        <button
          onClick={handleCopy}
          className="p-1 bg-black/30 hover:bg-black/50 rounded-lg text-xs flex items-center gap-1 backdrop-blur"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            updateObject(object.id, { content: { ...object.content, name: e.target.value } });
          }}
          className="w-full font-bold text-sm bg-transparent focus:outline-none placeholder-white/70 drop-shadow"
        />
        <p className="text-xs font-mono opacity-80 uppercase tracking-widest">{hex}</p>
      </div>
    </div>
  );
};
