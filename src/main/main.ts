import { app, BrowserWindow, Menu } from 'electron';
import { setupCraftPCIPC } from './craftpc.ipc';
import { setupIPC } from './ipc';
import { buildMenu } from './menu';
import * as path from 'path';

const isLinux = process.platform === 'linux';
const useSafeGraphics =
  process.argv.includes('--safe-gfx') ||
  process.env.CCRAFT_SAFE_GFX === '1' ||
  process.env.CCRAFT_DISABLE_GPU === '1';

if (isLinux) {
  app.commandLine.appendSwitch('ozone-platform', 'x11');
  app.commandLine.appendSwitch('ozone-platform-hint', 'x11');
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('enable-features', 'UseOzonePlatform');
  app.commandLine.appendSwitch('disable-features', 'WaylandWindowDecorations');
}

if (useSafeGraphics) {
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-gpu-rasterization');
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'CCraft Studio',
    backgroundColor: '#1e1e2e',
    icon: path.join(app.getAppPath(), 'assets', 'icons', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: true,
    show: false,
  });

  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('Renderer crashed:', details.reason, details.exitCode);
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.error('Renderer became unresponsive');
  });

  const menu = buildMenu(mainWindow);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  setupIPC();
  setupCraftPCIPC();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
