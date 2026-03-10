import React from 'react';
import { UIElementType, UI_ELEMENT_LABELS } from '../../models/UIElement';
import { useUIElementStore } from '../../stores/uiElementStore';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { useHistoryStore } from '../../stores/historyStore';
import { generateId } from '../../utils/idGenerator';

const ELEMENT_TYPES: UIElementType[] = [
  'label', 'button',
];

export const ElementToolkit: React.FC = () => {
  const addElement = useUIElementStore((s) => s.addElement);
  const removeElement = useUIElementStore((s) => s.removeElement);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const selectElement = useEditorStore((s) => s.selectElement);

  const handleAddElement = (type: UIElementType) => {
    if (!activeScreenId) return;
    const element = addElement(activeScreenId, type);
    selectElement(element.id);
    const sid = activeScreenId;
    const eid = element.id;
    useHistoryStore.getState().push({
      id: generateId(),
      description: `Add ${element.name}`,
      execute: () => {
        const el = addElement(sid, type, element as any);
        selectElement(el.id);
      },
      undo: () => {
        removeElement(sid, eid);
        selectElement(null);
      },
    });
  };

  return (
    <div className="w-52 bg-ide-panel border-r border-ide-border flex flex-col h-full">
      <div className="panel-header">Elements</div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {ELEMENT_TYPES.map((type) => {
          const meta = UI_ELEMENT_LABELS[type];
          return (
            <button
              key={type}
              onClick={() => handleAddElement(type)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded
                         bg-ide-surface border border-ide-border
                         hover:bg-ide-hover hover:border-ide-accent/30
                         active:bg-ide-active transition-all text-left group"
            >
              <span className="w-7 h-7 rounded bg-ide-bg border border-ide-border
                               flex items-center justify-center text-xs font-mono
                               text-ide-accent group-hover:border-ide-accent/50">
                {meta.icon}
              </span>
              <div>
                <div className="text-xs font-medium text-ide-text group-hover:text-ide-text-bright">
                  {meta.label}
                </div>
                <div className="text-[10px] text-ide-text-dim">{meta.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="px-3 py-2 border-t border-ide-border text-[10px] text-ide-text-dim">
        Click to add to canvas
      </div>
    </div>
  );
};
