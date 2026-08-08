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
import { screenToCanvas } from '../../utils/geometry';
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
    userPresences,
  } = useBoard();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [marqueeRect, setMarqueeRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const marqueeStartRef = useRef<{ x: number; y: number } | null>(null);

  const [spacePressed, setSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        setSpacePressed(true);
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
      updateDraggingConnection(pt.x, pt.y);
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
      cancelDraggingConnection();
    }
  };

  // HTML5 Drag & Drop from Left Toolbar onto Canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardType = e.dataTransfer.getData('application/moodie-card-type') as ObjectType;
    if (cardType) {
      const rect = containerRef.current?.getBoundingClientRect();
      const pt = screenToCanvas(e.clientX, e.clientY, pan, zoom, rect);
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
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-hidden bg-slate-50 select-none canvas-bg-layer ${
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
        }}
      >
        {/* Render All Canvas Object Cards */}
        {boardObjects.map((obj) => (
          <div key={obj.id} className="pointer-events-auto">
            <BaseCard object={obj}>{renderCardContent(obj)}</BaseCard>
          </div>
        ))}

        {/* Marquee Box Selection */}
        <MarqueeSelect rect={marqueeRect} />

        {/* Real-time Collaboration Presences Cursors */}
        {userPresences.map((u) => (
          <div
            key={u.id}
            className="absolute pointer-events-none z-50 flex items-center gap-1.5 transition-all duration-300"
            style={{ left: `${u.cursor?.x}px`, top: `${u.cursor?.y}px` }}
          >
            <svg className="w-5 h-5 drop-shadow" viewBox="0 0 24 24" fill={u.color}>
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md backdrop-blur"
              style={{ backgroundColor: u.color }}
            >
              {u.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
