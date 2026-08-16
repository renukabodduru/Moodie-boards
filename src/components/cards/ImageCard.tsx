import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Image as ImageIcon, Upload, Download, Sparkles, Maximize2, Crop, X } from 'lucide-react';

export const ImageCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [url, setUrl] = useState<string>(object.content.url || '');
  const [caption, setCaption] = useState<string>(object.content.caption || '');
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>(object.content.fitMode || 'cover');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
        <div className="relative flex-1 w-full overflow-hidden rounded-xl bg-neutral-100/50 flex items-center justify-center">
          <img src={url} alt={caption} className={`w-full h-full rounded-xl pointer-events-none object-${fitMode}`} />
          
          <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
            <button
              onClick={() => {
                const next = fitMode === 'cover' ? 'contain' : 'cover';
                setFitMode(next);
                updateObject(object.id, { content: { ...object.content, fitMode: next } });
              }}
              className="p-1.5 bg-premium-canvas/70 text-white rounded-lg hover:bg-premium-canvas shadow-md backdrop-blur-sm"
              title="Toggle Fit/Crop"
            >
              <Crop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="p-1.5 bg-premium-canvas/70 text-white rounded-lg hover:bg-premium-canvas shadow-md backdrop-blur-sm"
              title="Fullscreen Preview"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <label className="p-1.5 bg-premium-canvas/70 text-white rounded-lg cursor-pointer hover:bg-premium-canvas shadow-md backdrop-blur-sm" title="Replace Image">
              <Upload className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      ) : (
        <label className="flex-1 w-full border-2 border-dashed border-premium rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-premium-canvas transition-colors">
          <ImageIcon className="w-8 h-8 text-neutral-400 mb-1" />
          <span className="text-xs font-semibold text-premium-gray">Upload Image</span>
          <span className="text-[10px] text-neutral-400">Click or drag photo</span>
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
        className="w-full mt-2 text-xs text-center text-premium-gray bg-transparent focus:outline-none placeholder-slate-400"
      />

      {isLightboxOpen && url && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(false);
          }}
          onKeyDown={(e) => e.key === 'Escape' && setIsLightboxOpen(false)}
          tabIndex={0}
          autoFocus
        >
          <button 
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <img 
            src={url} 
            alt={caption} 
            className="max-w-[90vw] max-h-[85vh] object-contain drop-shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />
          
          {caption && (
            <p className="absolute bottom-8 px-6 py-2 bg-black/50 backdrop-blur-md text-white rounded-full text-sm font-medium">
              {caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
