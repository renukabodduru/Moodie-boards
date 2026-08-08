import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { Trash2, RotateCcw, X, AlertTriangle } from 'lucide-react';

export const TrashModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { trash, restoreFromTrash, permanentlyDeleteTrash, emptyTrash } = useBoard();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-lg text-slate-800">Workspace Trash</h3>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              {trash.length} items
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trash Content List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3">
          {trash.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Trash2 className="w-12 h-12 stroke-1 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Trash is empty</p>
            </div>
          ) : (
            trash.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    {item.type}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 truncate max-w-xs">
                    {item.content.title || item.content.text || item.content.hex || `${item.type} card`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => restoreFromTrash(item.id)}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore
                  </button>
                  <button
                    onClick={() => permanentlyDeleteTrash(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete permanently"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {trash.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-400">Deleted cards can be restored anytime</span>
            <button
              onClick={emptyTrash}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Empty Trash
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
