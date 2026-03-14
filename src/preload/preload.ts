import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  openProject: () => ipcRenderer.invoke('dialog:openProject'),
  openProjectByPath: (filePath: string) => ipcRenderer.invoke('fs:openProjectByPath', filePath),
  saveProject: (data: { content: string; filePath?: string }) => ipcRenderer.invoke('dialog:saveProject', data),
  exportLua: (data: { content: string; defaultName: string }) => ipcRenderer.invoke('dialog:exportLua', data),
  exportMultiFile: (data: { files: { path: string; content: string }[] }) => ipcRenderer.invoke('dialog:exportMultiFile', data),
  getRecentProjects: () => ipcRenderer.invoke('fs:getRecentProjects'),
  addRecentProject: (entry: { name: string; path: string }) => ipcRenderer.invoke('fs:addRecentProject', entry),

  onMenuAction: (callback: (action: string) => void) => {
    const actions = [
      'menu:newProject', 'menu:openProject', 'menu:save', 'menu:saveAs',
      'menu:export', 'menu:undo', 'menu:redo', 'menu:delete', 'menu:selectAll',
      'menu:zoomIn', 'menu:zoomOut', 'menu:zoomReset', 'menu:about',
    ];
    const handlers = actions.map(action => {
      const handler = () => callback(action);
      ipcRenderer.on(action, handler);
      return { action, handler };
    });
    return () => {
      handlers.forEach(({ action, handler }) => ipcRenderer.removeListener(action, handler));
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
