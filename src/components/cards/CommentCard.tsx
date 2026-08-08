import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { MessageSquare, Check, Reply } from 'lucide-react';

export const CommentCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [text, setText] = useState<string>(object.content.text || 'Add comment...');
  const [resolved, setResolved] = useState<boolean>(object.content.resolved || false);

  const toggleResolve = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !resolved;
    setResolved(next);
    updateObject(object.id, { content: { ...object.content, resolved: next } });
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between ${resolved ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
            {object.content.author ? object.content.author.charAt(0) : 'U'}
          </div>
          <span className="font-bold text-xs text-amber-900 truncate">
            {object.content.author || 'Collaborator'}
          </span>
        </div>

        <button
          onClick={toggleResolve}
          className={`p-1 rounded-full text-[10px] font-semibold flex items-center gap-0.5 ${
            resolved ? 'bg-emerald-600 text-white' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
          }`}
          title="Resolve Thread"
        >
          <Check className="w-3 h-3" /> {resolved ? 'Resolved' : 'Resolve'}
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          updateObject(object.id, { content: { ...object.content, text: e.target.value } });
        }}
        placeholder="Type comment reply..."
        className="w-full h-full bg-transparent resize-none focus:outline-none text-xs text-amber-950 font-medium leading-relaxed"
      />
    </div>
  );
};
