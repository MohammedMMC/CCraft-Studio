import { ipcMain, ipcRenderer, WebContents } from 'electron';
import { ChildProcess, spawn } from 'child_process';
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
        ? path.join(process.env.LOCALAPPDATA || '', 'CraftOS-PC', 'CraftOS-PC_console.exe')
        : os.platform() === 'darwin'
            ? '/Applications/CraftOS-PC.app/Contents/MacOS/CraftOS-PC_console'
            : '/usr/bin/CraftOS-PC_console';


let proc: ChildProcess | null = null;

export function setupCraftPCIPC(): void {
    ipcMain.handle('craftpc:getDirs', async () => {
        return {
            exec: fs.existsSync(CRAFTPC_EXEC_PATH) ? CRAFTPC_EXEC_PATH : null,
            data: fs.existsSync(CRAFTPC_DATA_DIR) ? CRAFTPC_DATA_DIR : null
        };
    });

    ipcMain.handle('craftpc:start', async (_event, execPath: string, isRemote: boolean = false) => {
        if (proc) return;
        proc = spawn(execPath, [isRemote ? '--raw-websocket <id>' : '--raw'], { windowsHide: true });

        proc.stdin!.write('!CPC0008BgADAA==498C93D2\n');
        proc.stdout!.on('data', (d: Buffer) => processChunk(d, _event.sender));
        proc.stderr!.on('data', (d: Buffer) => console.error('[CraftOS-PC]', d.toString()));
        proc.on('error', () => { proc = null; _event.sender.send('craftpc:exit'); });
        proc.on('close', () => { proc = null; _event.sender.send('craftpc:exit'); });
    });


    ipcMain.handle('craftpc:stop', async () => {
        // proc?.stdin?.write(useBinaryChecksum ? '!CPC000CBAACAAAAAAAA2C7A548B\n' : '!CPC000CBAACAAAAAAAA3AB9B910\n');
        proc?.kill();
        proc = null;
    });

}


function processChunk(data: Buffer, sender: WebContents) {
    const text = data.toString("ascii");

    const magic = text.slice(0, 4);     // "!CPC"
    const sizeHex = text.slice(4, 8);   // "0120"
    const size = parseInt(sizeHex, 16);

    const base64 = text.slice(8, 8 + size);
    const payload = Buffer.from(base64, "base64");
    console.log(parseTerminalPacket(payload));

} function readU16LE(buf: Buffer, off: number) {
    return buf.readUInt16LE(off);
}
function parseTerminalPacket(payload: Buffer) {
    if (payload.length < 13) {
        return null;
    }

    const type = payload.readUInt8(0);
    const windowId = payload.readUInt8(1);
    const mode = payload.readUInt8(2);
    const blink = payload.readUInt8(3);
    const width = readU16LE(payload, 4);
    const height = readU16LE(payload, 6);
    const cursorX = readU16LE(payload, 8);
    const cursorY = readU16LE(payload, 10);
    const grayscale = payload.readUInt8(12);

    return {
        type,
        windowId,
        mode,
        blink,
        width,
        height,
        cursorX,
        cursorY,
        grayscale,
    };
}

