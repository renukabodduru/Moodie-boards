import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Board,
  CanvasObject,
  Connection,
  CommentItem,
  ActiveTool,
  DraggingConnectionState,
  ObjectType,
  LineStyle,
  AnchorPosition,
  UserPresence,
  CardStyle,
} from '../types/board';
import {
  loadSavedWorkspace,
  saveWorkspace,
  DEFAULT_HOME_BOARD,
  INITIAL_TEMPLATES,
} from '../utils/storage';

interface BoardHistoryState {
  objects: CanvasObject[];
  connections: Connection[];
}

export interface BoardContextType {
  // Navigation & View Mode
  viewMode: 'dashboard' | 'canvas' | 'landing';
  setViewMode: (mode: 'dashboard' | 'canvas' | 'landing') => void;
  boards: Board[];
  currentBoardId: string;
  activeBoard: Board;
  breadcrumbTrail: Board[];
  setCurrentBoardId: (id: string) => void;
  createBoard: (name: string, parentId?: string) => string;
  updateBoard: (id: string, name: string) => void;
  duplicateBoard: (id: string) => string;
  deleteBoard: (id: string) => void;
  toggleFavoriteBoard: (id: string) => void;

  // Objects CRUD & Multi-selection operations
  objects: CanvasObject[];
  boardObjects: CanvasObject[];
  setObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>;
  addObject: (type: ObjectType, x: number, y: number, initialContent?: any) => string;
  updateObject: (id: string, updates: Partial<CanvasObject>) => void;
  deleteObject: (id: string) => void;
  deleteSelectedObjects: () => void;
  duplicateObject: (id: string) => void;
  duplicateSelectedObjects: () => void;
  copySelectedObjects: () => Promise<void>;
  pasteObjects: () => Promise<void>;
  groupSelectedObjects: () => void;
  ungroupSelectedObjects: () => void;
  lockObject: (id: string, locked: boolean) => void;
  changeObjectLayering: (id: string, action: 'front' | 'back' | 'forward' | 'backward') => void;

  // Connections
  connections: Connection[];
  boardConnections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  addConnection: (conn: Omit<Connection, 'id' | 'boardId'>) => string;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;

  // Selection & Tools
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectObject: (id: string, multiSelect?: boolean) => void;
  selectObjectsInRect: (rect: { x: number; y: number; width: number; height: number }) => void;
  clearSelection: () => void;
  selectedLineId: string | null;
  setSelectedLineId: (id: string | null) => void;
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;

  // Canvas View State (Pan / Zoom)
  pan: { x: number; y: number };
  zoom: number;
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitBoardToView: () => void;

  // Connection Dragging
  draggingConnection: DraggingConnectionState | null;
  startDraggingConnection: (sourceObjectId: string, sourceAnchor: AnchorPosition, x: number, y: number) => void;
  updateDraggingConnection: (x: number, y: number, targetObjectId?: string, targetAnchor?: AnchorPosition) => void;
  finishDraggingConnection: (targetObjectId: string, targetAnchor: AnchorPosition, lineStyle?: LineStyle) => void;
  cancelDraggingConnection: () => void;

  // Trash & Comments & History
  trash: CanvasObject[];
  restoreFromTrash: (id: string) => void;
  permanentlyDeleteTrash: (id: string) => void;
  emptyTrash: () => void;
  comments: CommentItem[];
  addComment: (text: string, objectId?: string) => void;
  resolveComment: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: 'saved' | 'saving';

  // Templates & Search & Presences
  applyTemplate: (templateId: string, targetBoardId?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userPresences: UserPresence[];
  activeGuides: { axis: 'x' | 'y'; position: number }[];
  setActiveGuides: React.Dispatch<React.SetStateAction<{ axis: 'x' | 'y'; position: number }[]>>;
  hoveredColumnId: string | null;
  setHoveredColumnId: (id: string | null) => void;
  reorderColumn: (columnId: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'canvas' | 'landing'>('landing');
  const [boards, setBoards] = useState<Board[]>([DEFAULT_HOME_BOARD]);
  const [currentBoardId, setCurrentBoardId] = useState<string>('home');
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [trash, setTrash] = useState<CanvasObject[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchWorkspace = async () => {
      const data = await loadSavedWorkspace();
      if (isMounted) {
        setBoards(data.boards);
        setObjects(data.objects);
        setConnections(data.connections);
        setComments(data.comments);
        setTrash(data.trash);
        setIsLoaded(true);
      }
    };
    fetchWorkspace();

    return () => {
      isMounted = false;
    };
  }, []);

  // Selection & Tools
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>({ type: 'select' });

  // Pan & Zoom
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [zoom, setZoom] = useState<number>(1);

  // Connection dragging
  const [draggingConnection, setDraggingConnection] = useState<DraggingConnectionState | null>(null);

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Undo / Redo history
  const [history, setHistory] = useState<BoardHistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Simulated Presences (single-user mode)
  const [userPresences] = useState<UserPresence[]>([]);

  // Alignment Guides
  const [activeGuides, setActiveGuides] = useState<{ axis: 'x' | 'y'; position: number }[]>([]);
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null);

  // Ensure Home board exists
  const activeBoard = boards.find((b) => b.id === currentBoardId) || boards[0] || DEFAULT_HOME_BOARD;

  // Calculate breadcrumbs trail
  const getBreadcrumbs = useCallback(() => {
    const trail: Board[] = [];
    let curr: Board | undefined = activeBoard;
    while (curr) {
      trail.unshift(curr);
      curr = boards.find((b) => b.id === curr?.parentId);
    }
    return trail;
  }, [activeBoard, boards]);

  const breadcrumbTrail = getBreadcrumbs();

  // Save history state snapshot
  const pushHistory = useCallback((newObjects: CanvasObject[], newConnections: Connection[]) => {
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      return [...nextHistory, { objects: newObjects, connections: newConnections }];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Auto Save Engine
  useEffect(() => {
    if (!isLoaded) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveWorkspace({ boards, objects, connections, comments, trash });
      setSaveStatus('saved');
    }, 1500); // Increased debounce for DB saving
    return () => clearTimeout(timer);
  }, [boards, objects, connections, comments, trash, isLoaded]);

  // Board CRUD
  const createBoard = useCallback((name: string, parentId?: string): string => {
    const id = `board-${Date.now()}`;
    const newBoard: Board = {
      id,
      name,
      parentId: parentId || currentBoardId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      icon: '📋',
    };
    setBoards((prev) => [...prev, newBoard]);
    return id;
  }, [currentBoardId]);

  const deleteBoard = useCallback((id: string) => {
    if (id === 'home') return;
    setBoards((prev) => prev.filter((b) => b.id !== id));
    setObjects((prev) => prev.filter((o) => o.boardId !== id));
    setConnections((prev) => prev.filter((c) => c.boardId !== id));
    if (currentBoardId === id) {
      setCurrentBoardId('home');
    }
  }, [currentBoardId]);

  const updateBoard = useCallback((id: string, name: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, name, updatedAt: Date.now() } : b))
    );
  }, []);

  const duplicateBoard = useCallback((id: string) => {
    let newId = '';
    setBoards((prev) => {
      const src = prev.find((b) => b.id === id);
      if (!src) return prev;
      newId = `board-${Date.now()}`;
      return [
        ...prev,
        { ...src, id: newId, name: `${src.name} (Copy)`, createdAt: Date.now(), updatedAt: Date.now() },
      ];
    });
    return newId;
  }, []);

  const toggleFavoriteBoard = useCallback((id: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite, updatedAt: Date.now() } : b))
    );
  }, []);

  // Objects CRUD
  const boardObjects = objects.filter((o) => o.boardId === currentBoardId);
  const boardConnections = connections.filter((c) => c.boardId === currentBoardId);

  const addObject = useCallback(
    (type: ObjectType, x: number, y: number, initialContent?: any): string => {
      const id = `obj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const maxZIndex = objects.reduce((max, o) => Math.max(max, o.zIndex || 1), 1);

      let width = 240;
      let height = 160;
      let defaultStyle: CardStyle = { bg: '#ffffff', color: '#1e293b' };
      let content = initialContent || {};

      switch (type) {
        case 'heading':
          width = 360;
          height = 75;
          defaultStyle = { bg: 'transparent', color: '#0f172a' };
          content = { text: '', level: 'h1', ...initialContent };
          break;
        case 'note':
          width = 240;
          height = 150;
          content = { text: '', ...initialContent };
          break;
        case 'todo':
          width = 260;
          height = 180;
          content = {
            title: 'Checklist',
            items: [
              { id: '1', text: 'First task', completed: false },
              { id: '2', text: 'Second task', completed: false },
            ],
            ...initialContent,
          };
          break;
        case 'link':
          width = 320;
          height = 150;
          content = { url: 'https://milanote.com', title: 'Creative Reference', description: 'Visual workspace platform', ...initialContent };
          break;
        case 'column':
          width = 320;
          height = 420;
          defaultStyle = { bg: '#fafafa', color: '#171717', borderColor: '#d4d4d4' };
          content = { title: 'New Column', ...initialContent };
          break;
        case 'board':
          width = 240;
          height = 140;
          defaultStyle = { bg: '#f5f5f5', color: '#171717', borderColor: '#525252' };
          const childBoardId = createBoard('Sub Workspace', currentBoardId);
          content = { title: 'Sub Workspace', targetBoardId: childBoardId, description: 'Nested Board →', ...initialContent };
          break;
        case 'color':
          width = 160;
          height = 160;
          defaultStyle = { bg: '#262626', color: '#ffffff' };
          content = { hex: '#262626', name: 'Charcoal Black', ...initialContent };
          break;
        case 'table':
          width = 360;
          height = 200;
          content = {
            headers: ['Task', 'Owner', 'Status'],
            rows: [
              ['Research', 'Team', 'Done'],
              ['Wireframes', 'Team', 'In Progress'],
            ],
            ...initialContent,
          };
          break;
        case 'sketch':
          width = 300;
          height = 240;
          content = { paths: [], color: '#000000', strokeWidth: 3, ...initialContent };
          break;
        case 'image':
          width = 280;
          height = 200;
          content = { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop', caption: 'Visual Inspiration', ...initialContent };
          break;
        case 'comment':
          width = 240;
          height = 140;
          defaultStyle = { bg: '#f5f5f5', color: '#171717', borderColor: '#a3a3a3' };
          content = { author: 'You', text: 'Add feedback here...', ...initialContent };
          break;
        default:
          break;
      }

      const newObject: CanvasObject = {
        id,
        boardId: currentBoardId,
        type,
        x,
        y,
        width,
        height,
        zIndex: maxZIndex + 1,
        locked: false,
        style: defaultStyle,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedObjects = [...objects, newObject];
      setObjects(updatedObjects);
      setSelectedIds([id]);
      pushHistory(updatedObjects, connections);
      return id;
    },
    [currentBoardId, objects, connections, createBoard, pushHistory]
  );

  const updateObject = useCallback((id: string, updates: Partial<CanvasObject>) => {
    setObjects((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates, updatedAt: Date.now() } : o))
    );
  }, []);

  const deleteObject = useCallback(
    (id: string) => {
      const objToDelete = objects.find((o) => o.id === id);
      if (!objToDelete) return;

      setTrash((prev) => [...prev, objToDelete]);
      const nextObjects = objects.filter((o) => o.id !== id);
      const nextConnections = connections.filter(
        (c) =>
          ('objectId' in c.source ? c.source.objectId !== id : true) &&
          ('objectId' in c.target ? c.target.objectId !== id : true)
      );

      setObjects(nextObjects);
      setConnections(nextConnections);
      setSelectedIds((prev) => prev.filter((sId) => sId !== id));
      pushHistory(nextObjects, nextConnections);
    },
    [objects, connections, pushHistory]
  );

  const deleteSelectedObjects = useCallback(() => {
    if (!selectedIds.length) return;

    const toDelete = objects.filter((o) => selectedIds.includes(o.id));
    setTrash((prev) => [...prev, ...toDelete]);

    const nextObjects = objects.filter((o) => !selectedIds.includes(o.id));
    const nextConnections = connections.filter(
      (c) =>
        ('objectId' in c.source ? !selectedIds.includes(c.source.objectId) : true) &&
        ('objectId' in c.target ? !selectedIds.includes(c.target.objectId) : true)
    );

    setObjects(nextObjects);
    setConnections(nextConnections);
    setSelectedIds([]);
    pushHistory(nextObjects, nextConnections);
  }, [objects, connections, selectedIds, pushHistory]);

  const duplicateObject = useCallback(
    (id: string) => {
      const src = objects.find((o) => o.id === id);
      if (!src) return;

      const newId = `obj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const maxZIndex = objects.reduce((max, o) => Math.max(max, o.zIndex || 1), 1);
      const copy: CanvasObject = {
        ...src,
        id: newId,
        x: src.x + 30,
        y: src.y + 30,
        zIndex: maxZIndex + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updated = [...objects, copy];
      setObjects(updated);
      setSelectedIds([newId]);
      pushHistory(updated, connections);
    },
    [objects, connections, pushHistory]
  );

  const duplicateSelectedObjects = useCallback(() => {
    if (!selectedIds.length) return;

    const maxZIndex = objects.reduce((max, o) => Math.max(max, o.zIndex || 1), 1);
    const newCopies: CanvasObject[] = [];
    const newSelectedIds: string[] = [];
    const groupMap = new Map<string, string>();

    selectedIds.forEach((id, idx) => {
      const src = objects.find((o) => o.id === id);
      if (!src) return;

      let newGroupId = src.groupId;
      if (newGroupId) {
        if (!groupMap.has(newGroupId)) {
          groupMap.set(newGroupId, `group-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`);
        }
        newGroupId = groupMap.get(newGroupId);
      }

      const newId = `obj-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`;
      const copy: CanvasObject = {
        ...src,
        id: newId,
        groupId: newGroupId,
        x: src.x + 40,
        y: src.y + 40,
        zIndex: maxZIndex + idx + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      newCopies.push(copy);
      newSelectedIds.push(newId);
    });

    const updated = [...objects, ...newCopies];
    setObjects(updated);
    setSelectedIds(newSelectedIds);
    pushHistory(updated, connections);
  }, [objects, connections, selectedIds, pushHistory]);

  const copySelectedObjects = useCallback(async () => {
    if (!selectedIds.length) return;
    const toCopy = objects.filter((o) => selectedIds.includes(o.id));
    try {
      await navigator.clipboard.writeText(JSON.stringify({ type: 'moodie-board-objects', objects: toCopy }));
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }, [objects, selectedIds]);

  const pasteObjects = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (parsed && parsed.type === 'moodie-board-objects' && Array.isArray(parsed.objects)) {
        const maxZIndex = objects.reduce((max, o) => Math.max(max, o.zIndex || 1), 1);
        const newCopies: CanvasObject[] = [];
        const newSelectedIds: string[] = [];
        const groupMap = new Map<string, string>();

        parsed.objects.forEach((src: CanvasObject, idx: number) => {
          const newId = `obj-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`;

          let newGroupId = src.groupId;
          if (newGroupId) {
            if (!groupMap.has(newGroupId)) {
              groupMap.set(newGroupId, `group-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`);
            }
            newGroupId = groupMap.get(newGroupId);
          }

          const copy: CanvasObject = {
            ...src,
            id: newId,
            boardId: currentBoardId,
            groupId: newGroupId,
            x: src.x + 40,
            y: src.y + 40,
            zIndex: maxZIndex + idx + 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          newCopies.push(copy);
          newSelectedIds.push(newId);
        });

        const updated = [...objects, ...newCopies];
        setObjects(updated);
        setSelectedIds(newSelectedIds);
        pushHistory(updated, connections);
      }
    } catch (err) {
      console.error('Failed to paste', err);
    }
  }, [objects, connections, currentBoardId, pushHistory]);

  const groupSelectedObjects = useCallback(() => {
    if (selectedIds.length < 2) return;
    const groupId = `group-${Date.now()}`;
    const updated = objects.map((obj) =>
      selectedIds.includes(obj.id) ? { ...obj, groupId, updatedAt: Date.now() } : obj
    );
    setObjects(updated);
    pushHistory(updated, connections);
  }, [objects, selectedIds, connections, pushHistory]);

  const ungroupSelectedObjects = useCallback(() => {
    if (!selectedIds.length) return;
    const groupIdsToUngroup = new Set(
      objects.filter((o) => selectedIds.includes(o.id) && o.groupId).map((o) => o.groupId)
    );
    if (groupIdsToUngroup.size === 0) return;

    const updated = objects.map((obj) => {
      if (obj.groupId && groupIdsToUngroup.has(obj.groupId)) {
        const { groupId, ...rest } = obj;
        return { ...rest, updatedAt: Date.now() } as CanvasObject;
      }
      return obj;
    });
    setObjects(updated);
    pushHistory(updated, connections);
  }, [objects, selectedIds, connections, pushHistory]);

  const lockObject = useCallback((id: string, locked: boolean) => {
    updateObject(id, { locked });
  }, [updateObject]);

  const changeObjectLayering = useCallback((id: string, action: 'front' | 'back' | 'forward' | 'backward') => {
    setObjects((prev) => {
      const obj = prev.find((o) => o.id === id);
      if (!obj) return prev;

      const maxZ = prev.reduce((m, o) => Math.max(m, o.zIndex || 1), 1);
      const minZ = prev.reduce((m, o) => Math.min(m, o.zIndex || 1), 1);

      let newZ = obj.zIndex;
      if (action === 'front') newZ = maxZ + 1;
      else if (action === 'back') newZ = Math.max(1, minZ - 1);
      else if (action === 'forward') newZ = obj.zIndex + 1;
      else if (action === 'backward') newZ = Math.max(1, obj.zIndex - 1);

      return prev.map((o) => (o.id === id ? { ...o, zIndex: newZ } : o));
    });
  }, []);

  // Connections CRUD
  const addConnection = useCallback(
    (connData: Omit<Connection, 'id' | 'boardId'>): string => {
      const id = `conn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newConn: Connection = {
        ...connData,
        id,
        boardId: currentBoardId,
      };

      const updatedConns = [...connections, newConn];
      setConnections(updatedConns);
      pushHistory(objects, updatedConns);
      return id;
    },
    [currentBoardId, connections, objects, pushHistory]
  );

  const updateConnection = useCallback((id: string, updates: Partial<Connection>) => {
    setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteConnection = useCallback(
    (id: string) => {
      const nextConns = connections.filter((c) => c.id !== id);
      setConnections(nextConns);
      if (selectedLineId === id) setSelectedLineId(null);
      pushHistory(objects, nextConns);
    },
    [connections, selectedLineId, objects, pushHistory]
  );

  // Selection Logic
  const toggleSelectObject = useCallback((id: string, multiSelect: boolean = false) => {
    setSelectedLineId(null);
    const obj = objects.find(o => o.id === id);
    const groupIdsToToggle = obj?.groupId
      ? objects.filter(o => o.groupId === obj.groupId).map(o => o.id)
      : [id];

    if (multiSelect) {
      setSelectedIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((i) => !groupIdsToToggle.includes(i));
        }
        return Array.from(new Set([...prev, ...groupIdsToToggle]));
      });
    } else {
      setSelectedIds(groupIdsToToggle);
    }
  }, [objects]);

  const selectObjectsInRect = useCallback((rect: { x: number; y: number; width: number; height: number }) => {
    const matches = boardObjects
      .filter((o) => !o.locked)
      .filter(
        (o) =>
          o.x >= rect.x &&
          o.x + o.width <= rect.x + rect.width &&
          o.y >= rect.y &&
          o.y + o.height <= rect.y + rect.height
      )
      .map((o) => o.id);

    setSelectedIds(matches);
  }, [boardObjects]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectedLineId(null);
  }, []);

  // Zoom / Pan Actions
  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.15, 4.0)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.15, 0.25)), []);
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 100, y: 100 });
  }, []);

  const fitBoardToView = useCallback(() => {
    if (!boardObjects.length) return resetZoom();

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    boardObjects.forEach((o) => {
      minX = Math.min(minX, o.x);
      minY = Math.min(minY, o.y);
      maxX = Math.max(maxX, o.x + o.width);
      maxY = Math.max(maxY, o.y + o.height);
    });

    const width = maxX - minX || 400;
    const height = maxY - minY || 400;

    const viewportW = window.innerWidth - 300;
    const viewportH = window.innerHeight - 150;

    const scaleX = viewportW / (width + 200);
    const scaleY = viewportH / (height + 200);
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.25), 2.0);

    setZoom(newZoom);
    setPan({
      x: (viewportW - width * newZoom) / 2 - minX * newZoom + 100,
      y: (viewportH - height * newZoom) / 2 - minY * newZoom + 50,
    });
  }, [boardObjects, resetZoom]);

  const reorderColumn = useCallback((columnId: string) => {
    setObjects((prev) => {
      const col = prev.find((o) => o.id === columnId);
      if (!col) return prev;

      const children = prev
        .filter((o) => o.parentId === columnId)
        .sort((a, b) => a.y - b.y);

      if (children.length === 0) return prev;

      const updated = [...prev];
      
      // Calculate the max bottom and max right extent of all children to adjust column dimensions
      let maxBottom = col.y + 70; // Minimum height for header
      let maxRight = col.x + 320; // Default minimum width
      
      children.forEach((child) => {
        maxBottom = Math.max(maxBottom, child.y + child.height + 40);
        maxRight = Math.max(maxRight, child.x + child.width + 40);
      });

      // Adjust column height and width to fit children
      const colIndex = updated.findIndex((o) => o.id === columnId);
      if (colIndex > -1) {
        updated[colIndex] = {
          ...updated[colIndex],
          height: Math.max(maxBottom - col.y, 200),
          width: Math.max(maxRight - col.x, 320),
        };
      }

      return updated;
    });
  }, []);

  // Connection Dragging Handlers
  const startDraggingConnection = useCallback(
    (sourceObjectId: string, sourceAnchor: AnchorPosition, x: number, y: number) => {
      setDraggingConnection({
        sourceObjectId,
        sourceAnchor,
        currentX: x,
        currentY: y,
      });
    },
    []
  );

  const updateDraggingConnection = useCallback((x: number, y: number, targetObjectId?: string, targetAnchor?: AnchorPosition) => {
    setDraggingConnection((prev) => (prev ? { ...prev, currentX: x, currentY: y, targetObjectId, targetAnchor } : null));
  }, []);

  const finishDraggingConnection = useCallback(
    (targetObjectId: string, targetAnchor: AnchorPosition, lineStyle: LineStyle = 'straight') => {
      if (!draggingConnection) return;
      if (draggingConnection.sourceObjectId === targetObjectId) {
        setDraggingConnection(null);
        return;
      }

      addConnection({
        source: { objectId: draggingConnection.sourceObjectId, anchor: draggingConnection.sourceAnchor },
        target: { objectId: targetObjectId, anchor: targetAnchor },
        lineStyle,
        strokePattern: 'solid',
        arrowEnd: true,
        color: '#000000',
        strokeWidth: 1.5,
      });

      setDraggingConnection(null);
    },
    [draggingConnection, addConnection]
  );

  const cancelDraggingConnection = useCallback(() => {
    setDraggingConnection(null);
  }, []);

  // Trash CRUD
  const restoreFromTrash = useCallback((id: string) => {
    const item = trash.find((t) => t.id === id);
    if (!item) return;

    setObjects((prev) => [...prev, item]);
    setTrash((prev) => prev.filter((t) => t.id !== id));
  }, [trash]);

  const permanentlyDeleteTrash = useCallback((id: string) => {
    setTrash((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const emptyTrash = useCallback(() => {
    setTrash([]);
  }, []);

  // Comments CRUD
  const addComment = useCallback((text: string, objectId?: string) => {
    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      boardId: currentBoardId,
      objectId,
      author: 'You',
      avatar: '👤',
      text,
      resolved: false,
      createdAt: Date.now(),
    };
    setComments((prev) => [...prev, newComment]);
  }, [currentBoardId]);

  const resolveComment = useCallback((id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)));
  }, []);

  // Undo / Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setObjects(prev.objects);
      setConnections(prev.connections);
      setHistoryIndex((i) => i - 1);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setObjects(next.objects);
      setConnections(next.connections);
      setHistoryIndex((i) => i + 1);
    }
  }, [historyIndex, history]);

  const applyTemplate = useCallback((templateId: string, targetBoardId?: string) => {
    const tmpl = INITIAL_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;

    const timestamp = Date.now();
    const idMap: Record<string, string> = {};
    const boardToUse = targetBoardId || currentBoardId;

    const currentBoardObjects = objects.filter(o => o.boardId === boardToUse);
    let offsetY = 0;
    if (currentBoardObjects.length > 0) {
      const maxY = Math.max(...currentBoardObjects.map(o => o.y + o.height));
      offsetY = maxY + 100;
    }

    const newObjects: CanvasObject[] = tmpl.objects.map((o, idx) => {
      const newId = `tmpl-obj-${timestamp}-${idx}`;
      if (o.id) idMap[o.id] = newId;
      return {
        id: newId,
        boardId: boardToUse,
        type: o.type || 'note',
        x: o.x || 100,
        y: (o.y || 100) + offsetY,
        width: o.width || 240,
        height: o.height || 140,
        zIndex: (o.zIndex || 1) + 100,
        style: o.style || { bg: '#ffffff' },
        content: o.content || {},
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    });

    const newConnections: Connection[] = tmpl.connections.map((c, idx) => ({
      id: `tmpl-conn-${timestamp}-${idx}`,
      boardId: boardToUse,
      source: {
        objectId: idMap[c.source?.objectId || ''] || c.source?.objectId || '',
        anchor: c.source?.anchor || 'right',
      },
      target: {
        objectId: idMap[(c.target as any)?.objectId || ''] || (c.target as any)?.objectId || '',
        anchor: (c.target as any)?.anchor || 'left',
      },
      lineStyle: c.lineStyle || 'curved',
      strokePattern: c.strokePattern || 'solid',
      arrowEnd: c.arrowEnd !== undefined ? c.arrowEnd : true,
      color: c.color || '#000000',
      strokeWidth: c.strokeWidth || 1.5,
    }));

    setObjects((prev) => [...prev, ...newObjects]);
    setConnections((prev) => [...prev, ...newConnections]);
  }, [currentBoardId]);

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BoardContext.Provider
      value={{
        viewMode,
        setViewMode,
        boards,
        currentBoardId,
        activeBoard,
        breadcrumbTrail,
        setCurrentBoardId,
        createBoard,
        updateBoard,
        duplicateBoard,
        deleteBoard,
        toggleFavoriteBoard,
        objects,
        boardObjects,
        setObjects,
        addObject,
        updateObject,
        deleteObject,
        deleteSelectedObjects,
        duplicateObject,
        duplicateSelectedObjects,
        copySelectedObjects,
        pasteObjects,
        groupSelectedObjects,
        ungroupSelectedObjects,
        lockObject,
        changeObjectLayering,
        connections,
        boardConnections,
        setConnections,
        addConnection,
        updateConnection,
        deleteConnection,
        selectedIds,
        setSelectedIds,
        toggleSelectObject,
        selectObjectsInRect,
        clearSelection,
        selectedLineId,
        setSelectedLineId,
        activeTool,
        setActiveTool,
        pan,
        zoom,
        setPan,
        setZoom,
        zoomIn,
        zoomOut,
        resetZoom,
        fitBoardToView,
        draggingConnection,
        startDraggingConnection,
        updateDraggingConnection,
        finishDraggingConnection,
        cancelDraggingConnection,
        trash,
        restoreFromTrash,
        permanentlyDeleteTrash,
        emptyTrash,
        comments,
        addComment,
        resolveComment,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        saveStatus,
        applyTemplate,
        searchQuery,
        setSearchQuery,
        userPresences,
        activeGuides,
        setActiveGuides,
        hoveredColumnId,
        setHoveredColumnId,
        reorderColumn,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within a BoardProvider');
  return context;
};
