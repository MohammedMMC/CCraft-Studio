import React, { useState, useEffect, useCallback } from 'react';
import { useProjectStore } from './stores/projectStore';
import { useHistoryStore } from './stores/historyStore';
import { useEditorStore } from './stores/editorStore';
import { useUIElementStore } from './stores/uiElementStore';
import { useBlocklyStore } from './stores/blocklyStore';
import { generateId } from './utils/idGenerator';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { NewProjectWizard } from './components/welcome/NewProjectWizard';
import { AppShell } from './components/layout/AppShell';
import { ExportDialog } from './components/shared/ExportDialog';
import { PromptDialog } from './components/shared/PromptDialog';
import { SettingsDialog } from './components/shared/SettingsDialog';

const flushBlocklyWorkspace = () => {
  try {
    const { liveWorkspace, liveScreenId, setXml } = useBlocklyStore.getState();
    if (liveWorkspace && liveScreenId) {
      const Blockly = require('blockly');
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(liveWorkspace));
      setXml(liveScreenId, xml);
    }
  } catch {
  }
};

const handleSave = async () => {
  const projectStore = useProjectStore.getState();
  const project = projectStore.project;
  if (!project || !window.electronAPI) return;
  flushBlocklyWorkspace();
  const blocklyXml = useBlocklyStore.getState().getAllXml();
  const saveData = { ...project, _blocklyXml: blocklyXml };
  const content = JSON.stringify(saveData, null, 2);
  const filePath = projectStore.filePath;
  const result = await window.electronAPI.saveProject({ content, filePath: filePath ?? undefined });
  if (result) {
    useProjectStore.getState().setFilePath(result);
    useProjectStore.getState().markClean();
    window.electronAPI.addRecentProject({ name: project.name, path: result });
  }
};

const handleSaveAs = async () => {
  const projectStore = useProjectStore.getState();
  const project = projectStore.project;
  if (!project || !window.electronAPI) return;
  flushBlocklyWorkspace();
  const blocklyXml = useBlocklyStore.getState().getAllXml();
  const saveData = { ...project, _blocklyXml: blocklyXml };
  const content = JSON.stringify(saveData, null, 2);
  const result = await window.electronAPI.saveProject({ content });
  if (result) {
    useProjectStore.getState().setFilePath(result);
    useProjectStore.getState().markClean();
    window.electronAPI.addRecentProject({ name: project.name, path: result });
  }
};

const handleOpenProject = async () => {
  if (!window.electronAPI) return;
  const result = await window.electronAPI.openProject();
  if (result) {
    const blocklyXml = result.content._blocklyXml as Record<string, string> | undefined;
    const { _blocklyXml, ...projectData } = result.content;
    useProjectStore.getState().loadProject(projectData, result.filePath);
    if (blocklyXml) {
      useBlocklyStore.getState().loadAllXml(blocklyXml);
    }
    useHistoryStore.getState().clear();
    window.electronAPI.addRecentProject({ name: result.content.name, path: result.filePath });
  }
};

const App: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;
    const unsubscribe = window.electronAPI.onMenuAction((action: string) => {
      switch (action) {
        case 'menu:newProject':
          setShowNewProject(true);
          break;
        case 'menu:openProject':
          handleOpenProject();
          break;
        case 'menu:export':
          if (project) setShowExport(true);
          break;
        case 'menu:settings':
          setShowSettings(true);
          break;
        case 'menu:save':
          handleSave();
          break;
        case 'menu:saveAs':
          handleSaveAs();
          break;
        case 'menu:undo':
          useHistoryStore.getState().undo();
          break;
        case 'menu:redo':
          useHistoryStore.getState().redo();
          break;
        case 'menu:delete': {
          const selectedId = useEditorStore.getState().selectedElementId;
          const screenId = useProjectStore.getState().activeScreenId;
          if (selectedId && screenId) {
            const el = useUIElementStore.getState().getElementById(screenId, selectedId);
            if (el) {
              const deletedElement = { ...el };
              useUIElementStore.getState().removeElement(screenId, selectedId);
              useEditorStore.getState().selectElement(null);
              useHistoryStore.getState().push({
                id: generateId(),
                description: `Delete ${el.name}`,
                execute: () => { useUIElementStore.getState().removeElement(screenId, selectedId); useEditorStore.getState().selectElement(null); },
                undo: () => {
                  useUIElementStore.getState().addElement(screenId, deletedElement.type, deletedElement as any);
                  useEditorStore.getState().selectElement(deletedElement.id);
                },
              });
            }
          }
          break;
        }
        case 'menu:zoomIn':
          useEditorStore.getState().zoomIn();
          break;
        case 'menu:zoomOut':
          useEditorStore.getState().zoomOut();
          break;
        case 'menu:zoomReset':
          useEditorStore.getState().resetZoom();
          break;
      }
    });
    return unsubscribe;
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 's' && e.shiftKey) {
        e.preventDefault();
        handleSaveAs();
      } else if (ctrl && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (ctrl && e.key === 'o') {
        e.preventDefault();
        handleOpenProject();
      }
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useHistoryStore.getState().undo();
      }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        useHistoryStore.getState().redo();
      }
      if (ctrl && e.key === 'e') {
        e.preventDefault();
        if (project) setShowExport(true);
      }
      if (ctrl && e.key === '=') {
        e.preventDefault();
        useEditorStore.getState().zoomIn();
      }
      if (ctrl && e.key === '-') {
        e.preventDefault();
        useEditorStore.getState().zoomOut();
      }
      if (ctrl && e.key === '0') {
        e.preventDefault();
        useEditorStore.getState().resetZoom();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        const selectedId = useEditorStore.getState().selectedElementId;
        const screenId = useProjectStore.getState().activeScreenId;
        if (selectedId && screenId) {
          const el = useUIElementStore.getState().getElementById(screenId, selectedId);
          if (el) {
            const deletedElement = { ...el };
            useUIElementStore.getState().removeElement(screenId, selectedId);
            useEditorStore.getState().selectElement(null);
            useHistoryStore.getState().push({
              id: generateId(),
              description: `Delete ${el.name}`,
              execute: () => { useUIElementStore.getState().removeElement(screenId, selectedId); useEditorStore.getState().selectElement(null); },
              undo: () => {
                useUIElementStore.getState().addElement(screenId, deletedElement.type, deletedElement as any);
                useEditorStore.getState().selectElement(deletedElement.id);
              },
            });
          }
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [project]);

  if (!project) {
    return (
      <>
        <WelcomeScreen onNewProject={() => setShowNewProject(true)} />
        <NewProjectWizard
          isOpen={showNewProject}
          onClose={() => setShowNewProject(false)}
        />
        <SettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </>
    );
  }

  return (
    <>
      <AppShell onExport={() => setShowExport(true)} />
      <NewProjectWizard
        isOpen={showNewProject}
        onClose={() => setShowNewProject(false)}
      />
      <ExportDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <PromptDialog />
    </>
  );
};

export default App;
