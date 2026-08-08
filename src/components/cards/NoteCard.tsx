import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Bold, Italic, List, CheckSquare } from 'lucide-react';

export const NoteCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [text, setText] = useState<string>(object.content.text || '');

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
        value={text}
        onChange={handleChange}
        placeholder="Start typing note..."
        className="w-full h-full bg-transparent resize-none focus:outline-none text-sm text-slate-800 leading-relaxed font-sans placeholder-slate-400"
      />
    </div>
  );
};
