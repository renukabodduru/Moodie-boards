import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import {
  Plus,
  FolderKanban,
  Trash2,
  ArrowRight,
  Clock,
  Layers,
  Search,
  MoreVertical,
  Copy,
  Edit2,
  Star,
} from 'lucide-react';

export const BoardsDashboard: React.FC = () => {
  const {
    boards,
    createBoard,
    deleteBoard,
    setCurrentBoardId,
    setViewMode,
    updateBoard,
    duplicateBoard,
    toggleFavoriteBoard,
    objects,
  } = useBoard();

  const [newBoardName, setNewBoardName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'recent' | 'favorites'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredBoards = boards
    .filter((b) => b.name.toLowerCase().includes(searchFilter.toLowerCase()))
    .filter((b) => selectedCategory === 'all' || (selectedCategory === 'recent' && Date.now() - b.updatedAt < 7 * 24 * 60 * 60 * 1000) || (selectedCategory === 'favorites' && b.isFavorite))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const newId = createBoard(newBoardName.trim());
    setNewBoardName('');
    setShowCreateModal(false);
    setCurrentBoardId(newId);
    setViewMode('canvas');
  };

  const handleOpenBoard = (boardId: string) => {
    setCurrentBoardId(boardId);
    setViewMode('canvas');
  };

  const getObjectCountForBoard = (boardId: string) => {
    return objects.filter((o) => o.boardId === boardId).length;
  };

  return (
    <div className="w-screen h-screen overflow-y-auto bg-premium-canvas font-sans text-premium-black select-none">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-premium px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto cursor-pointer group" onClick={() => setViewMode('landing')}>
          <div className="w-10 h-10 rounded-xl bg-premium-black flex items-center justify-center text-white font-black text-xl shadow-md group-hover:rotate-6 transition-transform">
            M
          </div>
          <div>
            <h1 className="font-bold text-lg text-premium-black tracking-tight">Moodie-Board</h1>
            <p className="text-[10px] text-premium-gray font-mono-tech uppercase tracking-widest">Visual Workspace</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="md:hidden ml-auto p-2 bg-premium-black text-white rounded-lg flex items-center justify-center transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 text-premium-gray absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search workspaces..."
              className="pl-9 pr-4 py-2 bg-white border border-premium text-premium-black text-sm rounded-lg focus:outline-none focus:border-premium-black w-full md:w-64 transition-all"
            />
          </div>

          <button
            onClick={() => setViewMode('landing')}
            className="hidden md:flex px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-premium-black font-medium rounded-lg text-sm items-center transition-all shadow-sm"
          >
            Home
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="hidden md:flex px-4 py-2 bg-premium-black hover:bg-neutral-800 text-white font-medium rounded-lg text-sm items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Board</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-premium-black text-white p-10 mb-12 shadow-premium-elevated border border-neutral-800">
          <div className="relative z-10 max-w-2xl">
            <span className="font-mono-tech text-[10px] text-accent uppercase tracking-widest border border-accent/30 bg-accent/10 px-3 py-1 rounded-full mb-6 inline-block">
              Infinite Canvas
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Organize thoughts, visual media & ideas freely.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed mb-8 font-medium">
              Create unlimited visual boards, arrange cards anywhere on the canvas, connect notes with smart arrows, and sketch freely without boundaries.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white text-premium-black font-bold rounded-lg text-sm flex items-center gap-2 hover:bg-neutral-100 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Start Blank Workspace
            </button>
          </div>
          
          {/* Subtle dot-matrix overlay on right side of banner */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 dot-matrix-bg pointer-events-none [mask-image:linear-gradient(to_left,black,transparent)]" />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-premium pb-6">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-xl text-premium-black tracking-tight">Your Boards</h3>
            <span className="px-2 py-0.5 bg-neutral-200 text-premium-black font-mono-tech text-[10px] rounded">
              {filteredBoards.length}
            </span>
          </div>

          <div className="flex gap-2">
            {(['all', 'recent', 'favorites'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded text-xs font-semibold capitalize transition-all ${
                  selectedCategory === cat ? 'bg-premium-black text-white' : 'bg-transparent text-premium-gray hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Tile */}
          <div
            onClick={() => setShowCreateModal(true)}
            className="h-[220px] rounded-2xl border border-dashed border-neutral-300 hover:border-premium-black bg-transparent hover:bg-neutral-50/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-premium flex items-center justify-center mb-4 group-hover:bg-premium-black group-hover:text-white group-hover:border-premium-black text-premium-gray transition-all shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-premium-black">Create New Board</h4>
            <p className="text-xs text-premium-gray mt-1 font-medium">Start a fresh canvas</p>
          </div>

          {/* Existing Boards */}
          {filteredBoards.map((board) => {
            const count = getObjectCountForBoard(board.id);
            const isHome = board.id === 'home';

            return (
              <div
                key={board.id}
                onClick={() => handleOpenBoard(board.id)}
                className="h-[220px] rounded-2xl bg-white border border-premium p-6 flex flex-col justify-between shadow-premium hover:shadow-premium-elevated hover:-translate-y-1 cursor-pointer group transition-all duration-300 relative overflow-hidden"
              >
                {/* Favorite badge indicator */}
                {board.isFavorite && (
                  <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center">
                    <div className="absolute top-[-16px] right-[-16px] w-12 h-12 bg-accent rotate-45 transform" />
                    <Star className="w-3 h-3 text-white absolute top-1.5 right-1.5 fill-current" />
                  </div>
                )}

                {/* Abstract Preview */}
                <div className="absolute bottom-4 right-4 w-28 h-20 bg-premium-canvas rounded-lg overflow-hidden border border-premium pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
                  <div className="relative w-full h-full scale-[0.25] origin-top-left p-1">
                    {objects.filter(o => o.boardId === board.id).slice(0, 15).map(o => (
                      <div 
                        key={o.id} 
                        className="absolute rounded bg-neutral-300 shadow-sm" 
                        style={{ left: o.x, top: o.y, width: o.width, height: o.height }} 
                      />
                    ))}
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{board.icon || '📋'}</span>
                    
                    {!isHome && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === board.id ? null : board.id);
                          }}
                          className={`p-1 rounded-md transition-all ${
                            openMenuId === board.id 
                              ? 'bg-neutral-100 text-premium-black opacity-100' 
                              : 'text-premium-gray hover:text-premium-black hover:bg-neutral-100 md:opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {openMenuId === board.id && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-premium-elevated border border-premium py-1 animate-in fade-in zoom-in-95 duration-100 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                const newName = prompt('Rename board to:', board.name);
                                if (newName && newName.trim()) updateBoard(board.id, newName.trim());
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-premium-gray hover:bg-neutral-50 hover:text-premium-black flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                toggleFavoriteBoard(board.id);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-premium-gray hover:bg-neutral-50 hover:text-premium-black flex items-center gap-2"
                            >
                              <Star className="w-3.5 h-3.5" /> {board.isFavorite ? 'Unfavorite' : 'Favorite'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                duplicateBoard(board.id);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-premium-gray hover:bg-neutral-50 hover:text-premium-black flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5" /> Duplicate
                            </button>
                            <div className="h-px bg-premium my-1" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                if (confirm(`Delete board "${board.name}"?`)) deleteBoard(board.id);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-accent hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-premium-black truncate">
                    {board.name}
                  </h4>
                  <p className="text-xs text-premium-gray mt-1.5 flex items-center gap-1.5 font-medium">
                    <Layers className="w-3.5 h-3.5" /> {count} items
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-auto">
                  <span className="text-[10px] text-premium-gray flex items-center gap-1.5 font-mono-tech">
                    <Clock className="w-3 h-3" />
                    {new Date(board.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-premium text-premium-black flex items-center justify-center transition-all group-hover:bg-premium-black group-hover:border-premium-black group-hover:text-white group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateBoard}
            className="bg-white rounded-2xl shadow-premium-elevated border border-premium w-full max-w-md p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-premium-canvas border border-premium rounded-lg flex items-center justify-center">
                <FolderKanban className="w-4 h-4 text-premium-black" />
              </div>
              <h3 className="font-bold text-lg text-premium-black tracking-tight">New Workspace</h3>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-mono-tech uppercase text-premium-gray mb-2 tracking-wider">
                Workspace Name
              </label>
              <input
                type="text"
                autoFocus
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="e.g., Q4 Marketing..."
                className="w-full px-4 py-3 bg-premium-canvas border border-premium rounded-lg text-sm font-semibold text-premium-black focus:outline-none focus:border-premium-black focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 hover:bg-neutral-100 text-premium-gray hover:text-premium-black font-semibold rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-premium-black hover:bg-neutral-800 text-white font-bold rounded-lg text-sm shadow-sm transition-colors"
              >
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
