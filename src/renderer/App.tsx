import React, { useState, useEffect } from 'react';
import { useProjectStore } from './stores/projectStore';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { NewProjectWizard } from './components/welcome/NewProjectWizard';
import { AppShell } from './components/layout/AppShell';
import { ExportDialog } from './components/shared/ExportDialog';

const App: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Menu action handler
  useEffect(() => {
    if (!window.electronAPI) return;
    const unsubscribe = window.electronAPI.onMenuAction((action: string) => {
      switch (action) {
        case 'menu:newProject':
          setShowNewProject(true);
          break;
        case 'menu:export':
          if (project) setShowExport(true);
          break;
        case 'menu:save':
          // Trigger save via toolbar
          document.dispatchEvent(new CustomEvent('ccraft:save'));
          break;
        case 'menu:undo':
          document.dispatchEvent(new CustomEvent('ccraft:undo'));
          break;
        case 'menu:redo':
          document.dispatchEvent(new CustomEvent('ccraft:redo'));
          break;
        case 'menu:togglePreview':
          document.dispatchEvent(new CustomEvent('ccraft:togglePreview'));
          break;
      }
    });
    return unsubscribe;
  }, [project]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 's') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('ccraft:save'));
      }
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('ccraft:undo'));
      }
      if (ctrl && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('ccraft:redo'));
      }
      if (ctrl && e.key === 'e') {
        e.preventDefault();
        if (project) setShowExport(true);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        document.dispatchEvent(new CustomEvent('ccraft:delete'));
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
    </>
  );
};

export default App;
