import React, { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Bold, Italic, List, CheckSquare } from 'lucide-react';

export const NoteCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  
  // Clean up any old cards that had the placeholder accidentally saved as real text
  const initialText = object.content.text === 'Start typing note...' ? '' : (object.content.text || '');
  const [text, setText] = useState<string>(initialText);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Force shrink to measure true scrollHeight
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 150;
      const targetHeight = Math.max(minHeight, scrollHeight + 40);
      
      textareaRef.current.style.height = '100%';

      if (targetHeight !== object.height) {
        updateObject(object.id, { height: targetHeight });
      }
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    updateObject(object.id, { content: { ...object.content, text: val } });
  };

  return (
    <div className="w-full h-full flex flex-col group/note">
      {/* Rich Text Mini Toolbar */}
      <div className="flex items-center gap-1 mb-1.5 opacity-0 group-hover/note:opacity-100 transition-opacity">
        <button
          onClick={() => {
            const next = text + ' **bold**';
            setText(next);
            updateObject(object.id, { content: { ...object.content, text: next } });
          }}
          className="p-1 text-neutral-400 hover:text-premium-black hover:bg-neutral-100 rounded text-xs"
          title="Bold"
        >
          <Bold className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            const next = text + ' *italic*';
            setText(next);
            updateObject(object.id, { content: { ...object.content, text: next } });
          }}
          className="p-1 text-neutral-400 hover:text-premium-black hover:bg-neutral-100 rounded text-xs"
          title="Italic"
        >
          <Italic className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            const next = text + '\n• ';
            setText(next);
            updateObject(object.id, { content: { ...object.content, text: next } });
          }}
          className="p-1 text-neutral-400 hover:text-premium-black hover:bg-neutral-100 rounded text-xs"
          title="Bullet List"
        >
          <List className="w-3 h-3" />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Start typing note..."
        className="w-full h-full bg-transparent resize-none focus:outline-none text-[15px] text-premium-black leading-[1.6] font-medium tracking-tight placeholder-neutral-400"
      />
    </div>
  );
};
