import React from 'react';
import { useBoard } from '../../context/BoardContext';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Undo2,
  Redo2,
  ChevronDown,
} from 'lucide-react';

export const ZoomControls: React.FC = () => {
  const {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    fitBoardToView,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBoard();

  const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1.0, 1.25, 2.0, 4.0];
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-1.5 flex items-center gap-1.5 text-slate-700 select-none">
      {/* Undo & Redo */}
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`p-2 rounded-xl transition-colors ${
          canUndo ? 'hover:bg-slate-100 text-slate-700' : 'text-slate-300 cursor-not-allowed'
        }`}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className={`p-2 rounded-xl transition-colors ${
          canRedo ? 'hover:bg-slate-100 text-slate-700' : 'text-slate-300 cursor-not-allowed'
        }`}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200" />

      {/* Fit Board to View */}
      <button
        onClick={fitBoardToView}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
        title="Fit Board to View"
      >
        <Maximize className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={zoomOut}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Preset Zoom Selector */}
      <div className="relative group">
        <button className="px-2.5 py-1 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1">
          <span>{zoomPercent}%</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        <div className="absolute bottom-10 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 hidden group-hover:block min-w-[90px] z-50">
          {ZOOM_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setZoom(preset)}
              className={`w-full px-3 py-1 text-xs text-left font-semibold hover:bg-indigo-50 ${
                Math.round(preset * 100) === zoomPercent ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
              }`}
            >
              {Math.round(preset * 100)}%
            </button>
          ))}
        </div>
      </div>

      {/* Zoom In */}
      <button
        onClick={zoomIn}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Reset Zoom */}
      <button
        onClick={resetZoom}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
        title="Reset Zoom (100%)"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
