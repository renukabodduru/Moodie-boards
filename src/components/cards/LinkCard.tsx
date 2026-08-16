import React, { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { ExternalLink, Globe, Play, Film } from 'lucide-react';

export const LinkCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [url, setUrl] = useState<string>(object.content.url || '');
  const [title, setTitle] = useState<string>(object.content.title || '');
  const [description, setDescription] = useState<string>(object.content.description || '');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '1px';
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 110;
      const targetHeight = Math.max(minHeight, scrollHeight + 70); // Add offset for the header area
      
      textareaRef.current.style.height = '100%';

      if (targetHeight !== object.height) {
        updateObject(object.id, { height: targetHeight });
      }
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [description]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-start gap-2">
        <div className="p-2 bg-premium-black text-premium-black rounded-xl flex-shrink-0">
          <Globe className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              updateObject(object.id, { content: { ...object.content, title: e.target.value } });
            }}
            placeholder="Link Title..."
            className="w-full font-bold text-sm bg-transparent focus:outline-none text-premium-black truncate"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              updateObject(object.id, { content: { ...object.content, url: e.target.value } });
            }}
            placeholder="https://example.com"
            className="w-full text-xs text-premium-black bg-transparent focus:outline-none truncate hover:underline"
          />
        </div>
        {url && (
          <a
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-neutral-400 hover:text-premium-black rounded-lg hover:bg-neutral-100"
            title="Open Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          updateObject(object.id, { content: { ...object.content, description: e.target.value } });
        }}
        placeholder="Add description..."
        className="w-full h-12 mt-2 text-xs text-premium-gray bg-transparent resize-none focus:outline-none placeholder-slate-400"
      />
    </div>
  );
};
