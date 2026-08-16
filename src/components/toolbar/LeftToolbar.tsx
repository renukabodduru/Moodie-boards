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
  Video,
  Music,
  Home,
  MoreHorizontal,
} from 'lucide-react';

export const LeftToolbar: React.FC = () => {
  const { addObject, trash, pan, zoom, setViewMode } = useBoard();
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleAddAtCenter = (type: ObjectType) => {
    const centerX = (window.innerWidth / 2 - pan.x) / zoom - 120;
    const centerY = (window.innerHeight / 2 - pan.y) / zoom - 80;
    addObject(type, centerX, centerY);
    setShowMore(false);
  };

  const handleDragStart = (e: React.DragEvent, type: ObjectType) => {
    e.dataTransfer.setData('application/moodie-card-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const TOOL_ITEMS: Array<{ type: ObjectType; label: string; icon: React.ReactNode; glassClass: string }> = [
    { type: 'note', label: 'Note', icon: <FileText className="w-5 h-5" />, glassClass: 'bg-gradient-to-br from-amber-400/30 to-amber-500/10 text-amber-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'image', label: 'Image', icon: <ImageIcon className="w-5 h-5" />, glassClass: 'bg-gradient-to-br from-emerald-400/30 to-emerald-500/10 text-emerald-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'todo', label: 'To-do', icon: <CheckSquare className="w-5 h-5" />, glassClass: 'bg-gradient-to-br from-blue-400/30 to-blue-500/10 text-blue-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'link', label: 'Link', icon: <Link2 className="w-5 h-5" />, glassClass: 'bg-gradient-to-br from-cyan-400/30 to-cyan-500/10 text-cyan-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'board', label: 'Board', icon: <FolderKanban className="w-5 h-5" />, glassClass: 'bg-gradient-to-br from-purple-400/30 to-purple-500/10 text-purple-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'column', label: 'Column', icon: <Columns className="w-5 h-5" />, glassClass: 'bg-gradient-to-br from-pink-400/30 to-pink-500/10 text-pink-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
  ];

  const MORE_ITEMS: Array<{ type: ObjectType; label: string; icon: React.ReactNode; glassClass: string }> = [
    { type: 'heading', label: 'Heading', icon: <HeadingIcon className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-rose-400/30 to-rose-500/10 text-rose-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'video', label: 'Video', icon: <Video className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-red-400/30 to-red-500/10 text-red-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'audio', label: 'Audio', icon: <Music className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-indigo-400/30 to-indigo-500/10 text-indigo-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'document', label: 'Document', icon: <FileDown className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-sky-400/30 to-sky-500/10 text-sky-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'sketch', label: 'Draw', icon: <Edit3 className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-fuchsia-400/30 to-fuchsia-500/10 text-fuchsia-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'color', label: 'Color', icon: <Palette className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-orange-400/30 to-orange-500/10 text-orange-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'table', label: 'Table', icon: <TableIcon className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-teal-400/30 to-teal-500/10 text-teal-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'map', label: 'Map', icon: <MapPin className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-lime-500/30 to-lime-600/10 text-lime-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
    { type: 'comment', label: 'Comment', icon: <MessageSquare className="w-4 h-4" />, glassClass: 'bg-gradient-to-br from-yellow-400/30 to-yellow-500/10 text-yellow-600 border border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]' },
  ];

  return (
    <>
      <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-4 md:top-1/2 md:-translate-y-1/2 md:-translate-x-0 md:bottom-auto z-40 bg-[#f4f5f7] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-3 flex flex-row md:flex-col items-center gap-1 transition-all w-[calc(100vw-2rem)] md:w-auto max-w-full md:max-h-[calc(100vh-2rem)]">
        
        {/* Dashboard Home Button */}
        <button
          onClick={() => setViewMode('dashboard')}
          className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-slate-800 bg-transparent hover:bg-[#f4f5f7] hover:shadow-[3px_3px_8px_#d1d5db,-3px_-3px_8px_#ffffff,inset_1px_1px_2px_#ffffff] transition-all duration-200 group relative"
          title="Back to Dashboard"
        >
          <Home className="w-5 h-5" />
          <span className="hidden md:block absolute left-16 bg-[#f4f5f7] shadow-[2px_2px_8px_#d1d5db,-2px_-2px_8px_#ffffff] text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Dashboard
          </span>
        </button>
        
        <div className="w-px h-6 md:w-6 md:h-px bg-slate-300/60 mx-1 md:mx-0 md:my-2 shrink-0" />

        <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto overflow-x-auto md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-1 px-1">
          {TOOL_ITEMS.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              onClick={() => handleAddAtCenter(item.type)}
              className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing group relative transition-all duration-300 hover:scale-110 hover:-translate-y-1 backdrop-blur-md ${item.glassClass}`}
            >
              <div className="drop-shadow-md transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12">
                {item.icon}
              </div>

              {/* Tooltip */}
              <span className="hidden md:block absolute left-16 bg-[#f4f5f7] shadow-[2px_2px_8px_#d1d5db,-2px_-2px_8px_#ffffff] text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Drag or Click {item.label}
              </span>
            </div>
          ))}

          {/* More Menu Toggle */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMore(!showMore)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                showMore 
                  ? 'bg-[#f4f5f7] shadow-[3px_3px_8px_#d1d5db,-3px_-3px_8px_#ffffff,inset_1px_1px_2px_#ffffff] text-slate-900' 
                  : 'text-slate-800 bg-transparent hover:bg-[#f4f5f7] hover:shadow-[3px_3px_8px_#d1d5db,-3px_-3px_8px_#ffffff,inset_1px_1px_2px_#ffffff]'
              } group relative`}
            >
              <MoreHorizontal className="w-5 h-5" />
              {!showMore && (
                <span className="hidden md:block absolute left-16 bg-[#f4f5f7] shadow-[2px_2px_8px_#d1d5db,-2px_-2px_8px_#ffffff] text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  More Tools
                </span>
              )}
            </button>

            {/* More Menu Dropdown */}
            {showMore && (
              <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:absolute md:-translate-x-0 md:left-[4.5rem] md:bottom-0 bg-[#f4f5f7] shadow-[0_10px_40px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] border border-white rounded-[2rem] p-3 flex flex-col gap-1 w-44 animate-in fade-in zoom-in-95 duration-200 z-50">
                {MORE_ITEMS.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.type)}
                    onClick={() => handleAddAtCenter(item.type)}
                    className="w-full px-2 py-2 rounded-2xl flex items-center gap-3 cursor-grab active:cursor-grabbing hover:bg-[#f4f5f7] hover:shadow-[3px_3px_8px_#d1d5db,-3px_-3px_8px_#ffffff,inset_1px_1px_2px_#ffffff] transition-all duration-200 group/more text-slate-800"
                  >
                    <div className={`w-8 h-8 shrink-0 rounded-[10px] flex items-center justify-center backdrop-blur-md ${item.glassClass} border border-white/50 shadow-sm`}>
                      <div className="drop-shadow-md transition-transform duration-300 ease-out group-hover/more:scale-125 group-hover/more:-rotate-12">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-px h-6 md:w-6 md:h-px bg-slate-300/60 mx-1 md:mx-0 md:my-2 shrink-0" />

        {/* Trash Button */}
        <button
          onClick={() => setShowTrashModal(true)}
          className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-slate-800 bg-transparent hover:text-red-500 hover:bg-[#f4f5f7] hover:shadow-[3px_3px_8px_#d1d5db,-3px_-3px_8px_#ffffff,inset_1px_1px_2px_#ffffff] transition-all duration-200 relative group"
        >
          <Trash2 className="w-5 h-5" />
          {trash.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white border border-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
              {trash.length}
            </span>
          )}
          <span className="hidden md:block absolute left-16 bg-[#f4f5f7] shadow-[2px_2px_8px_#d1d5db,-2px_-2px_8px_#ffffff] text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            Trash ({trash.length})
          </span>
        </button>
      </aside>

      {/* Trash Modal */}
      {showTrashModal && <TrashModal onClose={() => setShowTrashModal(false)} />}
    </>
  );
};
