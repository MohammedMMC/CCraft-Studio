import React from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useProjectStore } from '../../stores/projectStore';
import { useUIElementStore } from '../../stores/uiElementStore';
import { useHistoryStore } from '../../stores/historyStore';
import { UIElement, UIElementType, SizeUnit, resolveSize } from '../../models/UIElement';
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


export const PropertiesPanel: React.FC = () => {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const project = useProjectStore((s) => s.project);
  const getElementById = useUIElementStore((s) => s.getElementById);
  const updateElement = useUIElementStore((s) => s.updateElement);
  const removeElement = useUIElementStore((s) => s.removeElement);
  const duplicateElement = useUIElementStore((s) => s.duplicateElement);
  const selectElement = useEditorStore((s) => s.selectElement);

  const displayWidth = project?.displayWidth ?? 51;
  const displayHeight = project?.displayHeight ?? 19;

  if (!activeScreenId || !selectedElementId) {
    return (
      <div className="w-60 bg-app-panel border-l border-app-border flex flex-col">
        <div className="panel-header">Properties</div>
        <div className="p-3 text-xs text-app-text-dim text-center">
          Select an element to edit its properties
        </div>
      </div>
    );
  }

  const element = getElementById(activeScreenId, selectedElementId);
  if (!element) {
    return (
      <div className="w-60 bg-app-panel border-l border-app-border flex flex-col">
        <div className="panel-header">Properties</div>
        <div className="flex-1 flex items-center justify-center text-xs text-app-text-dim p-4">
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
    <div className="w-60 bg-app-panel border-l border-app-border flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>Properties</span>
        <span className="text-[10px] text-app-accent font-normal normal-case tracking-normal">
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
          {element.parentId !== null && (
            <div className="text-[10px] text-app-text-dim italic">
              Position managed by container
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <PropField label="X">
              <input
                type="number"
                className="input-field text-xs"
                value={element.x}
                min={1}
                max={MAX_POS}
                disabled={element.parentId !== null}
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
                disabled={element.parentId !== null}
                onChange={(e) => update({ y: parseNum(e.target.value, 1, MAX_POS, 1) })}
              />
            </PropField>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-2">
            <PropField label="Width">
              <div className="flex gap-1">
                <input
                  type="number"
                  className="input-field text-xs flex-1 min-w-0"
                  value={element.widthUnit === 'fill' ? '' : element.width}
                  placeholder={element.widthUnit === 'fill' ? 'Full' : undefined}
                  disabled={element.widthUnit === 'fill'}
                  min={1}
                  max={element.widthUnit === '%' ? 100 : MAX_SIZE}
                  onChange={(e) => {
                    const newWidth = parseNum(e.target.value, 1, element.widthUnit === '%' ? 100 : MAX_SIZE, 1);
                    const rw = resolveSize({ ...element, width: newWidth } as UIElement, displayWidth, displayHeight).width;
                    const maxX = Math.max(1, displayWidth - rw + 1);
                    const posUpdate = element.x > maxX ? { x: maxX } : {};
                    update({ width: newWidth, ...posUpdate });
                  }}
                />
                <UnitToggle
                  value={element.widthUnit}
                  onChange={(u) => {
                    const resolved = resolveSize(element, displayWidth, displayHeight).width;
                    let newVal = element.width;
                    if (u === '%') newVal = clamp(Math.round((resolved / displayWidth) * 100), 1, 100);
                    else if (u === 'px') newVal = resolved;
                    // Compute resolved width with new unit to check if element fits
                    const tempEl = { ...element, widthUnit: u, ...(u !== 'fill' ? { width: newVal } : {}) } as UIElement;
                    const rw = resolveSize(tempEl, displayWidth, displayHeight).width;
                    const maxX = Math.max(1, displayWidth - rw + 1);
                    const posUpdate = element.x > maxX ? { x: maxX } : {};
                    update({ widthUnit: u, ...(u !== 'fill' ? { width: newVal } : {}), ...posUpdate } as any);
                  }}
                />
              </div>
            </PropField>
            <PropField label="Height">
              <div className="flex gap-1">
                <input
                  type="number"
                  className="input-field text-xs flex-1 min-w-0"
                  value={element.heightUnit === 'fill' ? '' : element.height}
                  placeholder={element.heightUnit === 'fill' ? 'Full' : undefined}
                  disabled={element.heightUnit === 'fill'}
                  min={1}
                  max={element.heightUnit === '%' ? 100 : MAX_SIZE}
                  onChange={(e) => {
                    const newHeight = parseNum(e.target.value, 1, element.heightUnit === '%' ? 100 : MAX_SIZE, 1);
                    const rh = resolveSize({ ...element, height: newHeight } as UIElement, displayWidth, displayHeight).height;
                    const maxY = Math.max(1, displayHeight - rh + 1);
                    const posUpdate = element.y > maxY ? { y: maxY } : {};
                    update({ height: newHeight, ...posUpdate });
                  }}
                />
                <UnitToggle
                  value={element.heightUnit}
                  onChange={(u) => {
                    const resolved = resolveSize(element, displayWidth, displayHeight).height;
                    let newVal = element.height;
                    if (u === '%') newVal = clamp(Math.round((resolved / displayHeight) * 100), 1, 100);
                    else if (u === 'px') newVal = resolved;
                    // Compute resolved height with new unit to check if element fits
                    const tempEl = { ...element, heightUnit: u, ...(u !== 'fill' ? { height: newVal } : {}) } as UIElement;
                    const rh = resolveSize(tempEl, displayWidth, displayHeight).height;
                    const maxY = Math.max(1, displayHeight - rh + 1);
                    const posUpdate = element.y > maxY ? { y: maxY } : {};
                    update({ heightUnit: u, ...(u !== 'fill' ? { height: newVal } : {}), ...posUpdate } as any);
                  }}
                />
              </div>
            </PropField>
          </div>

          <div className="h-px bg-app-border" />

          {/* Colors */}
          {element.type === 'panel' ? (
            <>
              <ColorPicker
                label="Title Color"
                value={element.fgColor}
                onChange={(fgColor) => update({ fgColor })}
              />
              <ColorPicker
                label="Title Background"
                value={element.titleBgColor}
                onChange={(titleBgColor) => update({ titleBgColor } as any)}
              />
              <ColorPicker
                label="Border Color"
                value={element.borderColor}
                onChange={(borderColor) => update({ borderColor } as any)}
              />
              <ColorPicker
                label="Background Color"
                value={element.bgColor}
                onChange={(bgColor) => update({ bgColor })}
              />
            </>
          ) : (
            <>
              {element.type !== 'container' && (
                <ColorPicker
                  label="Text Color"
                  value={element.fgColor}
                  onChange={(fgColor) => update({ fgColor })}
                />
              )}
              <ColorPicker
                label="Background Color"
                value={element.bgColor}
                onChange={(bgColor) => update({ bgColor })}
              />
            </>
          )}

          <div className="h-px bg-app-border" />

          {/* Type-specific properties */}
          {renderTypeSpecificProps(element, update)}

          <div className="h-px bg-app-border" />

          {/* Visibility */}
          <PropField label="Visible">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={element.visible}
                onChange={(e) => update({ visible: e.target.checked })}
                className="accent-app-accent"
              />
              <span className="text-xs text-app-text">{element.visible ? 'Yes' : 'No'}</span>
            </label>
          </PropField>


        </div>
      </div>

      {/* Actions */}
      <div className="p-2 border-t border-app-border space-y-1">
        <button onClick={handleDuplicate} className="w-full btn-secondary text-xs py-1">
          Duplicate
        </button>
        <button onClick={handleDelete} className="w-full text-xs py-1 px-4 bg-app-error/10 text-app-error rounded hover:bg-app-error/20 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
};

const PropField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[10px] text-app-text-dim mb-1">{label}</label>
    {children}
  </div>
);

const UNIT_CYCLE: SizeUnit[] = ['px', '%', 'fill'];
const UNIT_LABELS: Record<SizeUnit, string> = { px: 'px', '%': '%', fill: 'F' };

const UnitToggle: React.FC<{ value: SizeUnit; onChange: (u: SizeUnit) => void }> = ({ value, onChange }) => {
  const cycle = () => {
    const idx = UNIT_CYCLE.indexOf(value);
    onChange(UNIT_CYCLE[(idx + 1) % UNIT_CYCLE.length]);
  };

  return (
    <button
      className="w-7 h-auto flex items-center justify-center rounded text-[10px] font-bold border border-app-border bg-app-bg-hover text-app-text-dim hover:text-app-accent hover:border-app-accent/50 transition-colors flex-shrink-0"
      onClick={cycle}
      title={`Unit: ${value} (click to cycle)`}
    >
      {UNIT_LABELS[value]}
    </button>
  );
};

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
          <ColorPicker label="Focused Text Color" value={element.focusTextColor} onChange={(c) => update({ focusTextColor: c } as any)} />
          <ColorPicker label="Focused Background Color" value={element.focusBgColor} onChange={(c) => update({ focusBgColor: c } as any)} />
        </>
      );

    case 'container':
    case 'panel':
      return (
        <>
          {/* Panel gets text properties */}
          {element.type === 'panel' && (
            <>
              <PropField label="Title">
                <input className="input-field text-xs" value={(element as any).text} maxLength={200} onChange={(e) => update({ text: e.target.value.slice(0, 200) } as any)} />
              </PropField>
              <PropField label="Text Align">
                <select className="select-field text-xs" value={(element as any).textAlign} onChange={(e) => update({ textAlign: e.target.value as any } as any)}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </PropField>
            </>
          )}

          <PropField label="Display">
            <select className="select-field text-xs" value={element.display} onChange={(e) => update({ display: e.target.value } as any)}>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
            </select>
          </PropField>

          {element.display === 'flex' && (
            <>
              <PropField label="Direction">
                <select className="select-field text-xs" value={element.flexDirection} onChange={(e) => update({ flexDirection: e.target.value } as any)}>
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                </select>
              </PropField>
              <PropField label="Justify Content">
                <select className="select-field text-xs" value={element.justifyContent} onChange={(e) => update({ justifyContent: e.target.value } as any)}>
                  <option value="start">Start</option>
                  <option value="center">Center</option>
                  <option value="end">End</option>
                  <option value="space-between">Space Between</option>
                </select>
              </PropField>
            </>
          )}

          {element.display === 'grid' && (
            <>
              <PropField label="Columns">
                <input type="number" className="input-field text-xs" value={element.gridTemplateCols} min={1} max={20}
                  onChange={(e) => update({ gridTemplateCols: parseNum(e.target.value, 1, 20, 2) } as any)} />
              </PropField>
              <PropField label="Rows">
                <input type="number" className="input-field text-xs" value={element.gridTemplateRows} min={1} max={20}
                  onChange={(e) => update({ gridTemplateRows: parseNum(e.target.value, 1, 20, 2) } as any)} />
              </PropField>
            </>
          )}

          <PropField label="Align Items">
            <select className="select-field text-xs" value={element.alignItems} onChange={(e) => update({ alignItems: e.target.value } as any)}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </PropField>

          <PropField label="Gap">
            <div className="flex gap-1">
              <input type="number" className="input-field text-xs flex-1 min-w-0"
                value={element.gap} min={0} max={element.gapUnit === '%' ? 100 : 50}
                onChange={(e) => update({ gap: parseNum(e.target.value, 0, element.gapUnit === '%' ? 100 : 50, 0) } as any)} />
              <button
                className="w-7 h-auto flex items-center justify-center rounded text-[10px] font-bold border border-app-border bg-app-bg-hover text-app-text-dim hover:text-app-accent hover:border-app-accent/50 transition-colors flex-shrink-0"
                onClick={() => update({ gapUnit: element.gapUnit === 'px' ? '%' : 'px' } as any)}
              >
                {element.gapUnit === 'px' ? 'px' : '%'}
              </button>
            </div>
          </PropField>

          <PropField label="Padding">
            <div className="flex gap-1">
              <input type="number" className="input-field text-xs flex-1 min-w-0" value={element.padding} min={0} max={element.paddingUnit === '%' ? 50 : 10}
                onChange={(e) => update({ padding: parseNum(e.target.value, 0, element.paddingUnit === '%' ? 50 : 10, 0) } as any)} />
              <button
                className="w-7 h-auto flex items-center justify-center rounded text-[10px] font-bold border border-app-border bg-app-bg-hover text-app-text-dim hover:text-app-accent hover:border-app-accent/50 transition-colors flex-shrink-0"
                onClick={() => update({ paddingUnit: element.paddingUnit === 'px' ? '%' : 'px' } as any)}
              >
                {element.paddingUnit === 'px' ? 'px' : '%'}
              </button>
            </div>
          </PropField>
        </>
      );

    default:
      return null;
  }
}
