import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { MapPin, Search } from 'lucide-react';

export const MapCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [location, setLocation] = useState<string>(object.content.location || 'Tokyo, Japan');

  return (
    <div className="w-full h-full flex flex-col justify-between relative bg-premium-canvas text-white rounded-xl overflow-hidden p-3">
      {/* Mock Map Background Visual Matrix */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

      <div className="relative z-10 flex items-center gap-2 bg-premium-canvas/80 backdrop-blur rounded-xl p-1.5 border border-premium">
        <MapPin className="w-4 h-4 text-red-500" />
        <input
          type="text"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            updateObject(object.id, { content: { ...object.content, location: e.target.value } });
          }}
          placeholder="Search location..."
          className="bg-transparent text-xs text-white focus:outline-none flex-1 font-semibold"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center my-4">
        <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center animate-bounce">
          <MapPin className="w-5 h-5 fill-current" />
        </div>
        <span className="text-xs font-bold mt-1 text-premium-gray">{location}</span>
      </div>

      <div className="relative z-10 text-[10px] text-neutral-400 text-center font-mono">
        Lat: 35.6762° N | Long: 139.6503° E
      </div>
    </div>
  );
};
