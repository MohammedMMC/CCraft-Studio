import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { DEVICE_PRESETS } from '../../models/Project';

export const StatusBar: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const mode = useEditorStore((s) => s.mode);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const zoom = useEditorStore((s) => s.zoom);

  if (!project) return null;

  const screen = project.screens.find((s) => s.id === activeScreenId);
  const preset = DEVICE_PRESETS[project.device];
  const elementCount = screen?.uiElements.length ?? 0;

  return (
    <div className="flex items-center h-6 bg-ide-panel border-t border-ide-border px-3 text-[10px] text-ide-text-dim select-none gap-4">
      <span className="text-ide-accent font-medium">{preset.label}</span>
      <span>{project.displayWidth}x{project.displayHeight}</span>
      <span>{project.colorMode === 'color' ? '16 Colors' : 'Grayscale'}</span>
      <div className="w-px h-3 bg-ide-border" />
      <span>Screen: {screen?.name ?? '?'}</span>
      <span>Elements: {elementCount}</span>
      {selectedElementId && <span className="text-ide-accent">Selected: {selectedElementId.slice(0, 8)}</span>}
      <div className="flex-1" />
      <span>Mode: {mode === 'ui' ? 'UI Editor' : 'Block Editor'}</span>
      <span>Zoom: {Math.round(zoom * 100)}%</span>
    </div>
  );
};
