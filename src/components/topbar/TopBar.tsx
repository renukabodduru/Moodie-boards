import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { SearchModal } from './SearchModal';
import { ExportModal } from './ExportModal';
import { TemplateModal } from './TemplateModal';
import { AIModal } from '../controls/AIModal';
import {
  Sparkles,
  Search,
  Download,
  Layout,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  Grid,
  Trash2,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activeBoard,
    breadcrumbTrail,
    setCurrentBoardId,
    setViewMode,
    saveStatus,
    deleteBoard,
  } = useBoard();

  const [showSearch, setShowSearch] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAI, setShowAI] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 glass-panel border-b border-white/60 px-3 md:px-6 flex items-center justify-between shadow-[0_4px_20px_rgba(31,38,135,0.03)] select-none gap-2">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Back to All Boards Dashboard Button */}
          <button
            onClick={() => setViewMode('dashboard')}
            className="px-2 md:px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
            title="Go to Boards Dashboard"
          >
            <Grid className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Boards</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Breadcrumb Trail */}
          <nav className="hidden sm:flex items-center gap-1 text-sm font-semibold max-w-[200px] md:max-w-md overflow-hidden whitespace-nowrap">
            {breadcrumbTrail.map((board, idx) => (
              <React.Fragment key={board.id}>
                {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                <button
                  onClick={() => setCurrentBoardId(board.id)}
                  className={`px-2.5 py-1 rounded-xl transition-colors truncate max-w-[120px] ${
                    board.id === activeBoard.id
                      ? 'bg-indigo-50 text-indigo-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {board.name}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Middle Status & AI Trigger */}
        <div className="flex items-center gap-2 md:gap-3 justify-center shrink">
          <button
            onClick={() => setShowAI(true)}
            className="px-4 py-2 pill-button text-primary-text font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shrink-0 transition-transform hover:-translate-y-[2px]"
            title="AI Superpowers"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow text-accent" />
            <span className="hidden lg:inline">AI Superpowers</span>
            <span className="hidden sm:inline lg:hidden">AI</span>
          </button>

          <button
            onClick={() => setShowSearch(true)}
            className="px-2.5 md:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 shrink-0"
            title="Search workspace (Ctrl+F)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search workspace...</span>
            <kbd className="hidden md:block bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono border border-slate-200">
              Ctrl+F
            </kbd>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Autosave Status */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            {saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="hidden lg:inline">Saved</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="hidden lg:inline">Saving...</span>
              </>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Delete Active Board */}
          {activeBoard.id !== 'home' && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete board "${activeBoard.name}"?`)) {
                  deleteBoard(activeBoard.id);
                }
              }}
              className="px-2.5 md:px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Delete this board"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Delete</span>
            </button>
          )}

          {/* Templates Library */}
          <button
            onClick={() => setShowTemplates(true)}
            className="px-2.5 md:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Templates"
          >
            <Layout className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Templates</span>
          </button>

          {/* Export Board */}
          <button
            onClick={() => setShowExport(true)}
            className="px-4 py-2 pill-button text-primary-text font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-transform hover:-translate-y-[2px]"
            title="Export"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </header>

      {/* Popups & Modals */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      {showTemplates && <TemplateModal onClose={() => setShowTemplates(false)} />}
      {showAI && <AIModal onClose={() => setShowAI(false)} />}
    </>
  );
};
