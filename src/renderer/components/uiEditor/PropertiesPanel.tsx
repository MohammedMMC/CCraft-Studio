import React from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useProjectStore } from '../../stores/projectStore';
import { useUIElementStore } from '../../stores/uiElementStore';
import { useHistoryStore } from '../../stores/historyStore';
import { UIElement, UIElementType, SizeUnit, resolveSize, SizeConstraintUnit, UI_ELEMENT_COLORS_NAMES } from '../../models/UIElement';
import { ColorPicker } from './ColorPicker';
import { generateId } from '../../utils/idGenerator';
import { CCColor } from '@/models/CCColors';

const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, Math.round(val)));

const parseNum = (raw: string, min: number, max: number, fallback: number): number => {
  const n = parseInt(raw);
  if (isNaN(n)) return fallback;
  return clamp(n, min, max);
};

const MAX_POS = 200;
const MAX_SIZE = 200;


export const PropertiesPanel: React.FC = () => {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const project = useProjectStore((s) => s.project);
  const getElementById = useUIElementStore((s) => s.getElementById);
  const updateElement = useUIElementStore((s) => s.updateElement);
  const removeElement = useUIElementStore((s) => s.removeElement);
  const restoreElements = useUIElementStore((s) => s.restoreElements);
  const duplicateElement = useUIElementStore((s) => s.duplicateElement);
  const selectElement = useEditorStore((s) => s.selectElement);
  const renameScreen = useProjectStore((s) => s.renameScreen);
  const changeScreenBgColor = useProjectStore((s) => s.changeScreenBgColor);
  const setWorkingScreen = useProjectStore((s) => s.setWorkingScreen);
  const setScreenDisplayType = useProjectStore((s) => s.setScreenDisplayType);
  const setMonitorsSize = useProjectStore((s) => s.setMonitorsSize);
  const setMonitorsUnit = useProjectStore((s) => s.setMonitorsUnit);

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
  const screen = project?.screens.find(s => s.id === activeScreenId);
  if (!element && !screen) {
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
    const prevValues: Partial<UIElement> = {};
    for (const key of Object.keys(updates)) {
      (prevValues as any)[key] = (element as any)[key];
    }
    const sid = activeScreenId;
    const eid = selectedElementId;
    updateElement(sid, eid, updates);
    useHistoryStore.getState().push({
      id: generateId(),
      description: `Edit ${element?.name}`,
      execute: () => updateElement(sid, eid, updates),
      undo: () => updateElement(sid, eid, prevValues),
    });
  };

  const handleDelete = () => {
    const sid = activeScreenId;
    const eid = selectedElementId;
    const deletedTree = removeElement(sid, eid);
    if (deletedTree.length === 0) return;
    selectElement(null);
    useHistoryStore.getState().push({
      id: generateId(),
      description: `Delete ${element?.name}`,
      execute: () => { removeElement(sid, eid); selectElement(null); },
      undo: () => {
        restoreElements(sid, deletedTree);
        selectElement(eid);
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
          {element ? element.type : "screen"}
        </span>
      </div>

      {(screen && !element) && (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-3">
              {/* Name */}
              <PropField label="Name">
                <input
                  className="input-field text-xs"
                  value={screen.name}
                  maxLength={30}
                  onChange={(e) => renameScreen(screen.id, e.target.value.slice(0, 30))}
                />
              </PropField>


              <PropField label="Working Screen">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={screen.isWorkingScreen}
                    onChange={(e) => setWorkingScreen(screen.id, e.target.checked)}
                    className="checkbox-field"
                  />
                  <span className="text-xs text-app-text">{screen.isWorkingScreen ? 'Yes' : 'No'}</span>
                </label>
              </PropField>

              {screen.isWorkingScreen && (
                <>
                  <PropField label="Display Type">
                    <select className="select-field text-xs" value={screen.displayType} onChange={(e) => setScreenDisplayType(screen.id, e.target.value as any)}>
                      <option value="terminal">Terminal</option>
                      <option value="monitor">Monitor</option>
                      <option value="any">Any</option>
                    </select>
                  </PropField>

                  {screen.displayType === 'monitor' && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <PropField label="Width">
                          <div className="flex gap-1">
                            <input
                              type="number"
                              className="input-field text-xs flex-1 min-w-0"
                              value={screen.monitorsWidthSize}
                              placeholder="Monitor Width"
                              min={1} max={20}
                              onChange={(e) => {
                                const newWidth = parseNum(e.target.value, 1, 20, 1);
                                setMonitorsSize(screen.id, newWidth, null);
                              }}
                            />
                            <UnitToggle
                              unitsType='constraint'
                              value={screen.monitorsWidthUnit}
                              onChange={(u) => {
                                setMonitorsUnit(screen.id, u as SizeConstraintUnit, null);
                              }}
                            />
                          </div>
                        </PropField>
                        <PropField label="Height">
                          <div className="flex gap-1">
                            <input
                              type="number"
                              className="input-field text-xs flex-1 min-w-0"
                              value={screen.monitorsHeightSize}
                              placeholder="Monitor Height"
                              min={1} max={20}
                              onChange={(e) => {
                                const newHeight = parseNum(e.target.value, 1, 20, 1);
                                setMonitorsSize(screen.id, null, newHeight);
                              }}
                            />
                            <UnitToggle
                              unitsType='constraint'
                              value={screen.monitorsHeightUnit}
                              onChange={(u) => {
                                setMonitorsUnit(screen.id, null, u as SizeConstraintUnit);
                              }}
                            />
                          </div>
                        </PropField>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="h-px bg-app-border" />

              {/* Colors */}
              <ColorPicker
                label="Background Color"
                value={screen.bgColor || 'black'}
                onChange={(bgColor) => changeScreenBgColor(screen.id, bgColor)}
              />
            </div>
            <div className="h-px bg-app-border" />
          </div>
        </>
      )}

      {element && (
        <>
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
                      unitsType='size'
                      value={element.widthUnit}
                      onChange={(u) => {
                        const resolved = resolveSize(element, displayWidth, displayHeight).width;
                        let newVal = element.width;
                        if (u === '%') newVal = clamp(Math.round((resolved / displayWidth) * 100), 1, 100);
                        else if (u === 'px') newVal = resolved;
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
                      unitsType='size'
                      value={element.heightUnit}
                      onChange={(u) => {
                        const resolved = resolveSize(element, displayWidth, displayHeight).height;
                        let newVal = element.height;
                        if (u === '%') newVal = clamp(Math.round((resolved / displayHeight) * 100), 1, 100);
                        else if (u === 'px') newVal = resolved;
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
              {Object.keys(UI_ELEMENT_COLORS_NAMES).map((key) => Object.keys(element).includes(key) && (
                <ColorPicker
                  key={key}
                  label={UI_ELEMENT_COLORS_NAMES[key as keyof typeof UI_ELEMENT_COLORS_NAMES] + " Color"}
                  value={element[key as keyof typeof element]?.toString() as CCColor}
                  onChange={(value) => update({ [key]: value } as any)}
                />
              ))}

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
                    className="checkbox-field"
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
        </>
      )}
    </div>
  );
};

const PropField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[10px] text-app-text-dim mb-1">{label}</label>
    {children}
  </div>
);
const SIZE_UNIT_CYCLE: SizeUnit[] = ['px', '%', 'fill'];
const SIZE_UNIT_LABELS: Record<SizeUnit, string> = { px: 'px', '%': '%', fill: 'F' };
const SIZE_CONSTRAINT_UNIT_CYCLE: SizeConstraintUnit[] = ['=', '>', '<'];
const SIZE_CONSTRAINT_UNIT_LABELS: Record<SizeConstraintUnit, string> = { '=': '=', '>': '>', '<': '<' };

const UnitToggle: React.FC<{
  unitsType: 'size' | 'constraint';
  value: SizeUnit | SizeConstraintUnit;
  onChange: (u: SizeUnit | SizeConstraintUnit) => void
}> = ({ unitsType, value, onChange }) => {
  const cycle = () => {
    const idx = unitsType === 'size' ? SIZE_UNIT_CYCLE.indexOf(value as SizeUnit) : SIZE_CONSTRAINT_UNIT_CYCLE.indexOf(value as SizeConstraintUnit);
    onChange(unitsType === 'size' ? SIZE_UNIT_CYCLE[(idx + 1) % SIZE_UNIT_CYCLE.length] : SIZE_CONSTRAINT_UNIT_CYCLE[(idx + 1) % SIZE_CONSTRAINT_UNIT_CYCLE.length]);
  };

  return (
    <button
      className="w-7 h-auto flex items-center justify-center rounded text-[10px] font-bold border border-app-border bg-app-bg-hover text-app-text-dim hover:text-app-accent hover:border-app-accent/50 transition-colors flex-shrink-0"
      onClick={cycle}
      title={`Unit: "${value}" (click to cycle)`}
    >
      {unitsType === 'size' ? SIZE_UNIT_LABELS[value as SizeUnit] : SIZE_CONSTRAINT_UNIT_LABELS[value as SizeConstraintUnit]}
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

          <div className={`grid grid-cols-${element.display === 'flex' ? 2 : 1} gap-2`}>
            <PropField label="Display">
              <select className="select-field text-xs" value={element.display} onChange={(e) => update({ display: e.target.value } as any)}>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
              </select>
            </PropField>
            {element.display === 'flex' && (
              <PropField label="Direction">
                <select className="select-field text-xs" value={element.flexDirection} onChange={(e) => update({ flexDirection: e.target.value } as any)}>
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                </select>
              </PropField>
            )}

          </div>

          {element.display === 'flex' && (
            <>
              <PropField label="Justify Content">
                <select className="select-field text-xs" value={element.justifyContent} onChange={(e) => update({ justifyContent: e.target.value } as any)}>
                  <option value="start">Start</option>
                  <option value="center">Center</option>
                  <option value="end">End</option>
                  <option value="space-between">Space Between</option>
                </select>
              </PropField>
              <PropField label="Align Items">
                <select className="select-field text-xs" value={element.alignItems} onChange={(e) => update({ alignItems: e.target.value } as any)}>
                  <option value="start">Start</option>
                  <option value="center">Center</option>
                  <option value="end">End</option>
                </select>
              </PropField>
            </>
          )}

          {element.display === 'grid' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <PropField label="Columns">
                  <input type="number" className="input-field text-xs" value={element.gridTemplateCols} min={1} max={20}
                    onChange={(e) => update({ gridTemplateCols: parseNum(e.target.value, 1, 20, 2) } as any)} />
                </PropField>
                <PropField label="Rows">
                  <input type="number" className="input-field text-xs" value={element.gridTemplateRows} min={1} max={20}
                    onChange={(e) => update({ gridTemplateRows: parseNum(e.target.value, 1, 20, 2) } as any)} />
                </PropField>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
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
          </div>
        </>
      );
    case 'progressbar':
      return (
        <>
          <PropField label="Text">
            <input className="input-field text-xs" value={element.text} maxLength={200} onChange={(e) => update({ text: e.target.value.slice(0, 200) } as any)} />
          </PropField>
          <PropField label="Orientation">
            <select className="select-field text-xs" value={element.orientation} onChange={(e) => update({ orientation: e.target.value } as any)}>
              <option value="hltr">Horizontal - Left To Right</option>
              <option value="hrtl">Horizontal - Right To Left</option>
              <option value="vttb">Vertical - Top To Bottom</option>
              <option value="vbtt">Vertical - Bottom To Top</option>
            </select>
          </PropField>
          <PropField label="Text Align">
            <select className="select-field text-xs" value={element.textAlign} onChange={(e) => update({ textAlign: e.target.value as any } as any)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </PropField>
          <PropField label="Progress">
            <input type="number" className="input-field text-xs" value={element.progress} min={0} max={100}
              onChange={(e) => update({ progress: parseNum(e.target.value, 0, 100, 0) } as any)} />
          </PropField>
        </>
      );
    case 'slider':
      return (
        <>
          <PropField label="Orientation">
            <select className="select-field text-xs" value={element.orientation} onChange={(e) => update({ orientation: e.target.value } as any)}>
              <option value="hltr">Horizontal - Left To Right</option>
              <option value="hrtl">Horizontal - Right To Left</option>
              <option value="vttb">Vertical - Top To Bottom</option>
              <option value="vbtt">Vertical - Bottom To Top</option>
            </select>
          </PropField>
          <PropField label="Value">
            <input type="number" className="input-field text-xs" value={element.value} min={element.from} max={element.to}
              onChange={(e) => update({ value: parseNum(e.target.value, element.from, element.to, 0) } as any)} />
          </PropField>
          <div className="grid grid-cols-2 gap-2">
            <PropField label="From">
              <input type="number" className="input-field text-xs" value={element.from}
                onChange={(e) => update({ from: parseNum(e.target.value, -Infinity, element.to - 1, 0), value: parseNum(String(element.value), parseNum(e.target.value, -Infinity, element.to - 1, 0), element.to, 0) } as any)} />
            </PropField>
            <PropField label="To">
              <input type="number" className="input-field text-xs" value={element.to}
                onChange={(e) => update({ to: parseNum(e.target.value, element.from + 1, Infinity, 0), value: parseNum(String(element.value), element.from, parseNum(e.target.value, element.from + 1, Infinity, 0), 0) } as any)} />
            </PropField>
          </div>
        </>
      );
    case 'checkbox':
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
          <PropField label="Checked">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox-field" checked={element.checked} onChange={(e) => update({ checked: e.target.checked } as any)} />
              <span className="text-xs text-app-text">{element.checked ? 'Yes' : 'No'}</span>
            </label>
          </PropField>
        </>
      );
    case 'input':
      return (
        <>
          <PropField label="Text">
            <input className="input-field text-xs" value={element.text} maxLength={200} onChange={(e) => update({ text: e.target.value.slice(0, 200) } as any)} />
          </PropField>
          <PropField label="Placeholder">
            <input className="input-field text-xs" value={element.placeholder} maxLength={200} onChange={(e) => update({ placeholder: e.target.value.slice(0, 200) } as any)} />
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
    default:
      return null;
  }
}
