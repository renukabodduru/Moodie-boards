import React, { useEffect } from 'react';
import { BoardProvider, useBoard } from './context/BoardContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { TopBar } from './components/topbar/TopBar';
import { LeftToolbar } from './components/toolbar/LeftToolbar';
import { Canvas } from './components/canvas/Canvas';
import { LineEditorBar } from './components/controls/LineEditorBar';
import { ZoomControls } from './components/controls/ZoomControls';
import { BoardsDashboard } from './components/dashboard/BoardsDashboard';
import { CommandPalette } from './components/CommandPalette';

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

const AppContent: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <BoardProvider>
      <MainLayout />
    </BoardProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
