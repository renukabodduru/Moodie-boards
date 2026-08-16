import React, { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';

export const HeadingCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [text, setText] = useState<string>(object.content.text ?? '');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '1px';
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 60;
      const targetHeight = Math.max(minHeight, scrollHeight);
      
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
    <div className="w-full h-full flex items-center justify-center">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="HEADING TITLE"
        className="w-full h-full bg-transparent resize-none focus:outline-none text-3xl font-black tracking-tighter focus:ring-1 focus:ring-indigo-400 rounded px-1 overflow-hidden flex items-center"
        style={{ color: object.style?.color || '#0f172a', textAlign: object.style?.textAlign || 'left' }}
      />
    </div>
  );
};
