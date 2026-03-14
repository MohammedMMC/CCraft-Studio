import React, { useState, useRef } from 'react';
import { UIElement, resolveSize } from '../../models/UIElement';
import { useUIElementStore } from '../../stores/uiElementStore';
import { useEditorStore } from '../../stores/editorStore';
import { useHistoryStore } from '../../stores/historyStore';
import { generateId } from '../../utils/idGenerator';

interface CanvasElementProps {
  element: UIElement;
  resolvedPosition: { x: number; y: number; width: number; height: number };
  charWidth: number;
  charHeight: number;
  isSelected: boolean;
  onSelect: () => void;
  screenId: string;
  displayWidth: number;
  displayHeight: number;
  depth: number;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  resolvedPosition,
  charWidth,
  charHeight,
  isSelected,
  onSelect,
  screenId,
  displayWidth,
  displayHeight,
  depth,
}) => {
  const moveElement = useUIElementStore((s) => s.moveElement);
  const resizeElement = useUIElementStore((s) => s.resizeElement);

  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef({ x: element.x, y: element.y });
  const resizeOrigin = useRef({ w: element.width, h: element.height });

  if (!element.visible) return null;

  const isChild = element.parentId !== null;
  const left = (resolvedPosition.x - 1) * charWidth;
  const top = (resolvedPosition.y - 1) * charHeight;
  const width = resolvedPosition.width * charWidth;
  const height = resolvedPosition.height * charHeight;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();

    // Don't allow positional dragging for children inside containers
    if (isChild) return;

    setIsDragging(true);
    dragOrigin.current = { x: element.x, y: element.y };

    const handleMove = (me: MouseEvent) => {
      const zoom = useEditorStore.getState().zoom;
      const el = useUIElementStore.getState().getElementById(screenId, element.id);
      const rw = el ? resolveSize(el, displayWidth, displayHeight).width : resolvedPosition.width;
      const rh = el ? resolveSize(el, displayWidth, displayHeight).height : resolvedPosition.height;
      const dx = (me.clientX - e.clientX) / zoom / charWidth;
      const dy = (me.clientY - e.clientY) / zoom / charHeight;
      let newX = Math.round(element.x + dx);
      let newY = Math.round(element.y + dy);
      newX = Math.max(1, Math.min(displayWidth - rw + 1, newX));
      newY = Math.max(1, Math.min(displayHeight - rh + 1, newY));
      moveElement(screenId, element.id, newX, newY);
    };

    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      const el = useUIElementStore.getState().getElementById(screenId, element.id);
      if (el && (el.x !== dragOrigin.current.x || el.y !== dragOrigin.current.y)) {
        const origX = dragOrigin.current.x;
        const origY = dragOrigin.current.y;
        const finalX = el.x;
        const finalY = el.y;
        const sid = screenId;
        const eid = element.id;
        useHistoryStore.getState().push({
          id: generateId(),
          description: `Move ${element.name}`,
          execute: () => moveElement(sid, eid, finalX, finalY),
          undo: () => moveElement(sid, eid, origX, origY),
        });
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    // Don't allow resize for children inside containers
    if (isChild) return;

    e.stopPropagation();
    resizeOrigin.current = { w: element.width, h: element.height };

    const handleMove = (me: MouseEvent) => {
      const zoom = useEditorStore.getState().zoom;
      const dx = (me.clientX - e.clientX) / zoom / charWidth;
      const dy = (me.clientY - e.clientY) / zoom / charHeight;

      const maxW = displayWidth - element.x + 1;
      const maxH = displayHeight - element.y + 1;

      let newResolvedW = Math.round(resolvedPosition.width + dx);
      let newResolvedH = Math.round(resolvedPosition.height + dy);
      newResolvedW = Math.max(1, Math.min(maxW, newResolvedW));
      newResolvedH = Math.max(1, Math.min(maxH, newResolvedH));

      let newW = newResolvedW;
      if (element.widthUnit === '%') newW = Math.max(1, Math.min(100, Math.round((newResolvedW / displayWidth) * 100)));
      else if (element.widthUnit === 'fill') newW = element.width;

      let newH = newResolvedH;
      if (element.heightUnit === '%') newH = Math.max(1, Math.min(100, Math.round((newResolvedH / displayHeight) * 100)));
      else if (element.heightUnit === 'fill') newH = element.height;

      resizeElement(screenId, element.id, newW, newH);
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      const el = useUIElementStore.getState().getElementById(screenId, element.id);
      if (el && (el.width !== resizeOrigin.current.w || el.height !== resizeOrigin.current.h)) {
        const origW = resizeOrigin.current.w;
        const origH = resizeOrigin.current.h;
        const finalW = el.width;
        const finalH = el.height;
        const sid = screenId;
        const eid = element.id;
        useHistoryStore.getState().push({
          id: generateId(),
          description: `Resize ${element.name}`,
          execute: () => resizeElement(sid, eid, finalW, finalH),
          undo: () => resizeElement(sid, eid, origW, origH),
        });
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const isContainer = element.type === 'container';

  return (
    <div
      data-element-overlay
      className={`absolute ${isChild ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left,
        top,
        width,
        height,
        outline: isSelected
          ? `2px ${isContainer ? 'dashed' : 'solid'} #89b4fa`
          : 'none',
        outlineOffset: '1px',
        zIndex: element.zIndex + depth * 100 + (isSelected ? 1000 : 0),
      }}
      onMouseDown={handleMouseDown}
    >
      {isSelected && (
        <>
          <div
            className="absolute -top-4 left-0 text-[9px] px-1 rounded-t bg-ide-accent text-ide-bg font-medium whitespace-nowrap"
          >
            {element.name}
          </div>

          {/* Resize handle (not for children inside containers) */}
          {!isChild && (
            <div
              className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-ide-accent cursor-se-resize rounded-sm"
              onMouseDown={handleResizeMouseDown}
            />
          )}
        </>
      )}
    </div>
  );
};
