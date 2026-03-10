import React, { useState, useCallback, useRef } from 'react';
import { UIElement } from '../../models/UIElement';
import { CC_COLORS } from '../../models/CCColors';
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
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
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
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elemX: element.x,
      elemY: element.y,
    });

    const handleMove = (me: MouseEvent) => {
      const zoom = useEditorStore.getState().zoom;
      const dx = (me.clientX - e.clientX) / zoom / charWidth;
      const dy = (me.clientY - e.clientY) / zoom / charHeight;
      let newX = element.x + dx;
      let newY = element.y + dy;
      newX = Math.round(newX);
      newY = Math.round(newY);
      newX = Math.max(1, Math.min(displayWidth - element.width + 1, newX));
      newY = Math.max(1, Math.min(displayHeight - element.height + 1, newY));
      moveElement(screenId, element.id, newX, newY);
    };

    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      // Push undo command if position actually changed
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
    setIsResizing(true);
    resizeOrigin.current = { w: element.width, h: element.height };

    const handleMove = (me: MouseEvent) => {
      const zoom = useEditorStore.getState().zoom;
      const dx = (me.clientX - e.clientX) / zoom / charWidth;
      const dy = (me.clientY - e.clientY) / zoom / charHeight;
      let newW = element.width + dx;
      let newH = element.height + dy;
      newW = Math.round(newW);
      newH = Math.round(newH);
      newW = Math.max(1, Math.min(displayWidth - element.x + 1, newW));
      newH = Math.max(1, Math.min(displayHeight - element.y + 1, newH));
      resizeElement(screenId, element.id, newW, newH);
    };

    const handleUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      // Push undo command if size actually changed
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

  const renderContent = () => {
    const fgHex = CC_COLORS[element.fgColor].hex;
    const style: React.CSSProperties = {
      color: fgHex,
      fontFamily: 'monospace',
      fontSize: `${charHeight * 0.65}px`,
      lineHeight: `${charHeight}px`,
      whiteSpace: 'pre',
      overflow: 'hidden',
    };

    switch (element.type) {
      case 'label':
        return <div style={style} className="px-0.5">{element.text}</div>;

      case 'button':
        return (
          <div className="flex items-center justify-center w-full h-full" style={style}>
            {element.text}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left,
        top,
        width,
        height,
        backgroundColor: CC_COLORS[element.bgColor].hex,
        outline: isSelected ? '2px solid #89b4fa' : 'none',
        outlineOffset: '1px',
        zIndex: element.zIndex + (isSelected ? 1000 : 0),
      }}
      onMouseDown={handleMouseDown}
    >
      {renderContent()}

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
