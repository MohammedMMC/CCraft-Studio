import React from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useProjectStore } from '../../stores/projectStore';
import { useUIElementStore } from '../../stores/uiElementStore';
import { useHistoryStore } from '../../stores/historyStore';
import { UIElement, UIElementType } from '../../models/UIElement';
import { CCColor } from '../../models/CCColors';
import { ColorPicker } from './ColorPicker';
import { generateId } from '../../utils/idGenerator';

// Clamp a number to a safe range
const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, Math.round(val)));

// Parse + clamp for number inputs (returns fallback if NaN)
const parseNum = (raw: string, min: number, max: number, fallback: number): number => {
  const n = parseInt(raw);
  if (isNaN(n)) return fallback;
  return clamp(n, min, max);
};

// Max screen dimensions: largest CC monitor is 164x81; we allow some extra headroom
const MAX_POS = 200;
const MAX_SIZE = 200;
const MAX_ZINDEX = 100;

export const PropertiesPanel: React.FC = () => {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const getElementById = useUIElementStore((s) => s.getElementById);
  const updateElement = useUIElementStore((s) => s.updateElement);
  const removeElement = useUIElementStore((s) => s.removeElement);
  const duplicateElement = useUIElementStore((s) => s.duplicateElement);
  const selectElement = useEditorStore((s) => s.selectElement);

  if (!activeScreenId || !selectedElementId) {
    return (
      <div className="w-60 bg-ide-panel border-l border-ide-border flex flex-col">
        <div className="panel-header">Properties</div>
        <div className="flex-1 flex items-center justify-center text-xs text-ide-text-dim p-4 text-center">
          Select an element to edit its properties
        </div>
      </div>
    );
  }

  const element = getElementById(activeScreenId, selectedElementId);
  if (!element) {
    return (
      <div className="w-60 bg-ide-panel border-l border-ide-border flex flex-col">
        <div className="panel-header">Properties</div>
        <div className="flex-1 flex items-center justify-center text-xs text-ide-text-dim p-4">
          Element not found
        </div>
      </div>
    );
  }

  const update = (updates: Partial<UIElement>) => {
    // Capture previous values for undo
    const prevValues: Partial<UIElement> = {};
    for (const key of Object.keys(updates)) {
      (prevValues as any)[key] = (element as any)[key];
    }
    const sid = activeScreenId;
    const eid = selectedElementId;
    updateElement(sid, eid, updates);
    useHistoryStore.getState().push({
      id: generateId(),
      description: `Edit ${element.name}`,
      execute: () => updateElement(sid, eid, updates),
      undo: () => updateElement(sid, eid, prevValues),
    });
  };

  const handleDelete = () => {
    const sid = activeScreenId;
    const eid = selectedElementId;
    const deletedElement = { ...element } as UIElement;
    removeElement(sid, eid);
    selectElement(null);
    useHistoryStore.getState().push({
      id: generateId(),
      description: `Delete ${element.name}`,
      execute: () => { removeElement(sid, eid); selectElement(null); },
      undo: () => {
        useUIElementStore.getState().addElement(sid, deletedElement.type, deletedElement);
        selectElement(deletedElement.id);
      },
    });
  };

  const handleDuplicate = () => {
    const dup = duplicateElement(activeScreenId, selectedElementId);
    if (dup) selectElement(dup.id);
  };

  return (
    <div className="w-60 bg-ide-panel border-l border-ide-border flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>Properties</span>
        <span className="text-[10px] text-ide-accent font-normal normal-case tracking-normal">
          {element.type}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">
          {/* Name */}
          <PropField label="Name">
            <input
              className="input-field text-xs"
              value={element.name}
              maxLength={30}
              onChange={(e) => update({ name: e.target.value.slice(0, 30) })}
            />
          </PropField>

          {/* Position */}
          <div className="grid grid-cols-2 gap-2">
            <PropField label="X">
              <input
                type="number"
                className="input-field text-xs"
                value={element.x}
                min={1}
                max={MAX_POS}
                onChange={(e) => update({ x: parseNum(e.target.value, 1, MAX_POS, 1) })}
              />
            </PropField>
            <PropField label="Y">
              <input
                type="number"
                className="input-field text-xs"
                value={element.y}
                min={1}
                max={MAX_POS}
                onChange={(e) => update({ y: parseNum(e.target.value, 1, MAX_POS, 1) })}
              />
            </PropField>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-2">
            <PropField label="Width">
              <input
                type="number"
                className="input-field text-xs"
                value={element.width}
                min={1}
                max={MAX_SIZE}
                onChange={(e) => update({ width: parseNum(e.target.value, 1, MAX_SIZE, 1) })}
              />
            </PropField>
            <PropField label="Height">
              <input
                type="number"
                className="input-field text-xs"
                value={element.height}
                min={1}
                max={MAX_SIZE}
                onChange={(e) => update({ height: parseNum(e.target.value, 1, MAX_SIZE, 1) })}
              />
            </PropField>
          </div>

          <div className="h-px bg-ide-border" />

          {/* Colors */}
          <ColorPicker
            label="Foreground"
            value={element.fgColor}
            onChange={(fgColor) => update({ fgColor })}
          />
          <ColorPicker
            label="Background"
            value={element.bgColor}
            onChange={(bgColor) => update({ bgColor })}
          />

          <div className="h-px bg-ide-border" />

          {/* Type-specific properties */}
          {renderTypeSpecificProps(element, update)}

          <div className="h-px bg-ide-border" />

          {/* Visibility */}
          <PropField label="Visible">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={element.visible}
                onChange={(e) => update({ visible: e.target.checked })}
                className="accent-ide-accent"
              />
              <span className="text-xs text-ide-text">{element.visible ? 'Yes' : 'No'}</span>
            </label>
          </PropField>

          {/* Z-Index */}
          <PropField label="Z-Index">
            <input
              type="number"
              className="input-field text-xs"
              value={element.zIndex}
              min={0}
              max={MAX_ZINDEX}
              onChange={(e) => update({ zIndex: parseNum(e.target.value, 0, MAX_ZINDEX, 0) })}
            />
          </PropField>
        </div>
      </div>

      {/* Actions */}
      <div className="p-2 border-t border-ide-border space-y-1">
        <button onClick={handleDuplicate} className="w-full btn-secondary text-xs py-1">
          Duplicate
        </button>
        <button onClick={handleDelete} className="w-full text-xs py-1 px-4 bg-ide-error/10 text-ide-error rounded hover:bg-ide-error/20 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
};

const PropField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[10px] text-ide-text-dim mb-1">{label}</label>
    {children}
  </div>
);

function renderTypeSpecificProps(element: UIElement, update: (u: Partial<UIElement>) => void) {
  switch (element.type) {
    case 'label':
      return (
        <>
          <PropField label="Text">
            <input className="input-field text-xs" value={element.text} maxLength={200} onChange={(e) => update({ text: e.target.value.slice(0, 200) } as any)} />
          </PropField>
          <PropField label="Text Align">
            <select className="select-field text-xs" value={element.textAlign} onChange={(e) => update({ textAlign: e.target.value as any } as any)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </PropField>
        </>
      );

    case 'button':
      return (
        <>
          <PropField label="Text">
            <input className="input-field text-xs" value={element.text} maxLength={200} onChange={(e) => update({ text: e.target.value.slice(0, 200) } as any)} />
          </PropField>
          <PropField label="Text Align">
            <select className="select-field text-xs" value={element.textAlign} onChange={(e) => update({ textAlign: e.target.value as any } as any)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </PropField>
          <ColorPicker label="Hover Background" value={element.hoverBgColor} onChange={(c) => update({ hoverBgColor: c } as any)} />
          <ColorPicker label="Hover Foreground" value={element.hoverFgColor} onChange={(c) => update({ hoverFgColor: c } as any)} />
        </>
      );

    default:
      return null;
  }
}
