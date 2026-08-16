import React, { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { Plus, Trash2, Table as TableIcon } from 'lucide-react';

export const TableCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [headers, setHeaders] = useState<string[]>(object.content.headers || ['Name', 'Status', 'Owner']);
  const [rows, setRows] = useState<string[][]>(
    object.content.rows || [
      ['Script writing', 'Done', 'Team'],
      ['Storyboard mockup', 'Working', 'Team'],
    ]
  );

  const updateTableData = (newHeaders: string[], newRows: string[][]) => {
    setHeaders(newHeaders);
    setRows(newRows);
    updateObject(object.id, { content: { ...object.content, headers: newHeaders, rows: newRows } });
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const resizeCard = () => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      const scrollHeight = contentRef.current.scrollHeight;
      const minHeight = 150;
      const targetHeight = Math.max(minHeight, scrollHeight + 10);
      
      contentRef.current.style.height = '100%';

      if (targetHeight !== object.height) {
        updateObject(object.id, { height: targetHeight });
      }
    }
  };

  useEffect(() => {
    resizeCard();
  }, [rows, headers]);

  const addRow = () => {
    const newRow = new Array(headers.length).fill('Cell');
    updateTableData(headers, [...rows, newRow]);
  };

  const addColumn = () => {
    const newHeaders = [...headers, 'Header'];
    const newRows = rows.map((r) => [...r, 'Data']);
    updateTableData(newHeaders, newRows);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-x-auto" ref={contentRef}>
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-200">
            {headers.map((h, colIdx) => (
              <th key={colIdx} className="p-1.5 font-bold text-slate-700">
                <input
                  type="text"
                  value={h}
                  onChange={(e) => {
                    const next = [...headers];
                    next[colIdx] = e.target.value;
                    updateTableData(next, rows);
                  }}
                  className="bg-transparent focus:outline-none w-full"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50">
              {row.map((cell, colIdx) => (
                <td key={colIdx} className="p-1.5">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => {
                      const nextRows = rows.map((r, rI) =>
                        rI === rowIdx ? r.map((c, cI) => (cI === colIdx ? e.target.value : c)) : r
                      );
                      updateTableData(headers, nextRows);
                    }}
                    className="bg-transparent focus:outline-none w-full text-slate-700"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
        <button
          onClick={addRow}
          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Row
        </button>
        <button
          onClick={addColumn}
          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Column
        </button>
      </div>
    </div>
  );
};
