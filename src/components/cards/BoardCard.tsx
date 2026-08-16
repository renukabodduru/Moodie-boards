import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { LayoutGrid, ArrowRight, FolderKanban } from 'lucide-react';

export const BoardCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject, setCurrentBoardId, createBoard } = useBoard();
  const [title, setTitle] = useState<string>(object.content.title || 'Nested Board');

  const handleOpenBoard = (e: React.MouseEvent) => {
    e.stopPropagation();
    let targetId = object.content.targetBoardId;
    if (!targetId) {
      targetId = createBoard(title);
      updateObject(object.id, { content: { ...object.content, targetBoardId: targetId } });
    }
    setCurrentBoardId(targetId);
  };

  return (
    <div
      onDoubleClick={handleOpenBoard}
      className="w-full h-full flex flex-col justify-between group/board cursor-pointer"
    >
      <div className="flex items-start gap-2.5">
        <div className="p-2.5 bg-blue-500 text-white rounded-2xl shadow-md group-hover/board:scale-110 transition-transform">
          <FolderKanban className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              updateObject(object.id, { content: { ...object.content, title: e.target.value } });
            }}
            placeholder="Board Name"
            className="font-bold text-sm bg-transparent focus:outline-none text-premium-black w-full truncate"
          />
          <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
            Nested Workspace
          </span>
        </div>
      </div>

      <button
        onClick={handleOpenBoard}
        className="mt-3 flex items-center justify-between w-full px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-blue-700 transition-colors"
      >
        <span>Open Board</span>
        <ArrowRight className="w-4 h-4 group-hover/board:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
