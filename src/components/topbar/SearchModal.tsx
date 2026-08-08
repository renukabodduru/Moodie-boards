import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { Search, X, Tag, FileText, Globe, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { objects, setSelectedIds, setPan, zoom } = useBoard();
  const [query, setQuery] = useState('');

  const filteredObjects = query.trim()
    ? objects.filter((o) => {
        const q = query.toLowerCase();
        const text = o.content.text?.toLowerCase() || '';
        const title = o.content.title?.toLowerCase() || '';
        const url = o.content.url?.toLowerCase() || '';
        return text.includes(q) || title.includes(q) || url.includes(q) || o.type.includes(q);
      })
    : [];

  const handleJumpToObject = (obj: any) => {
    setSelectedIds([obj.id]);
    setPan({
      x: window.innerWidth / 2 - obj.x * zoom,
      y: window.innerHeight / 2 - obj.y * zoom,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, headings, links, checklists, tags..."
            className="w-full text-base font-semibold text-slate-800 bg-transparent focus:outline-none placeholder-slate-400"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {query.trim() && filteredObjects.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching objects found for "{query}"
            </div>
          )}

          {filteredObjects.map((obj) => (
            <div
              key={obj.id}
              onClick={() => handleJumpToObject(obj)}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase rounded-lg">
                  {obj.type}
                </span>
                <span className="text-sm font-bold text-slate-800 truncate">
                  {obj.content.title || obj.content.text || obj.content.url || `${obj.type} object`}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
