import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';


import * as os from 'os';

export const CRAFTPC_DATA_DIR =
    os.platform() === 'win32'
        ? path.join(process.env.APPDATA || '', 'CraftOS-PC')
        : os.platform() === 'darwin'
            ? path.join(os.homedir(), 'Library', 'Application Support', 'CraftOS-PC')
            : path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share'), 'craftos-pc');

export const CRAFTPC_EXEC_PATH =
    os.platform() === 'win32'
        ? path.join(process.env.LOCALAPPDATA || '', 'CraftOS-PC', 'CraftOS-PC.exe')
        : os.platform() === 'darwin'
            ? '/Applications/CraftOS-PC.app/Contents/MacOS/CraftOS-PC'
            : '/usr/bin/craftos-pc';

export function setupCraftPCIPC(): void {

    ipcMain.handle('craftpc:getDirs', async () => {
        return {
            exec: fs.existsSync(CRAFTPC_EXEC_PATH) ? CRAFTPC_EXEC_PATH : null,
            data: fs.existsSync(CRAFTPC_DATA_DIR) ? CRAFTPC_DATA_DIR : null
        };
    });
}
