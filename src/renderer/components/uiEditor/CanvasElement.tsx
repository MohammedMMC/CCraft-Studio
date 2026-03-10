import React, { useState, useRef } from 'react';
import { UIElement } from '../../models/UIElement';
import { useUIElementStore } from '../../stores/uiElementStore';
import { useEditorStore } from '../../stores/editorStore';
import { useHistoryStore } from '../../stores/historyStore';
import { generateId } from '../../utils/idGenerator';

interface CanvasElementProps {
  element: UIElement;
  charWidth: number;
  charHeight: number;
  isSelected: boolean;
  onSelect: () => void;
  screenId: string;
  displayWidth: number;
  displayHeight: number;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  charWidth,
  charHeight,
  isSelected,
  onSelect,
  screenId,
  displayWidth,
  displayHeight,
}) => {
  const moveElement = useUIElementStore((s) => s.moveElement);
  const resizeElement = useUIElementStore((s) => s.resizeElement);

  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef({ x: element.x, y: element.y });
  const resizeOrigin = useRef({ w: element.width, h: element.height });

  if (!element.visible) return null;

  const left = (element.x - 1) * charWidth;
  const top = (element.y - 1) * charHeight;
  const width = element.width * charWidth;
  const height = element.height * charHeight;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragOrigin.current = { x: element.x, y: element.y };

    const handleMove = (me: MouseEvent) => {
      const zoom = useEditorStore.getState().zoom;
      const dx = (me.clientX - e.clientX) / zoom / charWidth;
      const dy = (me.clientY - e.clientY) / zoom / charHeight;
      let newX = Math.round(element.x + dx);
      let newY = Math.round(element.y + dy);
      newX = Math.max(1, Math.min(displayWidth - element.width + 1, newX));
      newY = Math.max(1, Math.min(displayHeight - element.height + 1, newY));
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
    e.stopPropagation();
    resizeOrigin.current = { w: element.width, h: element.height };

    const handleMove = (me: MouseEvent) => {
      const zoom = useEditorStore.getState().zoom;
      const dx = (me.clientX - e.clientX) / zoom / charWidth;
      const dy = (me.clientY - e.clientY) / zoom / charHeight;
      let newW = Math.round(element.width + dx);
      let newH = Math.round(element.height + dy);
      newW = Math.max(1, Math.min(displayWidth - element.x + 1, newW));
      newH = Math.max(1, Math.min(displayHeight - element.y + 1, newH));
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

  return (
    <div
      data-element-overlay
      className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left,
        top,
        width,
        height,
        // Transparent — the terminal canvas underneath handles rendering
        outline: isSelected ? '2px solid #89b4fa' : 'none',
        outlineOffset: '1px',
        zIndex: element.zIndex + (isSelected ? 1000 : 0),
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Selection indicators */}
      {isSelected && (
        <>
          {/* Element name tag */}
          <div
            className="absolute -top-4 left-0 text-[9px] px-1 rounded-t bg-ide-accent text-ide-bg font-medium whitespace-nowrap"
          >
            {element.name}
          </div>

          {/* Resize handle */}
          <div
            className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-ide-accent cursor-se-resize rounded-sm"
            onMouseDown={handleResizeMouseDown}
          />
        </>
      )}
    </div>
  );
};
