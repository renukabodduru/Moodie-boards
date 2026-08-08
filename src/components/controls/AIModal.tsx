import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { aiOrganizeLayout, aiSummarizeNotes, aiGenerateMindmap } from '../../utils/ai';
import { Sparkles, LayoutGrid, FileText, GitBranch, X, Check } from 'lucide-react';

export const AIModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { boardObjects, setObjects, setConnections, currentBoardId, addObject } = useBoard();
  const [mindmapPrompt, setMindmapPrompt] = useState('');
  const [summaryOutput, setSummaryOutput] = useState<string | null>(null);

  const handleAIOrganize = () => {
    const organized = aiOrganizeLayout(boardObjects);
    setObjects((prev) =>
      prev.map((o) => {
        const found = organized.find((org) => org.id === o.id);
        return found || o;
      })
    );
    onClose();
  };

  const handleAISummarize = () => {
    const summary = aiSummarizeNotes(boardObjects);
    setSummaryOutput(summary);
  };

  const handleAddSummaryCard = () => {
    if (summaryOutput) {
      addObject('note', 200, 200, { text: summaryOutput });
      onClose();
    }
  };

  const handleAIGenerateMindmap = () => {
    if (!mindmapPrompt.trim()) return;
    const { objects: newObjs, connections: newConns } = aiGenerateMindmap(
      mindmapPrompt,
      currentBoardId,
      500,
      350
    );

    setObjects((prev) => [...prev, ...newObjs]);
    setConnections((prev) => [...prev, ...newConns]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 animate-spin-slow" />
            <h3 className="font-extrabold text-lg text-slate-900">AI Workspace Superpowers</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Action 1: AI Auto Organize */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">AI Auto-Organize Layout</h4>
                <p className="text-xs text-slate-500">Auto-align scattered cards into structured grid columns</p>
              </div>
            </div>
            <button
              onClick={handleAIOrganize}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Organize
            </button>
          </div>

          {/* Action 2: AI Summarize Notes */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-600 text-white rounded-xl shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">AI Summarizer</h4>
                  <p className="text-xs text-slate-500">Synthesize text notes into 10 key takeaways</p>
                </div>
              </div>
              <button
                onClick={handleAISummarize}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Summarize
              </button>
            </div>

            {summaryOutput && (
              <div className="p-3 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 space-y-2">
                <pre className="whitespace-pre-wrap font-sans">{summaryOutput}</pre>
                <button
                  onClick={handleAddSummaryCard}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Place Summary Card on Canvas
                </button>
              </div>
            )}
          </div>

          {/* Action 3: AI Mindmap Generator */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-600 text-white rounded-xl shadow-md">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">AI Mindmap & Storyboard Generator</h4>
                <p className="text-xs text-slate-500">Generate connected visual cards from topic prompt</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={mindmapPrompt}
                onChange={(e) => setMindmapPrompt(e.target.value)}
                placeholder="e.g., Cyberpunk Short Film Concept..."
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold"
              />
              <button
                onClick={handleAIGenerateMindmap}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
