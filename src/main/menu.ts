import { BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';

export function buildMenu(win: BrowserWindow): Menu {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New Project', accelerator: 'CmdOrCtrl+N', click: () => win.webContents.send('menu:newProject') },
        { label: 'Open Project', accelerator: 'CmdOrCtrl+O', click: () => win.webContents.send('menu:openProject') },
        { type: 'separator' },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => win.webContents.send('menu:save') },
        { label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S', click: () => win.webContents.send('menu:saveAs') },
        { type: 'separator' },
        { label: 'Export Lua...', accelerator: 'CmdOrCtrl+E', click: () => win.webContents.send('menu:export') },
        { type: 'separator' },
        { label: 'Settings', click: () => win.webContents.send('menu:settings') },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: () => win.webContents.send('menu:undo') },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', click: () => win.webContents.send('menu:redo') },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Delete', accelerator: 'Delete', click: () => win.webContents.send('menu:delete') },
        { type: 'separator' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', click: () => win.webContents.send('menu:selectAll') },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', click: () => win.webContents.send('menu:zoomIn') },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => win.webContents.send('menu:zoomOut') },
        { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => win.webContents.send('menu:zoomReset') },
        { type: 'separator' },
        { role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About CCraft Studio', click: () => win.webContents.send('menu:about') },
        {
          label: 'CC:Tweaked Documentation', click: () => {
            require('electron').shell.openExternal('https://tweaked.cc/');
          }
        },
        {
          label: 'Have a question?', click: () => {
            require('electron').shell.openExternal('https://github.com/MohammedMMC/CCraft-Studio/discussions');
          }
        },
        {
          label: 'Report an Issue', click: () => {
            require('electron').shell.openExternal('https://github.com/MohammedMMC/CCraft-Studio/issues');
          }
        },
        {
          label: 'Releases', click: () => {
            require('electron').shell.openExternal('https://github.com/MohammedMMC/CCraft-Studio/releases');
          }
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}
