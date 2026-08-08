export type ObjectType = 
  | 'note' 
  | 'heading' 
  | 'link' 
  | 'todo' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'board' 
  | 'column' 
  | 'table' 
  | 'color' 
  | 'map' 
  | 'sketch' 
  | 'comment';

export type AnchorPosition = 
  | 'top-left' 
  | 'top' 
  | 'top-right' 
  | 'right' 
  | 'bottom-right' 
  | 'bottom' 
  | 'bottom-left' 
  | 'left';

export type LineStyle = 'straight' | 'curved' | 'elbow';
export type StrokePattern = 'solid' | 'dashed' | 'dotted';

export interface CardStyle {
  bg?: string;
  color?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  shadow?: boolean;
}

export interface CanvasObject {
  id: string;
  boardId: string;
  parentId?: string; // If inside a column container
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  locked?: boolean;
  style: CardStyle;
  content: any; // Type-specific content
  createdAt: number;
  updatedAt: number;
}

export interface ConnectionAnchorRef {
  objectId: string;
  anchor: AnchorPosition;
}

export interface FreePointRef {
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  boardId: string;
  source: ConnectionAnchorRef;
  target: ConnectionAnchorRef | FreePointRef;
  lineStyle: LineStyle;
  strokePattern: StrokePattern;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  color: string;
  strokeWidth: number;
  label?: string;
  curveControl?: { x: number; y: number };
}

export interface Board {
  id: string;
  name: string;
  parentId?: string;
  createdAt: number;
  updatedAt: number;
  icon?: string;
  theme?: string;
}

export interface CommentItem {
  id: string;
  objectId?: string;
  boardId: string;
  author: string;
  avatar?: string;
  text: string;
  resolved?: boolean;
  createdAt: number;
  replies?: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: number;
  }>;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  previewColor: string;
  objects: Partial<CanvasObject>[];
  connections: Partial<Connection>[];
}

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  activeObjectId?: string;
}

export interface DraggingConnectionState {
  sourceObjectId: string;
  sourceAnchor: AnchorPosition;
  currentX: number;
  currentY: number;
  targetObjectId?: string;
  targetAnchor?: AnchorPosition;
}

export interface ActiveTool {
  type: ObjectType | 'select' | 'pan' | 'line' | 'draw' | 'laser';
  lineStyle?: LineStyle;
}
