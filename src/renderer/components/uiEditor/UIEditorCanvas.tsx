import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { useUIElementStore } from '../../stores/uiElementStore';
import { UIElement } from '../../models/UIElement';
import { CC_COLORS } from '../../models/CCColors';
import { CanvasElement } from './CanvasElement';
import { GridOverlay } from './GridOverlay';

const CHAR_WIDTH = 12;
const CHAR_HEIGHT = 18;

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
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  if (!project || !activeScreenId) return null;

  const screen = project.screens.find((s) => s.id === activeScreenId);
  if (!screen) return null;

  const canvasWidth = project.displayWidth * CHAR_WIDTH;
  const canvasHeight = project.displayHeight * CHAR_HEIGHT;

  const elements = [...screen.uiElements].sort((a, b) => a.zIndex - b.zIndex);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset?.canvas) {
      selectElement(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && tool === 'pan') || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [isPanning, panStart, setPanOffset]
  );

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      useEditorStore.getState().setZoom(zoom + delta);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden bg-ide-bg relative cursor-default"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
      style={{ cursor: isPanning ? 'grabbing' : tool === 'pan' ? 'grab' : 'default' }}
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
        {/* Terminal background */}
        <div
          className="relative border border-ide-border/50 shadow-lg"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: CC_COLORS.black.hex,
          }}
          data-canvas="true"
        >
          {/* Grid overlay */}
          {showGrid && (
            <GridOverlay
              width={project.displayWidth}
              height={project.displayHeight}
              charWidth={CHAR_WIDTH}
              charHeight={CHAR_HEIGHT}
            />
          )}

          {/* UI Elements */}
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

export { CHAR_WIDTH, CHAR_HEIGHT };
