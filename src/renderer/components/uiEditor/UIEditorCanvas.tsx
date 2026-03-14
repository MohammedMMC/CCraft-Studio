import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { useUIElementStore } from '../../stores/uiElementStore';
import { TerminalBuffer } from '../../engine/terminal/TerminalBuffer';
import { TerminalRenderer } from '../../engine/terminal/TerminalRenderer';
import { UIElement, ContainerElement, resolveSize, resolveContainerLayout } from '../../models/UIElement';
import { CanvasElement } from './CanvasElement';
import { GridOverlay } from './GridOverlay';

// Match the TerminalRenderer cell size so overlays align pixel-perfectly
const CC_CHAR_WIDTH = 6;
const CC_CHAR_HEIGHT = 9;
const SCALE = 2;
export const CHAR_WIDTH = CC_CHAR_WIDTH * SCALE;
export const CHAR_HEIGHT = CC_CHAR_HEIGHT * SCALE;

function renderElementToBuffer(
  buffer: TerminalBuffer,
  el: UIElement,
  allElements: UIElement[],
  displayWidth: number,
  displayHeight: number,
) {
  const x = el.x - 1;
  const y = el.y - 1;
  const { width, height } = resolveSize(el, displayWidth, displayHeight);

  switch (el.type) {
    case 'label': {
      buffer.fillRect(x, y, width, height, ' ', el.fgColor, el.bgColor);
      const text = alignText(el.text, width, el.textAlign);
      buffer.writeText(x, y, text.slice(0, width), el.fgColor, el.bgColor);
      break;
    }
    case 'button': {
      buffer.fillRect(x, y, width, height, ' ', el.fgColor, el.bgColor);
      const midY = y + Math.floor(height / 2);
      const text = alignText(el.text, width, el.textAlign);
      buffer.writeText(x, midY, text.slice(0, width), el.fgColor, el.bgColor);
      break;
    }
    case 'container': {
      // Fill container background
      buffer.fillRect(x, y, width, height, ' ', el.fgColor, el.bgColor);

      // Find and render children
      const children = allElements
        .filter(c => c.parentId === el.id && c.visible)
        .sort((a, b) => a.zIndex - b.zIndex);

      const positions = resolveContainerLayout(
        el, children, el.x, el.y, width, height, displayWidth, displayHeight,
      );

      for (const pos of positions) {
        const child = children.find(c => c.id === pos.id);
        if (!child) continue;
        renderChildAtPosition(buffer, child, allElements, pos.x, pos.y, pos.width, pos.height);
      }
      break;
    }
  }
}

function renderChildAtPosition(
  buffer: TerminalBuffer,
  child: UIElement,
  allElements: UIElement[],
  absX: number, absY: number,
  width: number, height: number,
) {
  const x = absX - 1;
  const y = absY - 1;

  switch (child.type) {
    case 'label': {
      buffer.fillRect(x, y, width, height, ' ', child.fgColor, child.bgColor);
      const text = alignText(child.text, width, child.textAlign);
      buffer.writeText(x, y, text.slice(0, width), child.fgColor, child.bgColor);
      break;
    }
    case 'button': {
      buffer.fillRect(x, y, width, height, ' ', child.fgColor, child.bgColor);
      const midY = y + Math.floor(height / 2);
      const text = alignText(child.text, width, child.textAlign);
      buffer.writeText(x, midY, text.slice(0, width), child.fgColor, child.bgColor);
      break;
    }
    case 'container': {
      buffer.fillRect(x, y, width, height, ' ', child.fgColor, child.bgColor);
      const grandchildren = allElements
        .filter(c => c.parentId === child.id && c.visible)
        .sort((a, b) => a.zIndex - b.zIndex);
      const positions = resolveContainerLayout(
        child as ContainerElement, grandchildren,
        absX, absY, width, height, width, height,
      );
      for (const pos of positions) {
        const gc = grandchildren.find(c => c.id === pos.id);
        if (!gc) continue;
        renderChildAtPosition(buffer, gc, allElements, pos.x, pos.y, pos.width, pos.height);
      }
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

/** Compute resolved {x, y, width, height} for every element including container children */
function buildResolvedPositionMap(
  elements: UIElement[],
  displayWidth: number,
  displayHeight: number,
): Map<string, { x: number; y: number; width: number; height: number }> {
  const map = new Map<string, { x: number; y: number; width: number; height: number }>();

  function resolveContainer(
    container: ContainerElement,
    cx: number, cy: number,
    cw: number, ch: number,
  ) {
    const children = elements
      .filter(c => c.parentId === container.id && c.visible)
      .sort((a, b) => a.zIndex - b.zIndex);
    const positions = resolveContainerLayout(
      container, children, cx, cy, cw, ch, cw, ch,
    );
    for (const pos of positions) {
      map.set(pos.id, { x: pos.x, y: pos.y, width: pos.width, height: pos.height });
      const child = children.find(c => c.id === pos.id);
      if (child?.type === 'container') {
        resolveContainer(child as ContainerElement, pos.x, pos.y, pos.width, pos.height);
      }
    }
  }

  for (const el of elements) {
    if (el.parentId !== null) continue;
    const resolved = resolveSize(el, displayWidth, displayHeight);
    map.set(el.id, { x: el.x, y: el.y, width: resolved.width, height: resolved.height });

    if (el.type === 'container') {
      resolveContainer(el as ContainerElement, el.x, el.y, resolved.width, resolved.height);
    }
  }
  return map;
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

  // Resolved position map for overlays
  const resolvedPositionMap = useMemo(() => {
    if (!screen || !project) return new Map();
    return buildResolvedPositionMap(screen.uiElements, project.displayWidth, project.displayHeight);
  }, [screen?.uiElements, project?.displayWidth, project?.displayHeight]);

  // Re-render the terminal canvas whenever elements change
  useEffect(() => {
    if (!buffer || !screen || !canvasRef.current || !project) return;

    if (!rendererRef.current) {
      rendererRef.current = new TerminalRenderer(canvasRef.current, buffer);
    } else {
      rendererRef.current.setBuffer(buffer);
    }

    buffer.clear('black');

    // Only render top-level elements; children are rendered by their container
    const sorted = [...screen.uiElements]
      .filter((e) => e.visible && e.parentId === null)
      .sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sorted) {
      renderElementToBuffer(buffer, el, screen.uiElements, project.displayWidth, project.displayHeight);
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

  // Compute nesting depth so children overlay above their parent container
  const depthMap = useMemo(() => {
    const map = new Map<string, number>();
    const getDepth = (el: UIElement): number => {
      if (map.has(el.id)) return map.get(el.id)!;
      if (el.parentId === null) { map.set(el.id, 0); return 0; }
      const parent = screen!.uiElements.find(e => e.id === el.parentId);
      const d = parent ? getDepth(parent) + 1 : 0;
      map.set(el.id, d);
      return d;
    };
    for (const el of screen!.uiElements) getDepth(el);
    return map;
  }, [screen?.uiElements]);

  const handleMouseDown = (e: React.MouseEvent) => {
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
    if (didPanRef.current) {
      didPanRef.current = false;
      return;
    }
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

          {showGrid && (
            <GridOverlay
              width={project.displayWidth}
              height={project.displayHeight}
              charWidth={CHAR_WIDTH}
              charHeight={CHAR_HEIGHT}
            />
          )}

          {elements.map((element) => {
            const resolvedPos = resolvedPositionMap.get(element.id);
            if (!resolvedPos) return null;
            return (
              <CanvasElement
                key={element.id}
                element={element}
                resolvedPosition={resolvedPos}
                charWidth={CHAR_WIDTH}
                charHeight={CHAR_HEIGHT}
                isSelected={element.id === selectedElementId}
                onSelect={() => selectElement(element.id)}
                screenId={activeScreenId}
                displayWidth={project.displayWidth}
                displayHeight={project.displayHeight}
                depth={depthMap.get(element.id) ?? 0}
              />
            );
          })}
        </div>

        <div className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-ide-text-dim">
          {project.displayWidth} x {project.displayHeight}
        </div>
      </div>
    </div>
  );
};
