import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { FileText, Download, Upload } from 'lucide-react';

export const DocumentCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [fileName, setFileName] = useState<string>(object.content.fileName || 'Project-Spec.pdf');
  const [fileUrl, setFileUrl] = useState<string>(object.content.fileUrl || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setFileUrl(src);
      setFileName(file.name);
      updateObject(object.id, { content: { ...object.content, fileUrl: src, fileName: file.name } });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              updateObject(object.id, { content: { ...object.content, fileName: e.target.value } });
            }}
            className="font-bold text-xs bg-transparent focus:outline-none text-premium-black w-full truncate"
          />
          <span className="text-[10px] text-neutral-400">PDF / Document File</span>
        </div>
      </div>

      {fileUrl ? (
        <a
          href={fileUrl}
          download={fileName}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download File
        </a>
      ) : (
        <label className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 bg-neutral-100 hover:bg-premium-canvas text-premium-black rounded-xl text-xs font-medium cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" /> Select Document
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      )}
    </div>
  );
};
