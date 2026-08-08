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
  FolderKanban,
  Grid,
  ArrowLeft,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activeBoard,
    breadcrumbTrail,
    setCurrentBoardId,
    setViewMode,
    saveStatus,
  } = useBoard();

  const [showSearch, setShowSearch] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAI, setShowAI] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/85 backdrop-blur-lg border-b border-slate-200/80 px-6 flex items-center justify-between shadow-sm select-none">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Back to All Boards Dashboard Button */}
          <button
            onClick={() => setViewMode('dashboard')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
            title="Go to Boards Dashboard"
          >
            <Grid className="w-4 h-4 text-indigo-600" />
            <span>Boards</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* Breadcrumb Trail */}
          <nav className="flex items-center gap-1 text-sm font-semibold">
            {breadcrumbTrail.map((board, idx) => (
              <React.Fragment key={board.id}>
                {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
                <button
                  onClick={() => setCurrentBoardId(board.id)}
                  className={`px-2.5 py-1 rounded-xl transition-colors ${
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAI(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>AI Superpowers</span>
          </button>

          <button
            onClick={() => setShowSearch(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search workspace...</span>
            <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono border border-slate-200">
              Ctrl+F
            </kbd>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Autosave Status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            {saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                <span>Saving...</span>
              </>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200" />

          {/* Templates Library */}
          <button
            onClick={() => setShowTemplates(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Layout className="w-4 h-4 text-indigo-600" />
            <span>Templates</span>
          </button>

          {/* Export Board */}
          <button
            onClick={() => setShowExport(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
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
