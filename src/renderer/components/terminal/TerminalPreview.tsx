import React, { useRef, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { TerminalBuffer } from '../../engine/terminal/TerminalBuffer';
import { TerminalRenderer } from '../../engine/terminal/TerminalRenderer';
import { UIElement } from '../../models/UIElement';

export const TerminalPreview: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<TerminalRenderer | null>(null);

  const screen = project?.screens.find((s) => s.id === activeScreenId);

  const buffer = useMemo(() => {
    if (!project) return null;
    return new TerminalBuffer(project.displayWidth, project.displayHeight);
  }, [project?.displayWidth, project?.displayHeight]);

  // Render elements into the buffer
  useEffect(() => {
    if (!buffer || !screen || !canvasRef.current) return;

    if (!rendererRef.current) {
      rendererRef.current = new TerminalRenderer(canvasRef.current, buffer);
    } else {
      rendererRef.current.setBuffer(buffer);
    }

    // Clear buffer
    buffer.clear('black');

    // Sort elements by z-index and render
    const sortedElements = [...screen.uiElements]
      .filter((e) => e.visible)
      .sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sortedElements) {
      renderElementToBuffer(buffer, el);
    }

    rendererRef.current.render();
  }, [buffer, screen, screen?.uiElements]);

  if (!project || !buffer) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>Terminal Preview</span>
        <span className="text-[10px] font-normal text-ide-text-dim normal-case tracking-normal">
          {project.displayWidth}x{project.displayHeight}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center p-3 bg-black/30 overflow-auto">
        <canvas
          ref={canvasRef}
          className="border border-ide-border/30"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>
  );
};

function renderElementToBuffer(buffer: TerminalBuffer, el: UIElement) {
  const x = el.x - 1;
  const y = el.y - 1;

  switch (el.type) {
    case 'label': {
      buffer.fillRect(x, y, el.width, el.height, ' ', el.fgColor, el.bgColor);
      const text = alignText(el.text, el.width, el.textAlign);
      buffer.writeText(x, y, text.slice(0, el.width), el.fgColor, el.bgColor);
      break;
    }

    case 'button': {
      buffer.fillRect(x, y, el.width, el.height, ' ', el.fgColor, el.bgColor);
      const midY = y + Math.floor(el.height / 2);
      const text = alignText(el.text, el.width, el.textAlign);
      buffer.writeText(x, midY, text.slice(0, el.width), el.fgColor, el.bgColor);
      break;
    }
  }
}

function alignText(text: string, width: number, align: 'left' | 'center' | 'right'): string {
  if (text.length >= width) return text.slice(0, width);
  const padding = width - text.length;
  switch (align) {
    case 'center': {
      const left = Math.floor(padding / 2);
      return ' '.repeat(left) + text + ' '.repeat(padding - left);
    }
    case 'right':
      return ' '.repeat(padding) + text;
    default:
      return text + ' '.repeat(padding);
  }
}
