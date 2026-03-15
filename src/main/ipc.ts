import { ipcMain, dialog, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export function setupIPC(): void {
  ipcMain.handle('dialog:openProject', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Open CCraft Project',
      filters: [{ name: 'CCraft Project', extensions: ['ccproj'] }],
      properties: ['openFile'],
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
        defaultPath: 'project.ccproj',
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
    const configDir = path.join(
      process.env.APPDATA || process.env.HOME || '',
      '.ccraft-studio'
    );
    const recentFile = path.join(configDir, 'recent.json');
    if (!fs.existsSync(recentFile)) return [];
    try {
      return JSON.parse(fs.readFileSync(recentFile, 'utf-8'));
    } catch {
      return [];
    }
  });

  ipcMain.handle('fs:addRecentProject', async (_event, entry: { name: string; path: string }) => {
    const configDir = path.join(
      process.env.APPDATA || process.env.HOME || '',
      '.ccraft-studio'
    );
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    const recentFile = path.join(configDir, 'recent.json');
    let recent: { name: string; path: string; openedAt: string }[] = [];
    if (fs.existsSync(recentFile)) {
      try { recent = JSON.parse(fs.readFileSync(recentFile, 'utf-8')); } catch { /* ignore */ }
    }
    recent = recent.filter(r => r.path !== entry.path);
    recent.unshift({ ...entry, openedAt: new Date().toISOString() });
    recent = recent.slice(0, 10);
    fs.writeFileSync(recentFile, JSON.stringify(recent, null, 2), 'utf-8');
    return recent;
  });
}
