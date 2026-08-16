import React, { useState, useRef } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Bold, Italic, List, CheckSquare } from 'lucide-react';

export const NoteCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [text, setText] = useState<string>(object.content.text || '');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    
    let newHeight = object.height;
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight > object.height - 30) {
        newHeight = scrollHeight + 30;
      }
      textareaRef.current.style.height = '100%';
    }
    
    updateObject(object.id, { 
      content: { ...object.content, text: val },
      ...(newHeight !== object.height ? { height: newHeight } : {})
    });
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
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded text-xs"
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
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded text-xs"
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
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded text-xs"
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
        className="w-full h-full bg-transparent resize-none focus:outline-none text-[15px] text-slate-800 leading-[1.6] font-medium tracking-tight placeholder-slate-400"
      />
    </div>
  );
};
