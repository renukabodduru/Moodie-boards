import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { INITIAL_TEMPLATES } from '../../utils/storage';
import { Layout, Sparkles, X, Plus } from 'lucide-react';

export const TemplateModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { applyTemplate } = useBoard();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-lg text-slate-800">Template Library</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {INITIAL_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                applyTemplate(tmpl.id);
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-500 hover:shadow-xl cursor-pointer group transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-full h-2 shadow-sm rounded-full mb-3"
                  style={{ backgroundColor: tmpl.previewColor }}
                />
                <span className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider">
                  {tmpl.category}
                </span>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {tmpl.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tmpl.description}</p>
              </div>

              <button className="mt-4 w-full py-2 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-md transition-colors">
                <Plus className="w-4 h-4" /> Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
