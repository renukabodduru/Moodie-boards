import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { exportToJSON, downloadMarkdownFile, exportCanvasToImage } from '../../utils/export';
import { Download, FileText, Image as ImageIcon, Code, X } from 'lucide-react';

export const ExportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeBoard, boardObjects, boardConnections } = useBoard();

  const handleExportPNG = () => {
    const canvasEl = document.querySelector('.canvas-bg-layer') as HTMLElement;
    if (canvasEl) {
      exportCanvasToImage(canvasEl, `${activeBoard.name.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      alert('Exporting canvas image...');
    }
    onClose();
  };

  const handleExportMarkdown = () => {
    downloadMarkdownFile(activeBoard, boardObjects);
    onClose();
  };

  const handleExportJSON = () => {
    exportToJSON(activeBoard, boardObjects, boardConnections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-lg text-slate-800">Export Board</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <button
            onClick={handleExportPNG}
            className="w-full p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-3 text-left group transition-all"
          >
            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Export as High-Res PNG</h4>
              <p className="text-xs text-slate-500">Rasterize canvas bounding box & connections</p>
            </div>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-3 text-left group transition-all"
          >
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Export as Markdown (.md)</h4>
              <p className="text-xs text-slate-500">Formatted text notes, headings & checklists</p>
            </div>
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center gap-3 text-left group transition-all"
          >
            <div className="p-3 bg-purple-600 text-white rounded-xl shadow-md">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Export Workspace JSON</h4>
              <p className="text-xs text-slate-500">Full backup of objects, geometry & anchor lines</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
