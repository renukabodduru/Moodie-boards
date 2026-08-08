import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { LineStyle, StrokePattern } from '../../types/board';
import {
  Trash2,
  ArrowRight,
  ArrowLeftRight,
  Minus,
  Sparkles,
  Type,
  Maximize2,
} from 'lucide-react';

export const LineEditorBar: React.FC = () => {
  const { selectedLineId, boardConnections, updateConnection, deleteConnection, setSelectedLineId } = useBoard();

  if (!selectedLineId) return null;

  const conn = boardConnections.find((c) => c.id === selectedLineId);
  if (!conn) return null;

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#000000', '#ef4444'];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Line Tools</span>
      <div className="w-px h-5 bg-slate-700" />

      {/* Color Swatches */}
      <div className="flex items-center gap-1.5">
        {COLORS.map((col) => (
          <button
            key={col}
            onClick={() => updateConnection(conn.id, { color: col })}
            className={`w-5 h-5 rounded-full border border-white/20 transition-transform ${
              conn.color === col ? 'scale-125 ring-2 ring-indigo-400' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: col }}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-slate-700" />

      {/* Line Type (Straight / Curved / Elbow) */}
      <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
        {(['straight', 'curved', 'elbow'] as LineStyle[]).map((st) => (
          <button
            key={st}
            onClick={() => updateConnection(conn.id, { lineStyle: st })}
            className={`px-2 py-1 rounded text-xs font-medium capitalize transition-colors ${
              conn.lineStyle === st ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-slate-700" />

      {/* Stroke Pattern (Solid / Dashed / Dotted) */}
      <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
        {(['solid', 'dashed', 'dotted'] as StrokePattern[]).map((pat) => (
          <button
            key={pat}
            onClick={() => updateConnection(conn.id, { strokePattern: pat })}
            className={`px-2 py-1 rounded text-xs font-medium capitalize transition-colors ${
              conn.strokePattern === pat ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {pat}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-slate-700" />

      {/* Arrow Toggles */}
      <button
        onClick={() => updateConnection(conn.id, { arrowEnd: !conn.arrowEnd })}
        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
          conn.arrowEnd ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'border-slate-700 text-slate-400 hover:bg-slate-800'
        }`}
        title="Toggle Arrowhead at End"
      >
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Label Edit Input */}
      <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1 border border-slate-700">
        <Type className="w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={conn.label || ''}
          onChange={(e) => updateConnection(conn.id, { label: e.target.value })}
          placeholder="Add label..."
          className="bg-transparent text-xs text-white focus:outline-none w-24 placeholder-slate-500"
        />
      </div>

      <div className="w-px h-5 bg-slate-700" />

      {/* Delete Connection */}
      <button
        onClick={() => {
          deleteConnection(conn.id);
          setSelectedLineId(null);
        }}
        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        title="Delete Connection Line"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
