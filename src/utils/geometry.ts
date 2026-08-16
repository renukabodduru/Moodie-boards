import { AnchorPosition, CanvasObject } from '../types/board';

export interface Point {
  x: number;
  y: number;
}

export function screenToCanvas(
  screenX: number,
  screenY: number,
  pan: Point,
  zoom: number,
  canvasBounds?: DOMRect
): Point {
  const offsetX = canvasBounds ? canvasBounds.left : 0;
  const offsetY = canvasBounds ? canvasBounds.top : 0;
  return {
    x: (screenX - offsetX - pan.x) / zoom,
    y: (screenY - offsetY - pan.y) / zoom,
  };
}

export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  pan: Point,
  zoom: number,
  canvasBounds?: DOMRect
): Point {
  const offsetX = canvasBounds ? canvasBounds.left : 0;
  const offsetY = canvasBounds ? canvasBounds.top : 0;
  return {
    x: canvasX * zoom + pan.x + offsetX,
    y: canvasY * zoom + pan.y + offsetY,
  };
}

export function getAnchorCoordinates(
  obj: Pick<CanvasObject, 'x' | 'y' | 'width' | 'height'>,
  anchor: AnchorPosition
): Point {
  const { x, y, width, height } = obj;

  switch (anchor) {
    case 'top-left':
      return { x, y };
    case 'top':
      return { x: x + width / 2, y };
    case 'top-right':
      return { x: x + width, y };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'bottom-right':
      return { x: x + width, y: y + height };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'bottom-left':
      return { x, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
}

export function getAllAnchors(obj: Pick<CanvasObject, 'x' | 'y' | 'width' | 'height'>): Array<{
  position: AnchorPosition;
  point: Point;
}> {
  const anchors: AnchorPosition[] = [
    'top-left',
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
  ];

  return anchors.map((position) => ({
    position,
    point: getAnchorCoordinates(obj, position),
  }));
}

export function getNearestAnchor(
  point: Point,
  obj: Pick<CanvasObject, 'x' | 'y' | 'width' | 'height'>
): { position: AnchorPosition; point: Point; distance: number } {
  const anchors = getAllAnchors(obj);
  let closest = anchors[0];
  let minDistance = Math.hypot(point.x - closest.point.x, point.y - closest.point.y);

  for (let i = 1; i < anchors.length; i++) {
    const dist = Math.hypot(point.x - anchors[i].point.x, point.y - anchors[i].point.y);
    if (dist < minDistance) {
      minDistance = dist;
      closest = anchors[i];
    }
  }

  return {
    position: closest.position,
    point: closest.point,
    distance: minDistance,
  };
}

export function generateSVGPath(
  p1: Point,
  p2: Point,
  style: 'straight' | 'curved' | 'elbow',
  curveControl?: Point
): { path: string; midPoint: Point; controlPoint: Point } {
  if (style === 'straight') {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    return {
      path: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,
      midPoint: { x: midX, y: midY },
      controlPoint: { x: midX, y: midY },
    };
  }

  if (style === 'curved') {
    let ctrlX: number;
    let ctrlY: number;

    if (curveControl) {
      ctrlX = curveControl.x;
      ctrlY = curveControl.y;
    } else {
      // Default natural curve control point offset
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy);
      const perpX = -dy / (dist || 1);
      const perpY = dx / (dist || 1);
      const curveMagnitude = Math.min(dist * 0.25, 80);

      ctrlX = (p1.x + p2.x) / 2 + perpX * curveMagnitude;
      ctrlY = (p1.y + p2.y) / 2 + perpY * curveMagnitude;
    }

    // Midpoint of quadratic bezier curve at t = 0.5 is B(0.5) = 0.25*P1 + 0.5*Ctrl + 0.25*P2
    const midX = 0.25 * p1.x + 0.5 * ctrlX + 0.25 * p2.x;
    const midY = 0.25 * p1.y + 0.5 * ctrlY + 0.25 * p2.y;

    return {
      path: `M ${p1.x} ${p1.y} Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`,
      midPoint: { x: midX, y: midY },
      controlPoint: { x: ctrlX, y: ctrlY },
    };
  }

  if (style === 'elbow') {
    const midX = (p1.x + p2.x) / 2;
    const path = `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
    const midY = (p1.y + p2.y) / 2;
    return {
      path,
      midPoint: { x: midX, y: midY },
      controlPoint: { x: midX, y: midY },
    };
  }

  return {
    path: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,
    midPoint: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
    controlPoint: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
  };
}

export function isPointInsideRect(
  point: Point,
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function getBoundingBox(
  objects: CanvasObject[]
): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } {
  if (!objects.length) {
    return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  objects.forEach((obj) => {
    minX = Math.min(minX, obj.x);
    minY = Math.min(minY, obj.y);
    maxX = Math.max(maxX, obj.x + obj.width);
    maxY = Math.max(maxY, obj.y + obj.height);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(maxX - minX, 400),
    height: Math.max(maxY - minY, 400),
  };
}
