import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Image as ImageIcon, Upload, Download, Sparkles } from 'lucide-react';

export const ImageCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [url, setUrl] = useState<string>(object.content.url || '');
  const [caption, setCaption] = useState<string>(object.content.caption || '');

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
    <div className="w-full h-full flex flex-col justify-between group/img">
      {url ? (
        <div className="relative flex-1 w-full overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center">
          <img src={url} alt={caption} className="w-full h-full object-cover rounded-xl" />
          <label className="absolute bottom-2 right-2 p-1.5 bg-slate-900/70 text-white rounded-lg opacity-0 group-hover/img:opacity-100 cursor-pointer hover:bg-slate-900 transition-opacity">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <label className="flex-1 w-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-50 transition-colors">
          <ImageIcon className="w-8 h-8 text-slate-400 mb-1" />
          <span className="text-xs font-semibold text-slate-600">Upload Image</span>
          <span className="text-[10px] text-slate-400">Click or drag photo</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      )}

      <input
        type="text"
        value={caption}
        onChange={(e) => {
          setCaption(e.target.value);
          updateObject(object.id, { content: { ...object.content, caption: e.target.value } });
        }}
        placeholder="Add image caption..."
        className="w-full mt-2 text-xs text-center text-slate-500 bg-transparent focus:outline-none placeholder-slate-400"
      />
    </div>
  );
};
