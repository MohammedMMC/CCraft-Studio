import React, { useState, useCallback } from 'react';
import { UIElement } from '../../models/UIElement';
import { CC_COLORS } from '../../models/CCColors';
import { useUIElementStore } from '../../stores/uiElementStore';
import { useEditorStore } from '../../stores/editorStore';

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
  const snapToGrid = useEditorStore((s) => s.snapToGrid);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  if (!element.visible) return null;

  const left = (element.x - 1) * charWidth;
  const top = (element.y - 1) * charHeight;
  const width = element.width * charWidth;
  const height = element.height * charHeight;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
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
      if (snapToGrid) {
        newX = Math.round(newX);
        newY = Math.round(newY);
      }
      newX = Math.max(1, Math.min(displayWidth - element.width + 1, newX));
      newY = Math.max(1, Math.min(displayHeight - element.height + 1, newY));
      moveElement(screenId, element.id, newX, newY);
    };

    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);

    const handleMove = (me: MouseEvent) => {
      const zoom = useEditorStore.getState().zoom;
      const dx = (me.clientX - e.clientX) / zoom / charWidth;
      const dy = (me.clientY - e.clientY) / zoom / charHeight;
      let newW = element.width + dx;
      let newH = element.height + dy;
      if (snapToGrid) {
        newW = Math.round(newW);
        newH = Math.round(newH);
      }
      newW = Math.max(1, Math.min(displayWidth - element.x + 1, newW));
      newH = Math.max(1, Math.min(displayHeight - element.y + 1, newH));
      resizeElement(screenId, element.id, newW, newH);
    };

    const handleUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
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

      case 'textInput':
        return (
          <div style={{ ...style, opacity: 0.5 }} className="px-0.5">
            {element.placeholder}
          </div>
        );

      case 'progressBar': {
        const pct = element.maxValue > 0 ? element.value / element.maxValue : 0;
        const fillW = Math.floor(element.width * pct);
        const emptyW = element.width - fillW;
        return (
          <div style={style} className="px-0.5">
            <span style={{ color: CC_COLORS[element.fillColor].hex }}>
              {element.fillChar.repeat(fillW)}
            </span>
            <span style={{ color: CC_COLORS[element.emptyColor].hex }}>
              {element.emptyChar.repeat(emptyW)}
            </span>
          </div>
        );
      }

      case 'list':
        return (
          <div style={{ ...style, fontSize: `${charHeight * 0.55}px` }}>
            {element.items.slice(0, element.height).map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i === element.selectedIndex ? CC_COLORS[element.selectedBgColor].hex : 'transparent',
                  color: i === element.selectedIndex ? CC_COLORS[element.selectedFgColor].hex : fgHex,
                  lineHeight: `${charHeight}px`,
                  paddingLeft: '2px',
                }}
              >
                {item.slice(0, element.width)}
              </div>
            ))}
          </div>
        );

      case 'panel': {
        const borderColor = CC_COLORS[element.borderColor].hex;
        if (element.borderStyle === 'none') return null;
        const corners = element.borderStyle === 'rounded'
          ? { tl: '\u256d', tr: '\u256e', bl: '\u2570', br: '\u256f', h: '\u2500', v: '\u2502' }
          : element.borderStyle === 'double'
            ? { tl: '\u2554', tr: '\u2557', bl: '\u255a', br: '\u255d', h: '\u2550', v: '\u2551' }
            : { tl: '\u250c', tr: '\u2510', bl: '\u2514', br: '\u2518', h: '\u2500', v: '\u2502' };
        return (
          <div style={{ ...style, color: borderColor, fontSize: `${charHeight * 0.6}px` }}>
            <div>{corners.tl}{corners.h.repeat(Math.max(0, element.width - 2))}{corners.tr}</div>
            {Array.from({ length: Math.max(0, element.height - 2) }).map((_, i) => (
              <div key={i}>{corners.v}{' '.repeat(Math.max(0, element.width - 2))}{corners.v}</div>
            ))}
            <div>{corners.bl}{corners.h.repeat(Math.max(0, element.width - 2))}{corners.br}</div>
            {element.title && (
              <div
                className="absolute"
                style={{
                  top: 0,
                  left: charWidth * 2,
                  color: fgHex,
                  lineHeight: `${charHeight}px`,
                }}
              >
                {element.title}
              </div>
            )}
          </div>
        );
      }

      case 'statusBar':
        return (
          <div className="flex items-center w-full h-full px-0.5" style={style}>
            {element.text}
          </div>
        );

      case 'image':
        return (
          <div className="flex items-center justify-center w-full h-full text-ide-text-dim text-[10px]">
            [Image]
          </div>
        );

      case 'scrollView': {
        const borderColor = CC_COLORS[element.borderColor].hex;
        return (
          <div style={{ ...style, color: borderColor }} className="w-full h-full relative">
            {element.borderStyle === 'single' && (
              <>
                <div className="absolute right-0 top-0 text-[10px]" style={{ color: borderColor }}>^</div>
                <div className="absolute right-0 bottom-0 text-[10px]" style={{ color: borderColor }}>v</div>
              </>
            )}
            <div className="flex items-center justify-center w-full h-full text-ide-text-dim text-[10px]">
              [Scroll View]
            </div>
          </div>
        );
      }

      case 'tabBar': {
        return (
          <div className="flex w-full h-full" style={{ ...style, fontSize: `${charHeight * 0.55}px` }}>
            {element.tabs.map((tab, i) => (
              <div
                key={i}
                className="px-1 flex items-center"
                style={{
                  backgroundColor: i === element.activeTab
                    ? CC_COLORS[element.activeBgColor].hex
                    : CC_COLORS[element.inactiveBgColor].hex,
                  color: i === element.activeTab
                    ? CC_COLORS[element.activeFgColor].hex
                    : CC_COLORS[element.inactiveFgColor].hex,
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        );
      }

      case 'divider': {
        const divColor = CC_COLORS[element.dividerColor].hex;
        const divChars: Record<string, { h: string; v: string }> = {
          thin: { h: '\u2500', v: '\u2502' },
          thick: { h: '\u2501', v: '\u2503' },
          dashed: { h: '\u2504', v: '\u2506' },
          double: { h: '\u2550', v: '\u2551' },
        };
        const dc = divChars[element.style] || divChars.thin;
        return (
          <div style={{ ...style, color: divColor }}>
            {element.orientation === 'horizontal'
              ? dc.h.repeat(element.width)
              : Array.from({ length: element.height }).map((_, i) => (
                  <div key={i} style={{ lineHeight: `${charHeight}px` }}>{dc.v}</div>
                ))}
          </div>
        );
      }

      case 'checkbox': {
        const checkColor = CC_COLORS[element.checkColor].hex;
        return (
          <div style={style} className="flex items-center px-0.5">
            <span style={{ color: element.checked ? checkColor : fgHex }}>
              {element.checked ? element.checkedChar : element.uncheckedChar}
            </span>
            <span className="ml-1">{element.text}</span>
          </div>
        );
      }

      case 'dropdown': {
        const selectedText = element.items[element.selectedIndex] || '';
        return (
          <div style={style} className="flex items-center justify-between w-full px-0.5">
            <span className="truncate">{selectedText}</span>
            <span className="text-ide-text-dim ml-1">{'\u25BC'}</span>
          </div>
        );
      }

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
