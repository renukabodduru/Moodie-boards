import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';

export const HeadingCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [text, setText] = useState<string>(object.content.text || 'Heading');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    updateObject(object.id, { content: { ...object.content, text: val } });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="HEADING TITLE"
        className="w-full bg-transparent focus:outline-none text-2xl font-extrabold tracking-tight focus:ring-1 focus:ring-indigo-400 rounded px-1"
        style={{ color: object.style?.color || '#0f172a', textAlign: object.style?.textAlign || 'left' }}
      />
    </div>
  );
};
