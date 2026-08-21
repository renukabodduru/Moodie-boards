import { Board, CanvasObject, Connection, CommentItem, Template } from '../types/board';
import localforage from 'localforage';

const STORAGE_KEYS = {
  BOARDS: 'moodie_boards',
  OBJECTS: 'moodie_objects',
  CONNECTIONS: 'moodie_connections',
  COMMENTS: 'moodie_comments',
  TRASH: 'moodie_trash',
  ACTIVE_BOARD: 'moodie_active_board_id',
};

// Initial Seed Boards
export const DEFAULT_HOME_BOARD: Board = {
  id: 'home',
  name: 'Home Workspace',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  icon: '🏠',
};

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'mindmap',
    name: 'Mind Map',
    category: 'Brainstorming',
    description: 'Central concept with connecting branches and sub-notes.',
    previewColor: '#8b5cf6',
    objects: [
      {
        id: 'tmpl-1',
        type: 'heading',
        x: 450,
        y: 250,
        width: 300,
        height: 100,
        zIndex: 1,
        style: { bg: '#8b5cf6', color: '#ffffff', textAlign: 'center' },
        content: { text: 'Core Innovation', level: 'h1' },
      },
      {
        id: 'tmpl-2',
        type: 'note',
        x: 150,
        y: 120,
        width: 220,
        height: 140,
        zIndex: 2,
        style: { bg: '#ffffff', color: '#1e293b' },
        content: { text: '💡 Key Feature 1\n- High performance canvas\n- Zero latency drag & drop' },
      },
      {
        id: 'tmpl-3',
        type: 'note',
        x: 800,
        y: 120,
        width: 220,
        height: 140,
        zIndex: 3,
        style: { bg: '#ffffff', color: '#1e293b' },
        content: { text: '🚀 Key Feature 2\n- AI Auto Organize\n- Smart relationship lines' },
      },
      {
        id: 'tmpl-4',
        type: 'note',
        x: 480,
        y: 450,
        width: 240,
        height: 140,
        zIndex: 4,
        style: { bg: '#ffffff', color: '#1e293b' },
        content: { text: '🎨 Design Philosophy\n- Clean minimalist layout\n- Fluid micro-animations' },
      },
    ],
    connections: [
      {
        id: 'conn-t1',
        source: { objectId: 'tmpl-1', anchor: 'left' },
        target: { objectId: 'tmpl-2', anchor: 'right' },
        lineStyle: 'curved',
        strokePattern: 'solid',
        arrowEnd: true,
        color: '#8b5cf6',
        strokeWidth: 3,
      },
      {
        id: 'conn-t2',
        source: { objectId: 'tmpl-1', anchor: 'right' },
        target: { objectId: 'tmpl-3', anchor: 'left' },
        lineStyle: 'curved',
        strokePattern: 'solid',
        arrowEnd: true,
        color: '#8b5cf6',
        strokeWidth: 3,
      },
      {
        id: 'conn-t3',
        source: { objectId: 'tmpl-1', anchor: 'bottom' },
        target: { objectId: 'tmpl-4', anchor: 'top' },
        lineStyle: 'curved',
        strokePattern: 'solid',
        arrowEnd: true,
        color: '#8b5cf6',
        strokeWidth: 3,
      },
    ],
  },
  {
    id: 'storyboard',
    name: 'Video Storyboard',
    category: 'Media & Video',
    description: 'Sequential scene planning with notes, timing, and visual shots.',
    previewColor: '#ec4899',
    objects: [
      {
        id: 'sb-col-1',
        type: 'column',
        x: 100,
        y: 100,
        width: 280,
        height: 520,
        zIndex: 1,
        style: { bg: '#fdf2f8', borderColor: '#fbcfe8' },
        content: { title: 'Scene 1: Introduction (0:00 - 0:15)' },
      },
      {
        id: 'sb-col-2',
        type: 'column',
        x: 420,
        y: 100,
        width: 280,
        height: 520,
        zIndex: 2,
        style: { bg: '#fdf2f8', borderColor: '#fbcfe8' },
        content: { title: 'Scene 2: Problem Statement (0:15 - 0:45)' },
      },
      {
        id: 'sb-col-3',
        type: 'column',
        x: 740,
        y: 100,
        width: 280,
        height: 520,
        zIndex: 3,
        style: { bg: '#fdf2f8', borderColor: '#fbcfe8' },
        content: { title: 'Scene 3: Solution Demo (0:45 - 1:30)' },
      },
      {
        id: 'sb-note-1',
        parentId: 'sb-col-1',
        type: 'note',
        x: 110,
        y: 160,
        width: 260,
        height: 120,
        zIndex: 4,
        style: { bg: '#ffffff' },
        content: { text: '🎬 Opening Shot\nWide shot of creative workspace desk.' },
      },
      {
        id: 'sb-todo-1',
        parentId: 'sb-col-1',
        type: 'todo',
        x: 110,
        y: 300,
        width: 260,
        height: 160,
        zIndex: 5,
        style: { bg: '#ffffff' },
        content: {
          items: [
            { id: 't1', text: 'Set up studio lighting', completed: true },
            { id: 't2', text: 'Record voiceover audio', completed: false },
          ],
        },
      },
    ],
    connections: [],
  },
  {
    id: 'moodboard',
    name: 'Brand & Moodboard',
    category: 'Design',
    description: 'Color swatches, imagery inspiration, typography and links.',
    previewColor: '#06b6d4',
    objects: [
      {
        id: 'mb-head',
        type: 'heading',
        x: 200,
        y: 80,
        width: 400,
        height: 80,
        zIndex: 1,
        style: { bg: 'transparent', color: '#0f172a' },
        content: { text: '✨ Brand Aesthetic 2026', level: 'h1' },
      },
      {
        id: 'mb-color-1',
        type: 'color',
        x: 200,
        y: 180,
        width: 160,
        height: 160,
        zIndex: 2,
        style: { bg: '#0f172a' },
        content: { hex: '#0F172A', name: 'Deep Slate' },
      },
      {
        id: 'mb-color-2',
        type: 'color',
        x: 380,
        y: 180,
        width: 160,
        height: 160,
        zIndex: 3,
        style: { bg: '#404040' },
        content: { hex: '#404040', name: 'Neutral Gray' },
      },
      {
        id: 'mb-color-3',
        type: 'color',
        x: 560,
        y: 180,
        width: 160,
        height: 160,
        zIndex: 4,
        style: { bg: '#737373' },
        content: { hex: '#737373', name: 'Warm Gray' },
      },
      {
        id: 'mb-link',
        type: 'link',
        x: 200,
        y: 370,
        width: 340,
        height: 160,
        zIndex: 5,
        style: { bg: '#ffffff' },
        content: {
          url: 'https://dribbble.com',
          title: 'Design Inspiration',
          description: 'Modern glassmorphism & visual board UI layouts.',
        },
      },
    ],
    connections: [],
  },
];

// Default Sample Content for Initial Load
export const SAMPLE_INITIAL_OBJECTS: CanvasObject[] = [
  {
    id: 'welcome-heading',
    boardId: 'home',
    type: 'heading',
    x: 350,
    y: 100,
    width: 520,
    height: 90,
    zIndex: 1,
    style: { bg: '#171717', color: '#ffffff', textAlign: 'center', shadow: true },
    content: { text: '✨ Welcome to Moodie-Board', level: 'h1' },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'note-intro',
    boardId: 'home',
    type: 'note',
    x: 100,
    y: 240,
    width: 320,
    height: 200,
    zIndex: 2,
    style: { bg: '#ffffff', color: '#1e293b' },
    content: {
      text: '📌 **Infinite Canvas Philosophy**\nEvery card is an independent object!\n\n• Drag objects freely\n• Zoom with mouse wheel (25% - 400%)\n• Drag from green **anchor dots** to draw connections!',
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'todo-getting-started',
    boardId: 'home',
    type: 'todo',
    x: 460,
    y: 240,
    width: 300,
    height: 220,
    zIndex: 3,
    style: { bg: '#ffffff' },
    content: {
      title: '🚀 Getting Started Checklist',
      items: [
        { id: '1', text: 'Select a card to view anchor points', completed: true },
        { id: '2', text: 'Connect notes with curved arrows', completed: true },
        { id: '3', text: 'Try nested Boards & Columns', completed: false },
        { id: '4', text: 'Use AI Organize & Summarize', completed: false },
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'nested-board-demo',
    boardId: 'home',
    type: 'board',
    x: 800,
    y: 240,
    width: 240,
    height: 160,
    zIndex: 4,
    style: { bg: '#f5f5f5', borderColor: '#525252' },
    content: {
      title: '🎬 Video Project Board',
      targetBoardId: 'board-video-project',
      description: 'Double click to enter nested workspace →',
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'column-research',
    boardId: 'home',
    type: 'column',
    x: 100,
    y: 480,
    width: 320,
    height: 380,
    zIndex: 5,
    style: { bg: '#f8fafc', borderColor: '#cbd5e1' },
    content: { title: '📁 Research & Ideas' },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'link-card-sample',
    boardId: 'home',
    parentId: 'column-research',
    type: 'link',
    x: 110,
    y: 540,
    width: 300,
    height: 140,
    zIndex: 6,
    style: { bg: '#ffffff' },
    content: {
      url: 'https://youtube.com',
      title: 'Visual Workflow Design',
      description: 'Reference for creative visual board applications.',
      embedType: 'video',
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'color-palette-card',
    boardId: 'home',
    type: 'color',
    x: 460,
    y: 490,
    width: 180,
    height: 180,
    zIndex: 7,
    style: { bg: '#262626' },
    content: { hex: '#262626', name: 'Charcoal Black' },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'comment-sample',
    boardId: 'home',
    type: 'comment',
    x: 680,
    y: 490,
    width: 260,
    height: 160,
    zIndex: 8,
    style: { bg: '#f5f5f5', borderColor: '#a3a3a3' },
    content: {
      author: 'You',
      text: '💬 The card connections follow smooth Bézier curves when moved!',
      resolved: false,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const SAMPLE_INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn-1',
    boardId: 'home',
    source: { objectId: 'note-intro', anchor: 'right' },
    target: { objectId: 'todo-getting-started', anchor: 'left' },
    lineStyle: 'curved',
    strokePattern: 'solid',
    arrowEnd: true,
    color: '#6366f1',
    strokeWidth: 3,
    label: 'guides to',
  },
  {
    id: 'conn-2',
    boardId: 'home',
    source: { objectId: 'todo-getting-started', anchor: 'right' },
    target: { objectId: 'nested-board-demo', anchor: 'left' },
    lineStyle: 'curved',
    strokePattern: 'solid',
    arrowEnd: true,
    color: '#3b82f6',
    strokeWidth: 3,
  },
];

export async function loadSavedWorkspace(): Promise<{
  boards: Board[];
  objects: CanvasObject[];
  connections: Connection[];
  comments: CommentItem[];
  trash: CanvasObject[];
}> {
  try {
    let saved = await localforage.getItem<string>('moodie_workspace_data');
    if (!saved) {
      saved = localStorage.getItem('moodie_workspace_data');
      if (saved) {
        await localforage.setItem('moodie_workspace_data', saved);
      }
    }

    if (saved) {
      const data = JSON.parse(saved);
      return {
        boards: data.boards || [DEFAULT_HOME_BOARD],
        objects: data.objects || SAMPLE_INITIAL_OBJECTS,
        connections: data.connections || SAMPLE_INITIAL_CONNECTIONS,
        comments: data.comments || [],
        trash: data.trash || [],
      };
    }
  } catch (err) {
    console.error('Exception loading workspace:', err);
  }

  return {
    boards: [DEFAULT_HOME_BOARD],
    objects: SAMPLE_INITIAL_OBJECTS,
    connections: SAMPLE_INITIAL_CONNECTIONS,
    comments: [],
    trash: [],
  };
}

export async function saveWorkspace(data: {
  boards: Board[];
  objects: CanvasObject[];
  connections: Connection[];
  comments: CommentItem[];
  trash: CanvasObject[];
}) {
  try {
    await localforage.setItem('moodie_workspace_data', JSON.stringify(data));
  } catch (err) {
    console.error('Exception saving workspace:', err);
  }
}
