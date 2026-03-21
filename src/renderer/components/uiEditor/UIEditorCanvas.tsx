import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { TerminalBuffer } from '../../engine/terminal/TerminalBuffer';
import { TerminalRenderer } from '../../engine/terminal/TerminalRenderer';
import { UIElement, ContainerElement, PanelElement, resolveSize, resolveContainerLayout, isContainerLike, SliderElement } from '../../models/UIElement';
import { CanvasElement } from './CanvasElement';
import { GridOverlay } from './GridOverlay';

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
  isChild = false,
) {
  const x = el.x - 1;
  const y = el.y - 1;
  const { width, height } = isChild ? { width: displayWidth, height: displayHeight } : resolveSize(el, displayWidth, displayHeight);

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
    case 'container':
    case 'panel': {
      if (el.type === 'panel') {
        const panel = el as PanelElement;

        const text = alignText(panel.text, width, panel.textAlign);
        const textsp = [(text.length - text.trimStart().length), (text.length - text.trimEnd().length)];
        const plus2 = width < panel.text.length + 4 ? 0 : 2;
        const textpos = (textsp[1] == 0 ? textsp[0] - 4 + Number(textsp[0] == 4) + (plus2 == 0 ? 3 : 0) + Number(textsp[0] == 5) : (textsp[0] == 0 ? (Number(width == (plus2 + Number(textsp[1] == 5) + panel.text.length + 2)) || plus2 || 1) : (textsp[0] - (plus2 == 2 ? 1 : 0))));

        buffer.fillRect(x, y, textpos, 1, ' ', panel.fgColor, panel.borderColor);
        buffer.fillRect(x + (textpos + panel.text.length + 2) + (textsp[0] != 2 && plus2 == 0 ? -2 : 0), y, width - (textpos + panel.text.length + 2) + (textsp[0] != 2 && plus2 == 0 ? 1 : 0), 1, ' ', panel.fgColor, panel.borderColor);

        buffer.fillRect(x, y + height - 1, width, 1, ' ', panel.fgColor, panel.borderColor);
        buffer.fillRect(x, y, 1, height, ' ', panel.fgColor, panel.borderColor);
        buffer.fillRect(x + width - 1, y, 1, height, ' ', panel.fgColor, panel.borderColor);

        if (width > 2 && height > 2) {
          buffer.fillRect(x + 1, y + 1, width - 2, height - 2, ' ', panel.fgColor, panel.bgColor);
        }

        buffer.writeText(x + textpos, y, (plus2 == 2 ? " " : "") + text.trimStart().trimEnd() + (plus2 == 2 ? " " : ""), panel.fgColor, panel.titleBgColor);
      } else {
        buffer.fillRect(x, y, width, height, ' ', el.fgColor, el.bgColor);
      }

      const children = allElements
        .filter(c => c.parentId === el.id && c.visible)
        .sort((a, b) => a.zIndex - b.zIndex);

      const positions = resolveContainerLayout(
        el as ContainerElement | PanelElement, children, el.x, el.y, width, height, displayWidth, displayHeight,
      );

      for (const pos of positions) {
        const child = children.find(c => c.id === pos.id);
        if (!child) continue;
        renderChildAtPosition(buffer, child, allElements, pos.x, pos.y, pos.width, pos.height);
      }
      break;
    }
    case 'progressbar': {
      buffer.fillRect(x, y, width, height, ' ', el.fgColor, el.bgColor);
      const progressWidth = Math.round(width / 100 * el.progress);

      buffer.fillRect(x, y, progressWidth, height, ' ', el.progressColor, el.progressColor);
      const text = alignText(el.text, width, el.textAlign);
      text.slice(0, width).split('').forEach((char, i) => {
        buffer.writeText(x + i, y + Math.floor(height / 2), char, el.fgColor, i < progressWidth ? el.progressColor : el.bgColor);
      });
      break;
    }
    case 'slider': {
      let percentValue = Math.round((el.value - el.from) * 100 / (el.to - el.from));

      buffer.fillRect(x, y, width, height, ' ', el.bgColor, el.bgColor);
      if (el.orientation.startsWith("v")) {
        buffer.fillRect(x, y + (el.orientation == "vbtt" ? Math.round(height * (100 - percentValue) / 100) : 0), width, Math.round(height * percentValue / 100), ' ', el.filledColor, el.filledColor);
        buffer.fillRect(x, y + Math.round((height - 1) * (el.orientation == "vbtt" ? 100 - percentValue : percentValue) / 100), width, 1, ' ', el.handleColor, el.handleColor);
      } else {
        buffer.fillRect(x + (el.orientation == "hrtl" ? Math.round(width * (100 - percentValue) / 100) : 0), y, Math.round(width * percentValue / 100), height, ' ', el.filledColor, el.filledColor);
        buffer.fillRect(x + Math.round((width - 1) * (el.orientation == "hrtl" ? 100 - percentValue : percentValue) / 100), y, 1, height, ' ', el.handleColor, el.handleColor);
      }
      break;
    }
    case 'checkbox': {
      const boxSize = Math.min(width, height);
      buffer.fillRect(x, y, width, height, ' ', el.bgColor, el.bgColor);
      buffer.fillRect(x, y, boxSize, boxSize, ' ', el.boxColor, el.boxColor);

      if (el.checked) {
        const icon = el.checkIcon || 'x';
        buffer.writeText(x + Math.floor((boxSize - 1) / 2), y + Math.floor((boxSize - 1) / 2), icon, el.checkColor, el.boxColor);
      }

      const text = alignText(el.text, width - boxSize - 1, el.textAlign);
      buffer.writeText(x + boxSize + 1, y + Math.floor(height / 2), text.slice(0, width - boxSize - 1), el.textColor, el.bgColor);
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

  if (!["panel", "container"].includes(child.type)) {
    child.x = absX; child.y = absY;
    renderElementToBuffer(buffer, child, allElements, width, height, true);
    return;
  }

  switch (child.type) {
    case 'container':
    case 'panel': {
      if (child.type === 'panel') {
        const panel = child as PanelElement;

        const text = alignText(panel.text, width, panel.textAlign);
        const textsp = [(text.length - text.trimStart().length), (text.length - text.trimEnd().length)];
        const plus2 = width < panel.text.length + 4 ? 0 : 2;
        const textpos = (textsp[1] == 0 ? textsp[0] - 4 + Number(textsp[0] == 4) + (plus2 == 0 ? 3 : 0) + Number(textsp[0] == 5) : (textsp[0] == 0 ? (Number(width == (plus2 + Number(textsp[1] == 5) + panel.text.length + 2)) || plus2 || 1) : (textsp[0] - (plus2 == 2 ? 1 : 0))));

        buffer.fillRect(x, y, textpos, 1, ' ', panel.fgColor, panel.borderColor);
        buffer.fillRect(x + (textpos + panel.text.length + 2) + (textsp[0] != 2 && plus2 == 0 ? -2 : 0), y, width - (textpos + panel.text.length + 2) + (textsp[0] != 2 && plus2 == 0 ? 1 : 0), 1, ' ', panel.fgColor, panel.borderColor);

        buffer.fillRect(x, y + height - 1, width, 1, ' ', panel.fgColor, panel.borderColor);
        buffer.fillRect(x, y, 1, height, ' ', panel.fgColor, panel.borderColor);
        buffer.fillRect(x + width - 1, y, 1, height, ' ', panel.fgColor, panel.borderColor);

        if (width > 2 && height > 2) {
          buffer.fillRect(x + 1, y + 1, width - 2, height - 2, ' ', panel.fgColor, panel.bgColor);
        }

        buffer.writeText(x + textpos, y, (plus2 == 2 ? " " : "") + text.trimStart().trimEnd() + (plus2 == 2 ? " " : ""), panel.fgColor, panel.titleBgColor);
      } else {
        buffer.fillRect(x, y, width, height, ' ', child.fgColor, child.bgColor);
      }
      const grandchildren = allElements
        .filter(c => c.parentId === child.id && c.visible)
        .sort((a, b) => a.zIndex - b.zIndex);
      const positions = resolveContainerLayout(
        child as ContainerElement | PanelElement, grandchildren,
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
    container: ContainerElement | PanelElement,
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
      if (child && isContainerLike(child)) {
        resolveContainer(child as ContainerElement | PanelElement, pos.x, pos.y, pos.width, pos.height);
      }
    }
  }

  for (const el of elements) {
    if (el.parentId !== null) continue;
    const resolved = resolveSize(el, displayWidth, displayHeight);
    map.set(el.id, { x: el.x, y: el.y, width: resolved.width, height: resolved.height });

    if (isContainerLike(el)) {
      resolveContainer(el as ContainerElement | PanelElement, el.x, el.y, resolved.width, resolved.height);
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

  const resolvedPositionMap = useMemo(() => {
    if (!screen || !project) return new Map();
    return buildResolvedPositionMap(screen.uiElements, project.displayWidth, project.displayHeight);
  }, [screen?.uiElements, project?.displayWidth, project?.displayHeight]);

  useEffect(() => {
    if (!buffer || !screen || !canvasRef.current || !project) return;

    if (!rendererRef.current) {
      rendererRef.current = new TerminalRenderer(canvasRef.current, buffer);
    } else {
      rendererRef.current.setBuffer(buffer);
    }

    buffer.clear('black');

    const sorted = [...screen.uiElements]
      .filter((e) => e.visible && e.parentId === null)
      .sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sorted) {
      renderElementToBuffer(buffer, el, screen.uiElements, project.displayWidth, project.displayHeight);
    }

    rendererRef.current.render();
  }, [buffer, screen, screen?.uiElements]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      useEditorStore.getState().setZoom(useEditorStore.getState().zoom + delta);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  if (!project || !activeScreenId || !screen || !buffer) return null;

  const canvasWidth = project.displayWidth * CHAR_WIDTH;
  const canvasHeight = project.displayHeight * CHAR_HEIGHT;
  const elements = [...screen.uiElements].sort((a, b) => a.zIndex - b.zIndex);

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
      className="flex-1 overflow-hidden bg-app-bg relative select-none"
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
          transform: `translate(calc(${panOffset.x}px - ${(zoom - 1) * 100 / 2}%), calc(${panOffset.y}px - ${(zoom - 1) * 100 / 2}%)) scale(${zoom})`,
          transformOrigin: '0 0',
          left: '50%',
          top: '50%',
          marginLeft: -(canvasWidth / 2),
          marginTop: -(canvasHeight / 2),
        }}
      >
        <div
          className="relative border border-app-border/50 shadow-lg"
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

        <div className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-app-text-dim">
          {project.displayWidth} x {project.displayHeight}
        </div>
      </div>
    </div>
  );
};
