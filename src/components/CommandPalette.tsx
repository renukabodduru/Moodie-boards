import React, { useState, useEffect, useRef } from 'react';
import { useBoard } from '../context/BoardContext';
import { Search, PlusSquare, Link2, ZoomIn, ZoomOut, Maximize, Network, Type, Image as ImageIcon } from 'lucide-react';
import { CanvasObject } from '../types/board';

export const CommandPalette: React.FC = () => {
  const {
    boardObjects,
    addObject,
    setPan,
    zoom,
    zoomIn,
    zoomOut,
    fitBoardToView,
    selectedIds,
    groupSelectedObjects,
    ungroupSelectedObjects,
    setSelectedIds,
  } = useBoard();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const searchResults = query
    ? boardObjects.filter((obj) => {
        const text = JSON.stringify(obj.content || {}).toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : [];

  const actions = [
    {
      id: 'create-note',
      label: 'Create Note',
      icon: <Type className="w-4 h-4 text-slate-400" />,
      run: () => {
        addObject('note', window.innerWidth / 2, window.innerHeight / 2);
      },
    },
    {
      id: 'create-todo',
      label: 'Create To-do',
      icon: <PlusSquare className="w-4 h-4 text-slate-400" />,
      run: () => {
        addObject('todo', window.innerWidth / 2, window.innerHeight / 2);
      },
    },
    {
      id: 'fit-canvas',
      label: 'Fit Canvas',
      icon: <Maximize className="w-4 h-4 text-slate-400" />,
      run: () => {
        fitBoardToView();
      },
    },
    {
      id: 'zoom-in',
      label: 'Zoom In',
      icon: <ZoomIn className="w-4 h-4 text-slate-400" />,
      run: () => {
        zoomIn();
      },
    },
    {
      id: 'zoom-out',
      label: 'Zoom Out',
      icon: <ZoomOut className="w-4 h-4 text-slate-400" />,
      run: () => {
        zoomOut();
      },
    },
  ];

  if (selectedIds.length > 1) {
    actions.unshift({
      id: 'group-objects',
      label: 'Group / Ungroup Selected',
      icon: <Network className="w-4 h-4 text-slate-400" />,
      run: () => {
        const allGrouped = selectedIds.every((id) => {
          const obj = boardObjects.find((o) => o.id === id);
          return obj?.groupId;
        });
        if (allGrouped) {
          ungroupSelectedObjects();
        } else {
          groupSelectedObjects();
        }
      },
    });
  }

  const items = query ? searchResults : actions;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, items.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    }
    if (e.key === 'Enter' && items.length > 0) {
      e.preventDefault();
      const selected = items[selectedIndex];
      if (query) {
        // It's a search result
        const obj = selected as CanvasObject;
        setPan({
          x: window.innerWidth / 2 - obj.x * zoom - obj.width / 2,
          y: window.innerHeight / 2 - obj.y * zoom - obj.height / 2,
        });
        setSelectedIds([obj.id]);
      } else {
        // It's an action
        (selected as any).run();
      }
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-neutral-900/30 backdrop-blur-md flex items-start justify-center pt-[15vh] animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="glass-panel shadow-apple-elevated w-full max-w-xl rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search cards or type a command..."
            className="flex-1 bg-transparent border-none outline-none text-slate-800 text-lg placeholder-slate-400"
          />
          <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            ESC
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm">No results found.</div>
          )}

          {items.map((item, index) => {
            const isSearchResult = !!query;
            const isSelected = index === selectedIndex;
            return (
              <div
                key={isSearchResult ? (item as CanvasObject).id : (item as any).id}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  if (isSearchResult) {
                    const obj = item as CanvasObject;
                    setPan({
                      x: window.innerWidth / 2 - obj.x * zoom - obj.width / 2,
                      y: window.innerHeight / 2 - obj.y * zoom - obj.height / 2,
                    });
                    setSelectedIds([obj.id]);
                  } else {
                    (item as any).run();
                  }
                  setIsOpen(false);
                }}
                className={`
                  flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors
                  ${isSelected ? 'bg-indigo-50 text-indigo-900' : 'text-slate-700 hover:bg-slate-50'}
                `}
              >
                {isSearchResult ? (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">
                        {(item as CanvasObject).type}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {(item as CanvasObject).content.title ||
                          (item as CanvasObject).content.text ||
                          `Untitled ${(item as CanvasObject).type}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 flex items-center justify-center mr-2">
                      {(item as any).icon}
                    </div>
                    <span className="text-sm font-medium">{(item as any).label}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
