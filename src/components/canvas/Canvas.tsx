import React, { useRef, useState, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasGrid } from './CanvasGrid';
import { SVGConnectionLayer } from './SVGConnectionLayer';
import { MarqueeSelect } from './MarqueeSelect';
import { BaseCard } from '../cards/BaseCard';
import { NoteCard } from '../cards/NoteCard';
import { HeadingCard } from '../cards/HeadingCard';
import { LinkCard } from '../cards/LinkCard';
import { TodoCard } from '../cards/TodoCard';
import { ImageCard } from '../cards/ImageCard';
import { VideoCard } from '../cards/VideoCard';
import { AudioCard } from '../cards/AudioCard';
import { DocumentCard } from '../cards/DocumentCard';
import { BoardCard } from '../cards/BoardCard';
import { ColumnCard } from '../cards/ColumnCard';
import { TableCard } from '../cards/TableCard';
import { ColorCard } from '../cards/ColorCard';
import { MapCard } from '../cards/MapCard';
import { SketchCard } from '../cards/SketchCard';
import { CommentCard } from '../cards/CommentCard';
import { screenToCanvas, getNearestAnchor } from '../../utils/geometry';
import { ObjectType } from '../../types/board';

export const Canvas: React.FC = () => {
  const {
    boardObjects,
    addObject,
    clearSelection,
    pan,
    setPan,
    zoom,
    setZoom,
    selectObjectsInRect,
    draggingConnection,
    updateDraggingConnection,
    cancelDraggingConnection,
    finishDraggingConnection,
    userPresences,
    activeGuides,
    deleteSelectedObjects,
    duplicateSelectedObjects,
    groupSelectedObjects,
    ungroupSelectedObjects,
    copySelectedObjects,
    pasteObjects,
    undo,
    redo,
    selectedIds,
    lockObject,
  } = useBoard();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [marqueeRect, setMarqueeRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const marqueeStartRef = useRef<{ x: number; y: number } | null>(null);

  const [spacePressed, setSpacePressed] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.code === 'Space' && !e.repeat) {
        setSpacePressed(true);
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedObjects();
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'c') {
          copySelectedObjects();
        } else if (e.key.toLowerCase() === 'v') {
          pasteObjects();
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          duplicateSelectedObjects();
        } else if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          if (e.shiftKey) {
            ungroupSelectedObjects();
          } else {
            groupSelectedObjects();
          }
        } else if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key.toLowerCase() === 'l') {
          e.preventDefault();
          const shouldLock = !e.shiftKey;
          selectedIds.forEach((id) => lockObject(id, shouldLock));
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpacePressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((z) => Math.min(Math.max(z * zoomFactor, 0.25), 4.0));
    } else {
      setPan((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== containerRef.current && !(e.target as HTMLElement).classList.contains('canvas-bg-layer')) {
      return;
    }

    clearSelection();

    if (e.button === 1 || spacePressed) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (e.button === 0) {
      const rect = containerRef.current?.getBoundingClientRect();
      const pt = screenToCanvas(e.clientX, e.clientY, pan, zoom, rect);
      marqueeStartRef.current = pt;
      setMarqueeRect({ x: pt.x, y: pt.y, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }

    if (draggingConnection) {
      const rect = containerRef.current?.getBoundingClientRect();
      const pt = screenToCanvas(e.clientX, e.clientY, pan, zoom, rect);

      let bestTargetId: string | undefined;
      let bestTargetAnchor: any | undefined;
      let minDst = 40 / zoom;
      let snapPt = pt;

      boardObjects.forEach((obj) => {
        if (obj.id === draggingConnection.sourceObjectId) return;
        const { position, point, distance } = getNearestAnchor(pt, obj);
        if (distance < minDst) {
          minDst = distance;
          bestTargetId = obj.id;
          bestTargetAnchor = position;
          snapPt = point;
        }
      });

      updateDraggingConnection(snapPt.x, snapPt.y, bestTargetId, bestTargetAnchor);
    }

    if (marqueeStartRef.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      const currentPt = screenToCanvas(e.clientX, e.clientY, pan, zoom, rect);

      const minX = Math.min(marqueeStartRef.current.x, currentPt.x);
      const minY = Math.min(marqueeStartRef.current.y, currentPt.y);
      const width = Math.abs(currentPt.x - marqueeStartRef.current.x);
      const height = Math.abs(currentPt.y - marqueeStartRef.current.y);

      setMarqueeRect({ x: minX, y: minY, width, height });
    }
  };

  const handleMouseUp = () => {
    if (isPanning) setIsPanning(false);

    if (marqueeRect && marqueeStartRef.current) {
      selectObjectsInRect(marqueeRect);
      setMarqueeRect(null);
      marqueeStartRef.current = null;
    }

    if (draggingConnection) {
      if (draggingConnection.targetObjectId && draggingConnection.targetAnchor) {
        finishDraggingConnection(draggingConnection.targetObjectId, draggingConnection.targetAnchor);
      } else {
        cancelDraggingConnection();
      }
    }
  };

  // HTML5 Drag & Drop from Left Toolbar and External Files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      if (!isDraggingFile) setIsDraggingFile(true);
    }
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    const rect = containerRef.current?.getBoundingClientRect();
    const pt = screenToCanvas(e.clientX, e.clientY, pan, zoom, rect);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file, idx) => {
        const dropX = pt.x + (idx * 20);
        const dropY = pt.y + (idx * 20);
        const fileUrl = URL.createObjectURL(file);
        
        if (file.type.startsWith('image/')) {
          addObject('image', dropX, dropY, { url: fileUrl });
        } else if (file.type.startsWith('video/')) {
          addObject('video', dropX, dropY, { url: fileUrl });
        } else if (file.type.startsWith('audio/')) {
          addObject('audio', dropX, dropY, { url: fileUrl, title: file.name });
        } else {
          addObject('document', dropX, dropY, { title: file.name, url: fileUrl });
        }
      });
      return;
    }

    const cardType = e.dataTransfer.getData('application/moodie-card-type') as ObjectType;
    if (cardType) {
      addObject(cardType, pt.x - 100, pt.y - 60);
    }
  };

  const renderCardContent = (obj: any) => {
    switch (obj.type) {
      case 'note':
        return <NoteCard object={obj} />;
      case 'heading':
        return <HeadingCard object={obj} />;
      case 'link':
        return <LinkCard object={obj} />;
      case 'todo':
        return <TodoCard object={obj} />;
      case 'image':
        return <ImageCard object={obj} />;
      case 'video':
        return <VideoCard object={obj} />;
      case 'audio':
        return <AudioCard object={obj} />;
      case 'document':
        return <DocumentCard object={obj} />;
      case 'board':
        return <BoardCard object={obj} />;
      case 'column':
        return <ColumnCard object={obj} />;
      case 'table':
        return <TableCard object={obj} />;
      case 'color':
        return <ColorCard object={obj} />;
      case 'map':
        return <MapCard object={obj} />;
      case 'sketch':
        return <SketchCard object={obj} />;
      case 'comment':
        return <CommentCard object={obj} />;
      default:
        return <NoteCard object={obj} />;
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-hidden bg-premium-canvas select-none canvas-bg-layer ${
        spacePressed || isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Background Matrix Grid */}
      <CanvasGrid />

      {/* SVG Layer for Anchor Lines & Arrowhead Connections */}
      <SVGConnectionLayer />

      {/* Transformed World Layer for Objects & Cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* Alignment Guides */}
        {activeGuides?.map((guide, idx) => (
          <div
            key={`guide-${idx}`}
            className="absolute bg-indigo-500/40 pointer-events-none z-0"
            style={
              guide.axis === 'x'
                ? { left: guide.position, top: -10000, width: 1, height: 20000 }
                : { top: guide.position, left: -10000, width: 20000, height: 1 }
            }
          />
        ))}

        {/* Render All Canvas Object Cards */}
        {boardObjects.map((obj) => (
          <div key={obj.id} className="pointer-events-auto">
            <BaseCard object={obj}>{renderCardContent(obj)}</BaseCard>
          </div>
        ))}

        {/* Marquee Box Selection */}
        <MarqueeSelect rect={marqueeRect} />

        {/* Real-time Collaboration Presences Cursors */}
        {userPresences.map((presence) => (
          <div
            key={presence.id}
            className="absolute pointer-events-none z-50 flex items-center gap-1.5 transition-all duration-300"
            style={{ left: `${presence.cursor?.x}px`, top: `${presence.cursor?.y}px` }}
          >
            <svg className="w-5 h-5 drop-shadow" viewBox="0 0 24 24" fill={presence.color}>
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <span
              className="px-2 py-0.5 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: presence.color }}
            >
              {presence.name}
            </span>
          </div>
        ))}
      </div>

      {/* File Drag Drop Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-50 bg-indigo-500/10 backdrop-blur-sm flex items-center justify-center border-[6px] border-dashed border-indigo-400 rounded-xl m-4 pointer-events-none">
          <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Drop files anywhere</h3>
              <p className="text-sm font-medium text-slate-500">Add images, videos, audio or documents</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
