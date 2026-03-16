import React, { useState, useCallback } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { useUIElementStore } from '../../stores/uiElementStore';
import { useHistoryStore } from '../../stores/historyStore';
import { UIElement, UI_ELEMENT_LABELS } from '../../models/UIElement';
import { generateId } from '../../utils/idGenerator';

interface DropIndicator {
  parentId: string | null;
  index: number;
}

export const ElementsPanel: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectElement = useEditorStore((s) => s.selectElement);
  const setParent = useUIElementStore((s) => s.setParent);
  const reorderElement = useUIElementStore((s) => s.reorderElement);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropIndicator | null>(null);
  const [nestTargetId, setNestTargetId] = useState<string | null>(null);

  const screen = project?.screens.find((s) => s.id === activeScreenId);
  if (!screen) return null;

  const elements = screen.uiElements;

  const getSiblings = useCallback((parentId: string | null) => {
    return [...elements]
      .filter(el => el.parentId === parentId)
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [elements]);

  const topLevel = getSiblings(null);

  const childrenMap = new Map<string, UIElement[]>();
  for (const el of elements) {
    if (el.parentId) {
      if (!childrenMap.has(el.parentId)) childrenMap.set(el.parentId, []);
      childrenMap.get(el.parentId)!.push(el);
    }
  }

  for (const [key, children] of childrenMap) {
    childrenMap.set(key, [...children].sort((a, b) => a.zIndex - b.zIndex));
  }


  const isDescendant = (targetId: string, ancestorId: string): boolean => {
    let current = elements.find(e => e.id === targetId);
    while (current?.parentId) {
      if (current.parentId === ancestorId) return true;
      current = elements.find(e => e.id === current!.parentId);
    }
    return false;
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOverRow = (e: React.DragEvent, el: UIElement, siblings: UIElement[]) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    if (!draggedId || draggedId === el.id) {
      setDropTarget(null);
      setNestTargetId(null);
      return;
    }

    if (isDescendant(el.id, draggedId)) {
      setDropTarget(null);
      setNestTargetId(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;
    const isContainer = el.type === 'container' || el.type === 'panel';
    const idx = siblings.indexOf(el);

    if (isContainer) {
      if (y < h * 0.25) {
        setNestTargetId(null);
        setDropTarget({ parentId: el.parentId, index: idx });
      } else if (y > h * 0.75) {
        setNestTargetId(null);
        setDropTarget({ parentId: el.parentId, index: idx + 1 });
      } else {
        setDropTarget(null);
        setNestTargetId(el.id);
      }
    } else {
      if (y < h / 2) {
        setDropTarget({ parentId: el.parentId, index: idx });
      } else {
        setDropTarget({ parentId: el.parentId, index: idx + 1 });
      }
      setNestTargetId(null);
    }
  };

  const handleDragOverRoot = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    setDropTarget({ parentId: null, index: topLevel.length });
    setNestTargetId(null);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !e.currentTarget.contains(related)) {
      setDropTarget(null);
      setNestTargetId(null);
    }
  };

  const applyReorder = (parentId: string | null, orderedIds: string[]) => {
    if (!activeScreenId) return;
    orderedIds.forEach((id, i) => {
      reorderElement(activeScreenId, id, i);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeScreenId || !draggedId) return;

    const el = elements.find(e => e.id === draggedId);
    if (!el) return;

    if (nestTargetId) {
      if (draggedId === nestTargetId) return;
      if (isDescendant(nestTargetId, draggedId)) return;

      const prevParentId = el.parentId;
      setParent(activeScreenId, draggedId, nestTargetId);

      const sid = activeScreenId;
      const eid = draggedId;
      const tid = nestTargetId;
      useHistoryStore.getState().push({
        id: generateId(),
        description: `Move ${el.name} into container`,
        execute: () => setParent(sid, eid, tid),
        undo: () => setParent(sid, eid, prevParentId),
      });
    } else if (dropTarget) {
      const { parentId: targetParentId, index: targetIndex } = dropTarget;
      const prevParentId = el.parentId;
      const siblings = getSiblings(targetParentId);

      const currentIds = siblings.map(s => s.id).filter(id => id !== draggedId);
      let insertAt = targetIndex;
      const oldIdx = siblings.findIndex(s => s.id === draggedId);
      if (prevParentId === targetParentId && oldIdx !== -1 && oldIdx < targetIndex) {
        insertAt = Math.max(0, targetIndex - 1);
      }
      currentIds.splice(insertAt, 0, draggedId);

      const oldZIndexes = siblings.map(s => ({ id: s.id, z: s.zIndex }));

      if (prevParentId !== targetParentId) {
        setParent(activeScreenId, draggedId, targetParentId);
      }

      applyReorder(targetParentId, currentIds);

      const sid = activeScreenId;
      const eid = draggedId;
      const newOrder = [...currentIds];
      useHistoryStore.getState().push({
        id: generateId(),
        description: `Reorder ${el.name}`,
        execute: () => {
          if (prevParentId !== targetParentId) setParent(sid, eid, targetParentId);
          newOrder.forEach((id, i) => reorderElement(sid, id, i));
        },
        undo: () => {
          if (prevParentId !== targetParentId) setParent(sid, eid, prevParentId);
          oldZIndexes.forEach(({ id, z }) => reorderElement(sid, id, z));
        },
      });
    }

    setDropTarget(null);
    setNestTargetId(null);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDropTarget(null);
    setNestTargetId(null);
    setDraggedId(null);
  };

  const renderDropLine = (parentId: string | null, index: number, depth: number) => {
    const show = dropTarget && dropTarget.parentId === parentId && dropTarget.index === index;
    if (!show) return null;
    return (
      <div
        key={`drop-${parentId ?? 'root'}-${index}`}
        className="h-0.5 bg-app-accent rounded-full mx-1"
        style={{ marginLeft: 8 + depth * 16 }}
      />
    );
  };

  const renderRow = (el: UIElement, depth: number, siblings: UIElement[]) => {
    const isSelected = el.id === selectedElementId;
    const meta = UI_ELEMENT_LABELS[el.type];
    const isContainer = el.type === 'container' || el.type === 'panel';
    const children = childrenMap.get(el.id) || [];
    const isNestTarget = nestTargetId === el.id;
    const isDragged = draggedId === el.id;
    const idx = siblings.indexOf(el);

    return (
      <React.Fragment key={el.id}>
        {renderDropLine(el.parentId, idx, depth)}
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, el.id)}
          onDragOver={(e) => handleDragOverRow(e, el, siblings)}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs transition-colors cursor-grab
            ${isSelected ? 'bg-app-accent/20 text-app-accent' : 'hover:bg-app-bg-hover text-app-text'}
            ${isNestTarget ? 'ring-1 ring-app-accent ring-inset bg-app-accent/10' : ''}
            ${isDragged ? 'opacity-40' : ''}
          `}
          style={{ paddingLeft: 8 + depth * 16 }}
          onClick={() => selectElement(el.id)}
        >
          <span
            className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold flex-shrink-0 ${
              isSelected ? 'bg-app-accent text-app-bg' : 'bg-app-bg-hover text-app-text-dim'
            }`}
          >
            {meta.icon}
          </span>
          <span className="truncate flex-1">{el.name}</span>
          {!el.visible && (
            <span className="text-[9px] text-app-text-dim opacity-50">hidden</span>
          )}
          {isContainer && (
            <span className="text-[9px] text-app-text-dim">{children.length}</span>
          )}
        </div>
        {/* Render children indented */}
        {isContainer && children.map(child => renderRow(child, depth + 1, children))}
        {/* Drop line after last child inside container */}
        {isContainer && renderDropLine(el.id, children.length, depth + 1)}
        {/* Drop line after the last sibling */}
        {idx === siblings.length - 1 && renderDropLine(el.parentId, idx + 1, depth)}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>Elements</span>
        <span className="text-[10px] font-normal text-app-text-dim normal-case tracking-normal">
          {elements.length}
        </span>
      </div>
      <div
        className="flex-1 overflow-auto"
        onDragOver={handleDragOverRoot}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {elements.length === 0 ? (
          <div className="p-3 text-xs text-app-text-dim text-center">
            No elements on this screen
          </div>
        ) : (
          <div className="flex flex-col gap-px p-1">
            {topLevel.map(el => renderRow(el, 0, topLevel))}
          </div>
        )}
      </div>
    </div>
  );
};
