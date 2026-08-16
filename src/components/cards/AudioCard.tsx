import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Music, Mic, Volume2 } from 'lucide-react';

export const AudioCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [url, setUrl] = useState<string>(object.content.url || '');
  const [title, setTitle] = useState<string>(object.content.title || 'voice-note.mp3');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setUrl(src);
      setTitle(file.name);
      updateObject(object.id, { content: { ...object.content, url: src, title: file.name } });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
          <Music className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            updateObject(object.id, { content: { ...object.content, title: e.target.value } });
          }}
          className="font-semibold text-xs bg-transparent focus:outline-none text-slate-800 flex-1 truncate"
        />
      </div>

      {url ? (
        <audio src={url} controls className="w-full h-8" />
      ) : (
        <label className="flex-1 w-full border border-slate-200 bg-slate-50 rounded-xl flex items-center justify-center gap-2 p-2 cursor-pointer hover:bg-slate-100 transition-colors">
          <Mic className="w-4 h-4 text-pink-500" />
          <span className="text-xs text-slate-600 font-medium">Upload Audio</span>
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </label>
      )}
    </div>
  );
};
