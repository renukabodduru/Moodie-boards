import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Columns, ChevronUp, ChevronDown } from 'lucide-react';

export const ColumnCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject, boardObjects } = useBoard();
  const [title, setTitle] = useState<string>(object.content.title || 'Column Container');
  const [collapsed, setCollapsed] = useState<boolean>(object.content.collapsed || false);

  const childCards = boardObjects.filter((o) => o.parentId === object.id);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !collapsed;
    setCollapsed(next);
    updateObject(object.id, {
      height: next ? 70 : 420,
      content: { ...object.content, collapsed: next },
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Columns className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              updateObject(object.id, { content: { ...object.content, title: e.target.value } });
            }}
            className="font-extrabold text-xs uppercase tracking-wider bg-transparent focus:outline-none text-slate-800 flex-1 truncate"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
            {childCards.length}
          </span>
          <button
            onClick={toggleCollapse}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 w-full border-2 border-dashed border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Drag cards into this column container
          </p>
        </div>
      )}
    </div>
  );
};
