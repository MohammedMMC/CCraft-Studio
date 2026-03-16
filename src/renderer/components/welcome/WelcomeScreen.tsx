import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useBlocklyStore } from '../../stores/blocklyStore';

interface RecentProject {
  name: string;
  path: string;
  openedAt: string;
}

declare global {
  interface Window {
    electronAPI: {
      openProject: () => Promise<{ filePath: string; content: any } | null>;
      openProjectByPath: (filePath: string) => Promise<{ filePath: string; content: any } | null>;
      saveProject: (data: { content: string; filePath?: string }) => Promise<string | null>;
      exportLua: (data: { content: string; defaultName: string }) => Promise<string | null>;
      exportMultiFile: (data: { files: { path: string; content: string }[] }) => Promise<string | null>;
      getRecentProjects: () => Promise<RecentProject[]>;
      addRecentProject: (entry: { name: string; path: string }) => Promise<RecentProject[]>;
      onMenuAction: (callback: (action: string) => void) => () => void;
    };
  }
}

interface WelcomeScreenProps {
  onNewProject: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNewProject }) => {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const loadProject = useProjectStore((s) => s.loadProject);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getRecentProjects().then(setRecentProjects).catch(() => {});
    }
  }, []);

  const handleLoadProjectData = (data: any, filePath: string) => {
    const blocklyXml = data._blocklyXml as Record<string, string> | undefined;
    const { _blocklyXml, ...projectData } = data;
    loadProject(projectData, filePath);
    if (blocklyXml) {
      useBlocklyStore.getState().loadAllXml(blocklyXml);
    }
  };

  const handleOpenProject = async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.openProject();
    if (result) {
      handleLoadProjectData(result.content, result.filePath);
      window.electronAPI.addRecentProject({ name: result.content.name, path: result.filePath });
    }
  };

  const handleOpenRecent = async (project: RecentProject) => {
    if (!window.electronAPI) return;
    try {
      const result = await window.electronAPI.openProjectByPath(project.path);
      if (result) {
        handleLoadProjectData(result.content, result.filePath);
        window.electronAPI.addRecentProject({ name: result.content.name, path: result.filePath });
      } else {
        setRecentProjects((prev) => prev.filter((p) => p.path !== project.path));
      }
    } catch {
      setRecentProjects((prev) => prev.filter((p) => p.path !== project.path));
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-app-bg">
      <div className="flex flex-col items-center max-w-2xl w-full px-8">
        {/* Logo / Title */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-app-text-bright mb-2 tracking-tight">
            <span className="text-app-accent">CC</span>raft Studio
          </h1>
          <p className="text-sm text-app-text-dim">
            Visual UI Builder & Block Programmer for ComputerCraft: Tweaked
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={onNewProject}
            className="btn-primary text-base px-8 py-3"
          >
            New Project
          </button>
          <button
            onClick={handleOpenProject}
            className="btn-secondary text-base px-8 py-3"
          >
            Open Project
          </button>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="w-full max-w-md">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-app-text-dim mb-3">
              Recent Projects
            </h3>
            <div className="space-y-1">
              {recentProjects.map((project, i) => (
                <button
                  key={i}
                  onClick={() => handleOpenRecent(project)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded
                             bg-app-surface border border-app-border hover:bg-app-hover
                             transition-colors text-left group"
                >
                  <div>
                    <span className="text-sm text-app-text group-hover:text-app-text-bright">
                      {project.name}
                    </span>
                    <span className="block text-xs text-app-text-dim truncate max-w-xs">
                      {project.path}
                    </span>
                  </div>
                  <span className="text-xs text-app-text-dim">
                    {new Date(project.openedAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Version */}
        <div className="mt-10 text-xs text-app-text-dim">
          v1.0.0 &middot; CC:Tweaked
        </div>
      </div>
    </div>
  );
};
