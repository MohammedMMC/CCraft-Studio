import React, { useMemo, useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { useHistoryStore } from '../../stores/historyStore';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { DEVICE_PRESETS, MONITOR_SIZES, DeviceType, getMonitorSize } from '../../models/Project';
import { CustomMonitorDialog } from '../shared/CustomMonitorDialog';
import { CraftOSPCIcon, GridIcon, MonitorIcon, RedoIcon, UndoIcon } from '../shared/Icons';
import { useAppStore } from '@/stores/appStore';

export const Toolbar: React.FC<{ onExport: () => void }> = ({ onExport }) => {
  const project = useProjectStore(s => s.project);
  const isDirty = useProjectStore(s => s.isDirty);
  const mode = useEditorStore(s => s.mode);
  const setMode = useEditorStore(s => s.setMode);
  const showGrid = useEditorStore(s => s.showGrid);
  const showCraftPC = useEditorStore(s => s.showCraftPC);
  const toggleCraftPC = useEditorStore(s => s.toggleCraftPC);
  const toggleGrid = useEditorStore(s => s.toggleGrid);
  const zoom = useEditorStore(s => s.zoom);
  const zoomIn = useEditorStore(s => s.zoomIn);
  const zoomOut = useEditorStore(s => s.zoomOut);
  const resetZoom = useEditorStore(s => s.resetZoom);
  const useCraftOSPC = useAppStore(s => s.useCraftOSPC);
  const canUndo = useHistoryStore(s => s.undoStack.length > 0);
  const canRedo = useHistoryStore(s => s.redoStack.length > 0);
  const undo = useHistoryStore(s => s.undo);
  const redo = useHistoryStore(s => s.redo);
  const updateProjectInfo = useProjectStore(s => s.updateProjectInfo);
  const [showCustomMonitor, setShowCustomMonitor] = useState<boolean>(false);

  const screenSizeValue = useMemo(() => {
    if (!project) return '';
    const { device, displayWidth, displayHeight } = project;
    if (device === 'monitor') {
      const match = MONITOR_SIZES.find(m => m.width === displayWidth && m.height === displayHeight);
      if (match) {
        return `monitor:${match.blocks}`;
      } else {
        const customMatch = project.customMonitors.find(m => m.width === displayWidth && m.height === displayHeight);
        if (customMatch) return `custom:${customMatch.blocks}`;
      }
    }
    const preset = DEVICE_PRESETS[device];
    if (preset && preset.defaultWidth === displayWidth && preset.defaultHeight === displayHeight) {
      return `device:${device}`;
    }
    return `device:${device}`;
  }, [project]);

  const handleScreenSizeChange = (value: string) => {
    const [type, key] = value.split(':');
    if (type === 'device') {
      const preset = DEVICE_PRESETS[key as DeviceType];
      if (preset) {
        updateProjectInfo({
          device: key as DeviceType,
          displayWidth: preset.defaultWidth,
          displayHeight: preset.defaultHeight,
        });
      }
    } else if (type === 'monitor') {
      const monitor = MONITOR_SIZES.find(m => m.blocks === key);
      if (!monitor && key === 'custom') {
        setShowCustomMonitor(true);
      } else if (monitor) {
        updateProjectInfo({
          device: 'monitor',
          displayWidth: monitor.width,
          displayHeight: monitor.height,
        });
      }
    } else if (type === 'custom') {
      const monitor = getMonitorSize(key);

      updateProjectInfo({
        device: 'monitor',
        customMonitors: [...new Map([...(project?.customMonitors || []), monitor].map((i) => [i.width + 'x' + i.height, i])).values()],
        displayWidth: monitor.width,
        displayHeight: monitor.height,
      });

    }
  };

  const handleSave = async () => {
    if (!project || !window.electronAPI) return;
    const blocklyXml = useBlocklyStore.getState().getAllXml();
    const saveData = { ...project, _blocklyXml: blocklyXml };
    const content = JSON.stringify(saveData, null, 2);
    const filePath = useProjectStore.getState().filePath;
    const result = await window.electronAPI.saveProject({ content, filePath: filePath ?? undefined });
    if (result) {
      useProjectStore.getState().setFilePath(result);
      useProjectStore.getState().markClean();
      window.electronAPI.addRecentProject({ name: project.name, path: result });
    }
  };

  if (!project) return null;

  return (
    <div className="flex items-center h-10 bg-app-surface border-b border-app-border px-2 gap-1 select-none">
      {/* Project Name */}
      <div className="flex items-center gap-2 px-2 mr-4">
        <span className="text-sm font-semibold text-app-accent">CC</span>
        <span className="text-sm text-app-text-bright truncate max-w-[200px]">
          {project.name}
        </span>
        {isDirty && <span className="w-2 h-2 rounded-full bg-app-warning" title="Unsaved changes" />}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-app-border" />

      {/* Editor Mode Toggle */}
      <div className="flex items-center bg-app-bg rounded mx-2">
        <button
          onClick={() => setMode('ui')}
          className={`px-3 py-1 text-xs rounded transition-all ${mode === 'ui'
            ? 'bg-app-accent text-app-bg font-medium'
            : 'text-app-text-dim hover:text-app-text'
            }`}
        >
          UI Editor
        </button>
        <button
          onClick={() => setMode('blocks')}
          className={`px-3 py-1 text-xs rounded transition-all ${mode === 'blocks'
            ? 'bg-app-accent text-app-bg font-medium'
            : 'text-app-text-dim hover:text-app-text'
            }`}
        >
          Blocks
        </button>
      </div>

      <div className="w-px h-5 bg-app-border" />

      {/* Undo/Redo */}
      <button onClick={undo} disabled={!canUndo} className="toolbar-btn" title="Undo (Ctrl+Z)">
        <UndoIcon />
      </button>
      <button onClick={redo} disabled={!canRedo} className="toolbar-btn" title="Redo (Ctrl+Shift+Z)">
        <RedoIcon />
      </button>

      <div className="w-px h-5 bg-app-border mx-1" />

      {/* View Controls (UI mode only) */}
      {mode === 'ui' && (
        <>
          <button
            onClick={toggleGrid}
            className={`toolbar-btn ${showGrid ? 'text-app-accent' : ''}`}
            title="Toggle Grid"
          >
            <GridIcon />
          </button>

          {useCraftOSPC && (
            <button
              onClick={toggleCraftPC}
              className={`toolbar-btn ${showCraftPC ? 'text-app-accent' : ''}`}
              title="Toggle CraftOS-PC App Preview"
            >
              <CraftOSPCIcon className={showCraftPC ? 'fill-app-accent' : ''} />
            </button>
          )}

          <div className="w-px h-5 bg-app-border mx-1" />
        </>
      )}



      {/* Zoom */}
      <button onClick={zoomOut} className="toolbar-btn" title="Zoom Out">-</button>
      <button onClick={resetZoom} className="toolbar-btn text-xs w-12" title="Reset Zoom">
        {Math.round(zoom * 100)}%
      </button>
      <button onClick={zoomIn} className="toolbar-btn" title="Zoom In">+</button>

      {/* Screen Size Preview (UI mode only) */}
      {mode === 'ui' && (
        <>
          <div className="w-px h-5 bg-app-border mx-1" />
          <MonitorIcon />
          <select
            value={screenSizeValue}
            onChange={(e) => handleScreenSizeChange(e.target.value)}
            className="ml-1 bg-app-bg border border-app-border rounded text-xs text-app-text px-1.5 py-1 cursor-pointer focus:outline-none focus:border-app-accent"
            title="Preview screen size"
          >
            <optgroup label="Devices">
              {(Object.entries(DEVICE_PRESETS) as [DeviceType, typeof DEVICE_PRESETS[DeviceType]][]).filter(([key, preset]) => preset.supportsColor && !preset.sizeEditable).map(([key, preset]) => (
                <option key={`device:${key}`} value={`device:${key}`}>
                  {preset.label} ({preset.defaultWidth}x{preset.defaultHeight})
                </option>
              ))}
            </optgroup>
            <optgroup label="Monitors">
              {MONITOR_SIZES.map((m) => (
                <option key={`monitor:${m.blocks}`} value={`monitor:${m.blocks}`}>
                  {m.blocks} Monitor ({m.width}x{m.height})
                </option>
              ))}
            </optgroup>
            <optgroup label="Custom Monitors">
              {(project?.customMonitors || []).map((m) => (
                <option key={`custom:${m.blocks}`} value={`custom:${m.blocks}`}>
                  {m.blocks} Monitor ({m.width}x{m.height})
                </option>
              ))}
              <option key="monitor:custom" value="monitor:custom">
                Create Monitor
              </option>
            </optgroup>
          </select>
        </>
      )}

      {/* Custom Monitor Modal */}
      <CustomMonitorDialog isOpen={showCustomMonitor} onClose={() => setShowCustomMonitor(false)} onCreate={(s) => handleScreenSizeChange(`custom:${s.blocks}`)} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <button onClick={handleSave} className="toolbar-btn px-3" title="Save (Ctrl+S)">
        Save
      </button>
      <button onClick={onExport} className="btn-primary text-xs px-3 py-1">
        Export
      </button>
    </div>
  );
};