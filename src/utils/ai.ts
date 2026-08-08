import { CanvasObject, Connection } from '../types/board';

export function aiOrganizeLayout(objects: CanvasObject[]): CanvasObject[] {
  if (!objects.length) return [];

  // Group objects by type or column assignment
  const unnestedObjects = objects.filter((o) => !o.parentId);
  const START_X = 100;
  const START_Y = 150;
  const PADDING_X = 40;
  const PADDING_Y = 40;
  const MAX_COLUMNS = 4;

  let currentColumn = 0;
  let currentX = START_X;
  let currentY = START_Y;
  let maxHeightInRow = 0;

  return objects.map((obj) => {
    if (obj.parentId) return obj; // Keep column nested children intact

    const updatedObj = {
      ...obj,
      x: currentX,
      y: currentY,
      updatedAt: Date.now(),
    };

    maxHeightInRow = Math.max(maxHeightInRow, obj.height);
    currentColumn++;

    if (currentColumn >= MAX_COLUMNS) {
      currentColumn = 0;
      currentX = START_X;
      currentY += maxHeightInRow + PADDING_Y;
      maxHeightInRow = 0;
    } else {
      currentX += obj.width + PADDING_X;
    }

    return updatedObj;
  });
}

export function aiSummarizeNotes(objects: CanvasObject[]): string {
  const notesText = objects
    .filter((o) => o.type === 'note' || o.type === 'heading' || o.type === 'todo')
    .map((o) => {
      if (o.type === 'note') return o.content.text || '';
      if (o.type === 'heading') return o.content.text || '';
      if (o.type === 'todo') return (o.content.items || []).map((i: any) => `- ${i.text}`).join('\n');
      return '';
    })
    .filter(Boolean)
    .join('\n\n');

  if (!notesText) {
    return '🤖 **AI Executive Summary**\n\nNo text notes were selected for summarization. Select notes or headings to generate an AI summary.';
  }

  const lines = notesText.split('\n').filter((l) => l.trim().length > 0);
  const keyPoints = lines.slice(0, 5).map((l) => `• ${l.replace(/^[-•*]\s*/, '')}`);

  return `🤖 **AI Executive Summary**\n\n**Key Takeaways (${lines.length} points extracted):**\n${keyPoints.join('\n')}\n\n**Action Item:** Review visual relationships and proceed to storyboard phase.`;
}

export function aiGenerateMindmap(
  prompt: string,
  boardId: string,
  centerX: number = 400,
  centerY: number = 300
): { objects: CanvasObject[]; connections: Connection[] } {
  const rootId = `ai-root-${Date.now()}`;
  const rootObj: CanvasObject = {
    id: rootId,
    boardId,
    type: 'heading',
    x: centerX,
    y: centerY,
    width: 280,
    height: 90,
    zIndex: 10,
    style: { bg: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#ffffff', textAlign: 'center', shadow: true },
    content: { text: `🚀 ${prompt || 'Project Mindmap'}`, level: 'h1' },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const branches = [
    { title: '💡 Research & Concept', text: 'Market analysis & visual benchmarks', dx: -350, dy: -180 },
    { title: '🎨 Design & UI', text: 'Color swatches, wireframes & UI specs', dx: 350, dy: -180 },
    { title: '⚙️ Execution & Build', text: 'Core engine, SVG line layer & state', dx: -350, dy: 180 },
    { title: '📈 Launch & Analytics', text: 'Feedback gathering & release workflow', dx: 350, dy: 180 },
  ];

  const generatedObjects: CanvasObject[] = [rootObj];
  const generatedConnections: Connection[] = [];

  branches.forEach((b, idx) => {
    const branchId = `ai-branch-${Date.now()}-${idx}`;
    const branchObj: CanvasObject = {
      id: branchId,
      boardId,
      type: 'note',
      x: centerX + b.dx,
      y: centerY + b.dy,
      width: 240,
      height: 140,
      zIndex: 11 + idx,
      style: { bg: '#ffffff', color: '#1e293b' },
      content: { text: `**${b.title}**\n${b.text}` },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    generatedObjects.push(branchObj);

    const sourceAnchor = b.dx < 0 ? 'left' : 'right';
    const targetAnchor = b.dx < 0 ? 'right' : 'left';

    generatedConnections.push({
      id: `ai-conn-${Date.now()}-${idx}`,
      boardId,
      source: { objectId: rootId, anchor: sourceAnchor },
      target: { objectId: branchId, anchor: targetAnchor },
      lineStyle: 'curved',
      strokePattern: 'solid',
      arrowEnd: true,
      color: '#8b5cf6',
      strokeWidth: 3,
    });
  });

  return { objects: generatedObjects, connections: generatedConnections };
}
