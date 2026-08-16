import React, { useEffect } from 'react';
import { BoardProvider, useBoard } from './context/BoardContext';

import { TopBar } from './components/topbar/TopBar';
import { LeftToolbar } from './components/toolbar/LeftToolbar';
import { Canvas } from './components/canvas/Canvas';
import { LineEditorBar } from './components/controls/LineEditorBar';
import { ZoomControls } from './components/controls/ZoomControls';
import { BoardsDashboard } from './components/dashboard/BoardsDashboard';
import { CommandPalette } from './components/CommandPalette';
import { LandingPage } from './components/landing/LandingPage';

const MainLayout: React.FC = () => {
  const {
    viewMode,
    undo,
    redo,
    selectedIds,
    deleteSelectedObjects,
    clearSelection,
    duplicateSelectedObjects,
    copySelectedObjects,
    pasteObjects,
    selectedLineId,
    deleteConnection,
  } = useBoard();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        clearSelection();
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          deleteSelectedObjects();
        } else if (selectedLineId) {
          deleteConnection(selectedLineId);
        }
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          if (e.shiftKey) {
            e.preventDefault();
            redo();
          } else {
            e.preventDefault();
            undo();
          }
        }
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          duplicateSelectedObjects();
        }
        if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          copySelectedObjects();
        }
        if (e.key.toLowerCase() === 'v') {
          e.preventDefault();
          pasteObjects();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedIds, deleteSelectedObjects, duplicateSelectedObjects, clearSelection, copySelectedObjects, pasteObjects, selectedLineId, deleteConnection]);

  if (viewMode === 'landing') {
    return <LandingPage />;
  }

  if (viewMode === 'dashboard') {
    return <BoardsDashboard />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col relative font-sans text-slate-900 antialiased bg-slate-50">
      {/* Top Bar Navigation */}
      <TopBar />

      {/* Main Workspace Canvas Container */}
      <main className="flex-1 w-full h-full relative pt-16">
        <LeftToolbar />
        <Canvas />
        <LineEditorBar />
        <ZoomControls />
        <CommandPalette />
      </main>
    </div>
  );
};

export function App() {
  return (
    <BoardProvider>
      <MainLayout />
    </BoardProvider>
  );
}

export default App;
