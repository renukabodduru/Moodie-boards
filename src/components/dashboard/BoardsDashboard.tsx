import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { Board } from '../../types/board';
import {
  Plus,
  FolderKanban,
  Trash2,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  LayoutGrid,
  Search,
  BookOpen,
} from 'lucide-react';

export const BoardsDashboard: React.FC = () => {
  const {
    boards,
    createBoard,
    deleteBoard,
    setCurrentBoardId,
    setViewMode,
    objects,
    applyTemplate,
  } = useBoard();

  const [newBoardName, setNewBoardName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'recent'>('all');

  const filteredBoards = boards.filter((b) =>
    b.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

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
    <div className="w-screen h-screen overflow-y-auto bg-slate-50 font-sans text-slate-900 select-none">
      {/* Top Dashboard Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            M
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-900 tracking-tight">Moodie-Board</h1>
            <p className="text-xs text-slate-500 font-medium">Personal Infinite Visual Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search your boards..."
              className="pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Board</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-8 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 bg-white/10 text-indigo-300 text-xs font-extrabold uppercase rounded-full tracking-wider border border-white/10 mb-3 inline-block">
              ✨ Infinite Creative Wall
            </span>
            <h2 className="text-3xl font-black tracking-tight mb-2">
              Organize thoughts, visual media & ideas freely.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Create unlimited visual boards, arrange cards anywhere on the canvas, connect notes with smart arrows, and sketch freely.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-white text-indigo-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-xl hover:bg-indigo-50 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 text-indigo-600" /> Start Blank Workspace
            </button>
          </div>

          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-32 top-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Boards Grid Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-xl text-slate-900">Your Boards</h3>
            <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 font-extrabold text-xs rounded-full">
              {filteredBoards.length}
            </span>
          </div>
        </div>

        {/* Boards Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Board Card Tile */}
          <div
            onClick={() => setShowCreateModal(true)}
            className="h-56 rounded-3xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white/60 hover:bg-indigo-50/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
              Create New Board
            </h4>
            <p className="text-xs text-slate-400 mt-1">Start a fresh infinite canvas</p>
          </div>

          {/* Existing Boards */}
          {filteredBoards.map((board) => {
            const count = getObjectCountForBoard(board.id);
            const isHome = board.id === 'home';

            return (
              <div
                key={board.id}
                onClick={() => handleOpenBoard(board.id)}
                className="h-56 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-500/60 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl cursor-pointer group transition-all duration-200 relative overflow-hidden"
              >
                {/* Decorative Top Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{board.icon || '📋'}</span>
                    {!isHome && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete board "${board.name}"?`)) {
                            deleteBoard(board.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete Board"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h4 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {board.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" /> {count} canvas objects
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(board.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Create New Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateBoard}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-lg text-slate-900">Create New Workspace Board</h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                Board Name
              </label>
              <input
                type="text"
                autoFocus
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="e.g., Marketing Campaign 2026..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Create & Open Board
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
