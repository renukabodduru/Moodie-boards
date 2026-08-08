import { Board, CanvasObject, Connection } from '../types/board';
import { getBoundingBox } from './geometry';

export function exportToJSON(
  board: Board,
  objects: CanvasObject[],
  connections: Connection[]
) {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    board,
    objects: objects.filter((o) => o.boardId === board.id),
    connections: connections.filter((c) => c.boardId === board.id),
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${board.name.toLowerCase().replace(/\s+/g, '-')}-workspace.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToMarkdown(board: Board, objects: CanvasObject[]): string {
  const boardObjects = objects.filter((o) => o.boardId === board.id);
  let md = `# ${board.name}\n\n*Exported from Moodie-board on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

  boardObjects.forEach((obj) => {
    switch (obj.type) {
      case 'heading':
        md += `## ${obj.content.text || 'Heading'}\n\n`;
        break;
      case 'note':
        md += `### Note\n${obj.content.text || ''}\n\n`;
        break;
      case 'todo':
        md += `### Checklist: ${obj.content.title || 'Tasks'}\n`;
        (obj.content.items || []).forEach((item: any) => {
          md += `- [${item.completed ? 'x' : ' '}] ${item.text}\n`;
        });
        md += '\n';
        break;
      case 'link':
        md += `### Link: [${obj.content.title || obj.content.url}](${obj.content.url})\n${
          obj.content.description || ''
        }\n\n`;
        break;
      case 'column':
        md += `### Column Container: ${obj.content.title || 'Untitled'}\n\n`;
        break;
      case 'comment':
        md += `> **Comment by ${obj.content.author}**: ${obj.content.text}\n\n`;
        break;
      default:
        break;
    }
  });

  return md;
}

export function downloadMarkdownFile(board: Board, objects: CanvasObject[]) {
  const content = exportToMarkdown(board, objects);
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${board.name.toLowerCase().replace(/\s+/g, '-')}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportCanvasToImage(
  canvasElement: HTMLElement,
  fileName: string = 'moodie-board-export'
) {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(canvasElement, {
      scale: 2,
      backgroundColor: '#f8fafc',
      useCORS: true,
      logging: false,
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${fileName}.png`;
    link.click();
  } catch (err) {
    console.error('PNG export failed, falling back to SVG rasterizer:', err);
    alert('Exporting workspace image... If popup is blocked, please check permissions.');
  }
}
