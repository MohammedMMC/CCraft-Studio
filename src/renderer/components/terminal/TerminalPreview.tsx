import React, { useRef, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { TerminalBuffer } from '../../engine/terminal/TerminalBuffer';
import { TerminalRenderer } from '../../engine/terminal/TerminalRenderer';
import { UIElement } from '../../models/UIElement';
import { CCColor } from '../../models/CCColors';

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

    case 'textInput': {
      buffer.fillRect(x, y, el.width, el.height, ' ', el.fgColor, el.bgColor);
      const displayText = el.defaultValue || el.placeholder;
      const fg: CCColor = el.defaultValue ? el.fgColor : 'lightGray';
      buffer.writeText(x, y, displayText.slice(0, el.width), fg, el.bgColor);
      break;
    }

    case 'progressBar': {
      const pct = el.maxValue > 0 ? el.value / el.maxValue : 0;
      const fillW = Math.floor(el.width * pct);
      for (let i = 0; i < el.width; i++) {
        const isFill = i < fillW;
        buffer.setCell(
          x + i, y,
          isFill ? el.fillChar : el.emptyChar,
          isFill ? el.fillColor : el.emptyColor,
          el.bgColor
        );
      }
      if (el.showPercentage) {
        const pctText = `${Math.round(pct * 100)}%`;
        const px = x + Math.floor((el.width - pctText.length) / 2);
        buffer.writeText(px, y, pctText, el.fgColor, el.bgColor);
      }
      break;
    }

    case 'list': {
      buffer.fillRect(x, y, el.width, el.height, ' ', el.fgColor, el.bgColor);
      for (let i = 0; i < el.height && i + el.scrollOffset < el.items.length; i++) {
        const itemIdx = i + el.scrollOffset;
        const item = el.items[itemIdx] || '';
        const isSelected = itemIdx === el.selectedIndex;
        const fg = isSelected ? el.selectedFgColor : el.fgColor;
        const bg = isSelected ? el.selectedBgColor : el.bgColor;
        buffer.fillRect(x, y + i, el.width, 1, ' ', fg, bg);
        buffer.writeText(x, y + i, item.slice(0, el.width), fg, bg);
      }
      break;
    }

    case 'panel': {
      if (el.filled) {
        buffer.fillRect(x, y, el.width, el.height, ' ', el.fgColor, el.bgColor);
      }
      if (el.borderStyle !== 'none') {
        const c = el.borderStyle === 'rounded'
          ? { tl: '\u256d', tr: '\u256e', bl: '\u2570', br: '\u256f', h: '\u2500', v: '\u2502' }
          : el.borderStyle === 'double'
            ? { tl: '\u2554', tr: '\u2557', bl: '\u255a', br: '\u255d', h: '\u2550', v: '\u2551' }
            : { tl: '\u250c', tr: '\u2510', bl: '\u2514', br: '\u2518', h: '\u2500', v: '\u2502' };

        buffer.setCell(x, y, c.tl, el.borderColor, el.bgColor);
        buffer.setCell(x + el.width - 1, y, c.tr, el.borderColor, el.bgColor);
        buffer.setCell(x, y + el.height - 1, c.bl, el.borderColor, el.bgColor);
        buffer.setCell(x + el.width - 1, y + el.height - 1, c.br, el.borderColor, el.bgColor);

        for (let i = 1; i < el.width - 1; i++) {
          buffer.setCell(x + i, y, c.h, el.borderColor, el.bgColor);
          buffer.setCell(x + i, y + el.height - 1, c.h, el.borderColor, el.bgColor);
        }
        for (let i = 1; i < el.height - 1; i++) {
          buffer.setCell(x, y + i, c.v, el.borderColor, el.bgColor);
          buffer.setCell(x + el.width - 1, y + i, c.v, el.borderColor, el.bgColor);
        }

        if (el.title) {
          buffer.writeText(x + 2, y, el.title.slice(0, el.width - 4), el.fgColor, el.bgColor);
        }
      }
      break;
    }

    case 'statusBar': {
      buffer.fillRect(x, y, el.width, el.height, ' ', el.fgColor, el.bgColor);
      const text = alignText(el.text, el.width, el.textAlign);
      buffer.writeText(x, y, text.slice(0, el.width), el.fgColor, el.bgColor);
      break;
    }

    case 'image': {
      buffer.fillRect(x, y, el.width, el.height, '?', el.fgColor, el.bgColor);
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
