import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Video, Play, Upload } from 'lucide-react';

export const VideoCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [url, setUrl] = useState<string>(object.content.url || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setUrl(src);
        updateObject(object.id, { content: { ...object.content, url: src } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {url ? (
        <video src={url} controls className="w-full h-full object-cover rounded-xl bg-black" />
      ) : (
        <label className="flex-1 w-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-50 transition-colors">
          <Video className="w-8 h-8 text-indigo-500 mb-1" />
          <span className="text-xs font-semibold text-slate-600">Upload Video</span>
          <span className="text-[10px] text-slate-400">MP4, WebM, MOV</span>
          <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
        </label>
      )}
    </div>
  );
};
