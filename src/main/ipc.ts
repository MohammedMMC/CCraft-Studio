import { ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const DEFAULT_DOCS_DIR = path.join(os.homedir(), 'Documents', 'CCraft-Studio');
export const APP_DATA_DIR = path.join(process.env.APPDATA || process.env.HOME || '', '.ccraft-studio');
export const APP_DATA_FILE = path.join(APP_DATA_DIR, 'appdata.json');
export const APP_RECENT_FILE = path.join(APP_DATA_DIR, 'recent.json');

export function setupIPC(): void {
  fs.mkdirSync(DEFAULT_DOCS_DIR, { recursive: true });
  fs.mkdirSync(APP_DATA_DIR, { recursive: true });

  ipcMain.handle('app:getAppData', async () => {
    if (!fs.existsSync(APP_DATA_FILE)) {
      return {};
    }

    const content = fs.readFileSync(APP_DATA_FILE, 'utf-8');
    return JSON.parse(content);
  });

  ipcMain.handle('app:saveAppData', async (_event, data: {}) => {
    fs.writeFileSync(APP_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  });

  ipcMain.handle('dialog:openProject', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Open CCraft Project',
      filters: [{ name: 'CCraft Project', extensions: ['ccproj'] }],
      properties: ['openFile'],
      defaultPath: path.join(DEFAULT_DOCS_DIR, '/'),
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    return { filePath, content: JSON.parse(content) };
  });

  ipcMain.handle('fs:openProjectByPath', async (_event, filePath: string) => {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf-8');
    return { filePath, content: JSON.parse(content) };
  });

  ipcMain.handle('dialog:saveProject', async (_event, data: { content: string; filePath?: string }) => {
    let targetPath = data.filePath;

    if (!targetPath) {
      const result = await dialog.showSaveDialog({
        title: 'Save CCraft Project',
        filters: [{ name: 'CCraft Project', extensions: ['ccproj'] }],
        defaultPath: path.join(DEFAULT_DOCS_DIR, 'project.ccproj'),
      });
      if (result.canceled || !result.filePath) return null;
      targetPath = result.filePath;
    }
    fs.writeFileSync(targetPath, data.content, 'utf-8');
    return targetPath;
  });

  ipcMain.handle('dialog:exportLua', async (_event, data: { content: string; defaultName: string }) => {
    const result = await dialog.showSaveDialog({
      title: 'Export Lua Program',
      filters: [{ name: 'Lua Script', extensions: ['lua'] }],
      defaultPath: data.defaultName,
    });
    if (result.canceled || !result.filePath) return null;
    fs.writeFileSync(result.filePath, data.content, 'utf-8');
    return result.filePath;
  });

  ipcMain.handle('dialog:exportMultiFile', async (_event, data: { files: { path: string; content: string }[] }) => {
    const result = await dialog.showOpenDialog({
      title: 'Select Export Directory',
      properties: ['openDirectory', 'createDirectory'],
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    const dir = result.filePaths[0];
    for (const file of data.files) {
      const fullPath = path.join(dir, file.path);
      const fileDir = path.dirname(fullPath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      fs.writeFileSync(fullPath, file.content, 'utf-8');
    }
    return dir;
  });

  ipcMain.handle('fs:getRecentProjects', async () => {
    if (!fs.existsSync(APP_RECENT_FILE)) return [];
    try {
      return JSON.parse(fs.readFileSync(APP_RECENT_FILE, 'utf-8'));
    } catch {
      return [];
    }
  });

  ipcMain.handle('fs:addRecentProject', async (_event, entry: { name: string; path: string }) => {
    let recent: { name: string; path: string; openedAt: string }[] = [];
    if (fs.existsSync(APP_RECENT_FILE)) {
      try { recent = JSON.parse(fs.readFileSync(APP_RECENT_FILE, 'utf-8')); } catch { }
    }
    recent = recent.filter(r => r.path !== entry.path);
    recent.unshift({ ...entry, openedAt: new Date().toISOString() });
    recent = recent.slice(0, 10);
    fs.writeFileSync(APP_RECENT_FILE, JSON.stringify(recent, null, 2), 'utf-8');
    return recent;
  });
}
