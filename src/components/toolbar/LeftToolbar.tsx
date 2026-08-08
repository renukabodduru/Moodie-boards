import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { ObjectType } from '../../types/board';
import { TrashModal } from './TrashModal';
import {
  FileText,
  Heading as HeadingIcon,
  Link2,
  CheckSquare,
  FolderKanban,
  Columns,
  Image as ImageIcon,
  FileDown,
  Edit3,
  Palette,
  MapPin,
  MessageSquare,
  Trash2,
  Table as TableIcon,
} from 'lucide-react';

export const LeftToolbar: React.FC = () => {
  const { addObject, trash, pan, zoom } = useBoard();
  const [showTrashModal, setShowTrashModal] = useState(false);

  const handleAddAtCenter = (type: ObjectType) => {
    const centerX = (window.innerWidth / 2 - pan.x) / zoom - 120;
    const centerY = (window.innerHeight / 2 - pan.y) / zoom - 80;
    addObject(type, centerX, centerY);
  };

  const handleDragStart = (e: React.DragEvent, type: ObjectType) => {
    e.dataTransfer.setData('application/moodie-card-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const TOOL_ITEMS: Array<{ type: ObjectType; label: string; icon: React.ReactNode; color: string }> = [
    { type: 'note', label: 'Note', icon: <FileText className="w-5 h-5" />, color: 'hover:text-amber-500 hover:bg-amber-500/10' },
    { type: 'heading', label: 'Heading', icon: <HeadingIcon className="w-5 h-5" />, color: 'hover:text-indigo-500 hover:bg-indigo-500/10' },
    { type: 'link', label: 'Link', icon: <Link2 className="w-5 h-5" />, color: 'hover:text-blue-500 hover:bg-blue-500/10' },
    { type: 'todo', label: 'To-do', icon: <CheckSquare className="w-5 h-5" />, color: 'hover:text-emerald-500 hover:bg-emerald-500/10' },
    { type: 'board', label: 'Board', icon: <FolderKanban className="w-5 h-5" />, color: 'hover:text-cyan-500 hover:bg-cyan-500/10' },
    { type: 'column', label: 'Column', icon: <Columns className="w-5 h-5" />, color: 'hover:text-slate-700 hover:bg-slate-500/10' },
    { type: 'image', label: 'Image', icon: <ImageIcon className="w-5 h-5" />, color: 'hover:text-purple-500 hover:bg-purple-500/10' },
    { type: 'document', label: 'Document', icon: <FileDown className="w-5 h-5" />, color: 'hover:text-rose-500 hover:bg-rose-500/10' },
    { type: 'sketch', label: 'Draw', icon: <Edit3 className="w-5 h-5" />, color: 'hover:text-pink-500 hover:bg-pink-500/10' },
    { type: 'color', label: 'Color', icon: <Palette className="w-5 h-5" />, color: 'hover:text-violet-500 hover:bg-violet-500/10' },
    { type: 'table', label: 'Table', icon: <TableIcon className="w-5 h-5" />, color: 'hover:text-teal-500 hover:bg-teal-500/10' },
    { type: 'map', label: 'Map', icon: <MapPin className="w-5 h-5" />, color: 'hover:text-red-500 hover:bg-red-500/10' },
    { type: 'comment', label: 'Comment', icon: <MessageSquare className="w-5 h-5" />, color: 'hover:text-amber-600 hover:bg-amber-500/10' },
  ];

  return (
    <>
      <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-2 flex flex-col items-center gap-1.5 transition-all">
        {TOOL_ITEMS.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            onClick={() => handleAddAtCenter(item.type)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 cursor-grab active:cursor-grabbing transition-all ${item.color} group relative`}
            title={`Click or Drag ${item.label} to canvas`}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute left-14 bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Drag or Click {item.label}
            </span>
          </div>
        ))}

        <div className="w-6 h-px bg-slate-200 my-1" />

        {/* Trash Button */}
        <button
          onClick={() => setShowTrashModal(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 relative group transition-all"
          title="Trash"
        >
          <Trash2 className="w-5 h-5" />
          {trash.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
              {trash.length}
            </span>
          )}
          <span className="absolute left-14 bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Trash ({trash.length})
          </span>
        </button>
      </aside>

      {/* Trash Modal */}
      {showTrashModal && <TrashModal onClose={() => setShowTrashModal(false)} />}
    </>
  );
};
