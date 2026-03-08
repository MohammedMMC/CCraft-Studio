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

          {/* Responsive Anchoring */}
          <PropField label="Anchor H">
            <select className="select-field text-xs" value={element.anchorH} onChange={(e) => update({ anchorH: e.target.value as any })}>
              <option value="fixed">Fixed</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="center">Center</option>
              <option value="stretch">Stretch</option>
            </select>
          </PropField>
          <PropField label="Anchor V">
            <select className="select-field text-xs" value={element.anchorV} onChange={(e) => update({ anchorV: e.target.value as any })}>
              <option value="fixed">Fixed</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="center">Center</option>
              <option value="stretch">Stretch</option>
            </select>
          </PropField>
          {(element.anchorH !== 'fixed' || element.anchorV !== 'fixed') && (
            <div className="grid grid-cols-2 gap-2">
              <PropField label="Margin L">
                <input type="number" className="input-field text-xs" value={element.marginLeft} min={0} max={MAX_POS} onChange={(e) => update({ marginLeft: parseNum(e.target.value, 0, MAX_POS, 0) })} />
              </PropField>
              <PropField label="Margin R">
                <input type="number" className="input-field text-xs" value={element.marginRight} min={0} max={MAX_POS} onChange={(e) => update({ marginRight: parseNum(e.target.value, 0, MAX_POS, 0) })} />
              </PropField>
              <PropField label="Margin T">
                <input type="number" className="input-field text-xs" value={element.marginTop} min={0} max={MAX_POS} onChange={(e) => update({ marginTop: parseNum(e.target.value, 0, MAX_POS, 0) })} />
              </PropField>
              <PropField label="Margin B">
                <input type="number" className="input-field text-xs" value={element.marginBottom} min={0} max={MAX_POS} onChange={(e) => update({ marginBottom: parseNum(e.target.value, 0, MAX_POS, 0) })} />
              </PropField>
            </div>
          )}
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

    case 'textInput':
      return (
        <>
          <PropField label="Placeholder">
            <input className="input-field text-xs" value={element.placeholder} maxLength={50} onChange={(e) => update({ placeholder: e.target.value.slice(0, 50) } as any)} />
          </PropField>
          <PropField label="Default Value">
            <input className="input-field text-xs" value={element.defaultValue} maxLength={50} onChange={(e) => update({ defaultValue: e.target.value.slice(0, 50) } as any)} />
          </PropField>
          <PropField label="Max Length">
            <input type="number" className="input-field text-xs" value={element.maxLength} min={1} max={200} onChange={(e) => update({ maxLength: parseNum(e.target.value, 1, 200, 50) } as any)} />
          </PropField>
        </>
      );

    case 'progressBar':
      return (
        <>
          <PropField label="Value">
            <input type="number" className="input-field text-xs" value={element.value} min={0} max={10000} onChange={(e) => update({ value: parseNum(e.target.value, 0, 10000, 0) } as any)} />
          </PropField>
          <PropField label="Max Value">
            <input type="number" className="input-field text-xs" value={element.maxValue} min={1} max={10000} onChange={(e) => update({ maxValue: parseNum(e.target.value, 1, 10000, 100) } as any)} />
          </PropField>
          <ColorPicker label="Fill Color" value={element.fillColor} onChange={(c) => update({ fillColor: c } as any)} />
          <ColorPicker label="Empty Color" value={element.emptyColor} onChange={(c) => update({ emptyColor: c } as any)} />
          <PropField label="Show Percentage">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={element.showPercentage} onChange={(e) => update({ showPercentage: e.target.checked } as any)} className="accent-ide-accent" />
              <span className="text-xs text-ide-text">{element.showPercentage ? 'Yes' : 'No'}</span>
            </label>
          </PropField>
        </>
      );

    case 'list':
      return (
        <>
          <PropField label="Items (one per line)">
            <textarea
              className="input-field text-xs resize-none h-20"
              value={element.items.join('\n')}
              onChange={(e) => update({ items: e.target.value.split('\n') } as any)}
            />
          </PropField>
          <ColorPicker label="Selected BG" value={element.selectedBgColor} onChange={(c) => update({ selectedBgColor: c } as any)} />
          <ColorPicker label="Selected FG" value={element.selectedFgColor} onChange={(c) => update({ selectedFgColor: c } as any)} />
        </>
      );

    case 'panel':
      return (
        <>
          <PropField label="Title">
            <input className="input-field text-xs" value={element.title} maxLength={100} onChange={(e) => update({ title: e.target.value.slice(0, 100) } as any)} />
          </PropField>
          <PropField label="Border Style">
            <select className="select-field text-xs" value={element.borderStyle} onChange={(e) => update({ borderStyle: e.target.value as any } as any)}>
              <option value="none">None</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="rounded">Rounded</option>
            </select>
          </PropField>
          <ColorPicker label="Border Color" value={element.borderColor} onChange={(c) => update({ borderColor: c } as any)} />
        </>
      );

    case 'statusBar':
      return (
        <>
          <PropField label="Text">
            <input className="input-field text-xs" value={element.text} maxLength={200} onChange={(e) => update({ text: e.target.value.slice(0, 200) } as any)} />
          </PropField>
          <PropField label="Position">
            <select className="select-field text-xs" value={element.position} onChange={(e) => update({ position: e.target.value as any } as any)}>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </PropField>
        </>
      );

    case 'image':
      return (
        <PropField label="NFP Data">
          <textarea
            className="input-field text-xs resize-none h-20 font-mono"
            value={element.nfpData}
            onChange={(e) => update({ nfpData: e.target.value } as any)}
            placeholder="Paste NFP image data..."
          />
        </PropField>
      );

    case 'scrollView':
      return (
        <>
          <PropField label="Border Style">
            <select className="select-field text-xs" value={element.borderStyle} onChange={(e) => update({ borderStyle: e.target.value as any } as any)}>
              <option value="none">None</option>
              <option value="single">Single</option>
            </select>
          </PropField>
          <ColorPicker label="Border Color" value={element.borderColor} onChange={(c) => update({ borderColor: c } as any)} />
          <PropField label="Content Height">
            <input type="number" className="input-field text-xs" value={element.contentHeight} min={1} max={500} onChange={(e) => update({ contentHeight: parseNum(e.target.value, 1, 500, 20) } as any)} />
          </PropField>
          <PropField label="Show Scrollbar">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={element.showScrollbar} onChange={(e) => update({ showScrollbar: e.target.checked } as any)} className="accent-ide-accent" />
              <span className="text-xs text-ide-text">{element.showScrollbar ? 'Yes' : 'No'}</span>
            </label>
          </PropField>
        </>
      );

    case 'tabBar':
      return (
        <>
          <PropField label="Tabs (one per line)">
            <textarea
              className="input-field text-xs resize-none h-20"
              value={element.tabs.join('\n')}
              onChange={(e) => update({ tabs: e.target.value.split('\n') } as any)}
            />
          </PropField>
          <PropField label="Active Tab">
            <input type="number" className="input-field text-xs" value={element.activeTab} min={0} max={Math.max(0, element.tabs.length - 1)} onChange={(e) => update({ activeTab: parseNum(e.target.value, 0, Math.max(0, element.tabs.length - 1), 0) } as any)} />
          </PropField>
          <ColorPicker label="Active BG" value={element.activeBgColor} onChange={(c) => update({ activeBgColor: c } as any)} />
          <ColorPicker label="Active FG" value={element.activeFgColor} onChange={(c) => update({ activeFgColor: c } as any)} />
          <ColorPicker label="Inactive BG" value={element.inactiveBgColor} onChange={(c) => update({ inactiveBgColor: c } as any)} />
          <ColorPicker label="Inactive FG" value={element.inactiveFgColor} onChange={(c) => update({ inactiveFgColor: c } as any)} />
        </>
      );

    case 'divider':
      return (
        <>
          <PropField label="Orientation">
            <select className="select-field text-xs" value={element.orientation} onChange={(e) => update({ orientation: e.target.value as any } as any)}>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </PropField>
          <PropField label="Style">
            <select className="select-field text-xs" value={element.style} onChange={(e) => update({ style: e.target.value as any } as any)}>
              <option value="thin">Thin</option>
              <option value="thick">Thick</option>
              <option value="dashed">Dashed</option>
              <option value="double">Double</option>
            </select>
          </PropField>
          <ColorPicker label="Divider Color" value={element.dividerColor} onChange={(c) => update({ dividerColor: c } as any)} />
        </>
      );

    case 'checkbox':
      return (
        <>
          <PropField label="Text">
            <input className="input-field text-xs" value={element.text} maxLength={200} onChange={(e) => update({ text: e.target.value.slice(0, 200) } as any)} />
          </PropField>
          <PropField label="Checked">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={element.checked} onChange={(e) => update({ checked: e.target.checked } as any)} className="accent-ide-accent" />
              <span className="text-xs text-ide-text">{element.checked ? 'Yes' : 'No'}</span>
            </label>
          </PropField>
          <PropField label="Checked Char">
            <input className="input-field text-xs" value={element.checkedChar} maxLength={5} onChange={(e) => update({ checkedChar: e.target.value.slice(0, 5) } as any)} />
          </PropField>
          <PropField label="Unchecked Char">
            <input className="input-field text-xs" value={element.uncheckedChar} maxLength={5} onChange={(e) => update({ uncheckedChar: e.target.value.slice(0, 5) } as any)} />
          </PropField>
          <ColorPicker label="Check Color" value={element.checkColor} onChange={(c) => update({ checkColor: c } as any)} />
        </>
      );

    case 'dropdown':
      return (
        <>
          <PropField label="Items (one per line)">
            <textarea
              className="input-field text-xs resize-none h-20"
              value={element.items.join('\n')}
              onChange={(e) => update({ items: e.target.value.split('\n') } as any)}
            />
          </PropField>
          <PropField label="Selected Index">
            <input type="number" className="input-field text-xs" value={element.selectedIndex} min={0} max={Math.max(0, element.items.length - 1)} onChange={(e) => update({ selectedIndex: parseNum(e.target.value, 0, Math.max(0, element.items.length - 1), 0) } as any)} />
          </PropField>
          <PropField label="Max Visible Items">
            <input type="number" className="input-field text-xs" value={element.maxVisibleItems} min={1} max={20} onChange={(e) => update({ maxVisibleItems: parseNum(e.target.value, 1, 20, 5) } as any)} />
          </PropField>
          <ColorPicker label="Dropdown BG" value={element.dropdownBgColor} onChange={(c) => update({ dropdownBgColor: c } as any)} />
          <ColorPicker label="Dropdown FG" value={element.dropdownFgColor} onChange={(c) => update({ dropdownFgColor: c } as any)} />
          <ColorPicker label="Selected BG" value={element.selectedBgColor} onChange={(c) => update({ selectedBgColor: c } as any)} />
          <ColorPicker label="Selected FG" value={element.selectedFgColor} onChange={(c) => update({ selectedFgColor: c } as any)} />
        </>
      );

    default:
      return null;
  }
}
