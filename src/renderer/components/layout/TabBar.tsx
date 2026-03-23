import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '@/stores/editorStore';

export const TabBar: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const setActiveScreen = useProjectStore((s) => s.setActiveScreen);
  const addScreen = useProjectStore((s) => s.addScreen);
  const removeScreen = useProjectStore((s) => s.removeScreen);
  const renameScreen = useProjectStore((s) => s.renameScreen);
  const setWorkingScreen = useProjectStore((s) => s.setWorkingScreen);
  const selectElement = useEditorStore((s) => s.selectElement);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [contextMenu, setContextMenu] = useState<{ screenId: string; x: number; y: number } | null>(null);

  if (!project) return null;

  const handleAddScreen = () => {
    const name = `Screen ${project.screens.length + 1}`;
    addScreen(name);
  };

  const handleStartRename = (screenId: string, currentName: string) => {
    setRenamingId(screenId);
    setRenameValue(currentName);
    setContextMenu(null);
  };

  const handleFinishRename = () => {
    if (renamingId && renameValue.trim()) {
      renameScreen(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, screenId: string) => {
    e.preventDefault();
    setContextMenu({ screenId, x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div className="flex items-center h-8 bg-app-panel border-b border-app-border px-1 gap-0.5 select-none overflow-x-auto">
        {project.screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => { setActiveScreen(screen.id); selectElement(screen.id); }}
            onDoubleClick={() => handleStartRename(screen.id, screen.name)}
            onContextMenu={(e) => handleContextMenu(e, screen.id)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-t transition-all whitespace-nowrap ${screen.id === activeScreenId
                ? 'bg-app-bg text-app-text-bright border-t-2 border-t-app-accent'
                : 'text-app-text-dim hover:text-app-text hover:bg-app-hover'
              }`}
          >
            {screen.isWorkingScreen && (
              <span className="text-app-success text-[10px]" title="Working Screen">&#9654;</span>
            )}
            {renamingId === screen.id ? (
              <input
                className="bg-transparent border-b border-app-accent text-xs text-app-text-bright outline-none w-20"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={handleFinishRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFinishRename();
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              screen.name
            )}
          </button>
        ))}

        <button
          onClick={handleAddScreen}
          className="px-2 py-1 text-xs text-app-text-dim hover:text-app-accent transition-colors"
          title="Add Screen"
        >
          +
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-app-surface border border-app-border rounded shadow-xl py-1 min-w-[150px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              className="w-full px-3 py-1.5 text-xs text-left text-app-text hover:bg-app-hover"
              onClick={() => {
                const screen = project.screens.find(s => s.id === contextMenu.screenId);
                if (screen) handleStartRename(screen.id, screen.name);
              }}
            >
              Rename
            </button>
            <button
              className="w-full px-3 py-1.5 text-xs text-left text-app-text hover:bg-app-hover"
              onClick={() => {
                setWorkingScreen(contextMenu.screenId, project.screens.find(s => s.id === contextMenu.screenId)?.isWorkingScreen ? false : true);
                setContextMenu(null);
              }}
            >
              {project.screens.find(s => s.id === contextMenu.screenId)?.isWorkingScreen ? 'Set as Non-Working Screen' : 'Set as Working Screen'}
            </button>
            {project.screens.length > 1 && (
              <>
                <div className="h-px bg-app-border my-1" />
                <button
                  className="w-full px-3 py-1.5 text-xs text-left text-app-error hover:bg-app-hover"
                  onClick={() => {
                    removeScreen(contextMenu.screenId);
                    setContextMenu(null);
                  }}
                >
                  Delete Screen
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
