import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { useUIElementStore } from '../../stores/uiElementStore';
import { TerminalBuffer } from '../../engine/terminal/TerminalBuffer';
import { TerminalRenderer } from '../../engine/terminal/TerminalRenderer';
import { UIElement } from '../../models/UIElement';
import { CanvasElement } from './CanvasElement';
import { GridOverlay } from './GridOverlay';

// Match the TerminalRenderer cell size so overlays align pixel-perfectly
const CC_CHAR_WIDTH = 6;
const CC_CHAR_HEIGHT = 9;
const SCALE = 2;
export const CHAR_WIDTH = CC_CHAR_WIDTH * SCALE;
export const CHAR_HEIGHT = CC_CHAR_HEIGHT * SCALE;

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

export const UIEditorCanvas: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const zoom = useEditorStore((s) => s.zoom);
  const panOffset = useEditorStore((s) => s.panOffset);
  const setPanOffset = useEditorStore((s) => s.setPanOffset);
  const showGrid = useEditorStore((s) => s.showGrid);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectElement = useEditorStore((s) => s.selectElement);
  const tool = useEditorStore((s) => s.tool);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<TerminalRenderer | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const didPanRef = useRef(false);

  const screen = project?.screens.find((s) => s.id === activeScreenId);

  const buffer = useMemo(() => {
    if (!project) return null;
    return new TerminalBuffer(project.displayWidth, project.displayHeight);
  }, [project?.displayWidth, project?.displayHeight]);

  // Re-render the terminal canvas whenever elements change
  useEffect(() => {
    if (!buffer || !screen || !canvasRef.current) return;

    if (!rendererRef.current) {
      rendererRef.current = new TerminalRenderer(canvasRef.current, buffer);
    } else {
      rendererRef.current.setBuffer(buffer);
    }

    buffer.clear('black');

    const sorted = [...screen.uiElements]
      .filter((e) => e.visible)
      .sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sorted) {
      renderElementToBuffer(buffer, el);
    }

    rendererRef.current.render();
  }, [buffer, screen, screen?.uiElements]);

  // Ctrl+scroll zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        useEditorStore.getState().setZoom(useEditorStore.getState().zoom + delta);
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  if (!project || !activeScreenId || !screen || !buffer) return null;

  const canvasWidth = project.displayWidth * CHAR_WIDTH;
  const canvasHeight = project.displayHeight * CHAR_HEIGHT;
  const elements = [...screen.uiElements].sort((a, b) => a.zIndex - b.zIndex);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle-click or left-click on background to pan
    const target = e.target as HTMLElement;
    const isOnElement = target.closest('[data-element-overlay]');
    if (e.button === 1 || (e.button === 0 && !isOnElement)) {
      setIsPanning(true);
      didPanRef.current = false;
      panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      didPanRef.current = true;
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't deselect if we just finished panning
    if (didPanRef.current) {
      didPanRef.current = false;
      return;
    }
    // Deselect when clicking on empty canvas area (not on an element overlay)
    const target = e.target as HTMLElement;
    const isOnElement = target.closest('[data-element-overlay]');
    if (!isOnElement) {
      selectElement(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden bg-ide-bg relative select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      {/* Centered canvas with zoom and pan */}
      <div
        className="absolute"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          left: '50%',
          top: '50%',
          marginLeft: -(canvasWidth / 2),
          marginTop: -(canvasHeight / 2),
        }}
      >
        {/* Terminal-style rendered canvas */}
        <div
          className="relative border border-ide-border/50 shadow-lg"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{
              width: canvasWidth,
              height: canvasHeight,
              imageRendering: 'pixelated',
              pointerEvents: 'none',
            }}
          />

          {/* Grid overlay */}
          {showGrid && (
            <GridOverlay
              width={project.displayWidth}
              height={project.displayHeight}
              charWidth={CHAR_WIDTH}
              charHeight={CHAR_HEIGHT}
            />
          )}

          {/* Transparent interactive overlays for each element */}
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              charWidth={CHAR_WIDTH}
              charHeight={CHAR_HEIGHT}
              isSelected={element.id === selectedElementId}
              onSelect={() => selectElement(element.id)}
              screenId={activeScreenId}
              displayWidth={project.displayWidth}
              displayHeight={project.displayHeight}
            />
          ))}
        </div>

        {/* Dimension labels */}
        <div className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-ide-text-dim">
          {project.displayWidth} x {project.displayHeight}
        </div>
      </div>
    </div>
  );
};
