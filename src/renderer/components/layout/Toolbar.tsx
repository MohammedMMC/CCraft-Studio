import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { useHistoryStore } from '../../stores/historyStore';
import { useBlocklyStore } from '../../stores/blocklyStore';

export const Toolbar: React.FC<{ onExport: () => void }> = ({ onExport }) => {
  const project = useProjectStore((s) => s.project);
  const isDirty = useProjectStore((s) => s.isDirty);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const zoom = useEditorStore((s) => s.zoom);
  const zoomIn = useEditorStore((s) => s.zoomIn);
  const zoomOut = useEditorStore((s) => s.zoomOut);
  const resetZoom = useEditorStore((s) => s.resetZoom);
  const canUndo = useHistoryStore((s) => s.undoStack.length > 0);
  const canRedo = useHistoryStore((s) => s.redoStack.length > 0);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);

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
    <div className="flex items-center h-10 bg-ide-surface border-b border-ide-border px-2 gap-1 select-none">
      {/* Project Name */}
      <div className="flex items-center gap-2 px-2 mr-4">
        <span className="text-sm font-semibold text-ide-accent">CC</span>
        <span className="text-sm text-ide-text-bright truncate max-w-[200px]">
          {project.name}
        </span>
        {isDirty && <span className="w-2 h-2 rounded-full bg-ide-warning" title="Unsaved changes" />}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-ide-border" />

      {/* Editor Mode Toggle */}
      <div className="flex items-center bg-ide-bg rounded mx-2">
        <button
          onClick={() => setMode('ui')}
          className={`px-3 py-1 text-xs rounded transition-all ${
            mode === 'ui'
              ? 'bg-ide-accent text-ide-bg font-medium'
              : 'text-ide-text-dim hover:text-ide-text'
          }`}
        >
          UI Editor
        </button>
        <button
          onClick={() => setMode('blocks')}
          className={`px-3 py-1 text-xs rounded transition-all ${
            mode === 'blocks'
              ? 'bg-ide-accent text-ide-bg font-medium'
              : 'text-ide-text-dim hover:text-ide-text'
          }`}
        >
          Blocks
        </button>
      </div>

      <div className="w-px h-5 bg-ide-border" />

      {/* Undo/Redo */}
      <button onClick={undo} disabled={!canUndo} className="toolbar-btn" title="Undo (Ctrl+Z)">
        <UndoIcon />
      </button>
      <button onClick={redo} disabled={!canRedo} className="toolbar-btn" title="Redo (Ctrl+Shift+Z)">
        <RedoIcon />
      </button>

      <div className="w-px h-5 bg-ide-border mx-1" />

      {/* View Controls (UI mode only) */}
      {mode === 'ui' && (
        <button
          onClick={toggleGrid}
          className={`toolbar-btn ${showGrid ? 'text-ide-accent' : ''}`}
          title="Toggle Grid"
        >
          <GridIcon />
        </button>
      )}

      <div className="w-px h-5 bg-ide-border mx-1" />

      {/* Zoom */}
      <button onClick={zoomOut} className="toolbar-btn" title="Zoom Out">-</button>
      <button onClick={resetZoom} className="toolbar-btn text-xs w-12" title="Reset Zoom">
        {Math.round(zoom * 100)}%
      </button>
      <button onClick={zoomIn} className="toolbar-btn" title="Zoom In">+</button>

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

// Simple SVG icons
const UndoIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M4.5 3L1 6.5l3.5 3.5v-2.5c3 0 5.5 1 7 4-.5-4-3-7-7-7V3z" />
  </svg>
);

const RedoIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M11.5 3l3.5 3.5-3.5 3.5v-2.5c-3 0-5.5 1-7 4 .5-4 3-7 7-7V3z" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="14" height="14" rx="1" />
    <line x1="5.5" y1="1" x2="5.5" y2="15" />
    <line x1="10.5" y1="1" x2="10.5" y2="15" />
    <line x1="1" y1="5.5" x2="15" y2="5.5" />
    <line x1="1" y1="10.5" x2="15" y2="10.5" />
  </svg>
);
