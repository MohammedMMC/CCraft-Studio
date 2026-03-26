import { ipcMain, WebContents } from 'electron';
import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as craftpcHelpers from './craftospcHelpers';

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
let leftover: Buffer = Buffer.alloc(0);
let protocolState: craftpcHelpers.ParseOptions = {};

export function setupCraftPCIPC(): void {
    ipcMain.handle('craftpc:getDirs', async () => {
        return {
            exec: fs.existsSync(CRAFTPC_EXEC_PATH) ? CRAFTPC_EXEC_PATH : null,
            data: fs.existsSync(CRAFTPC_DATA_DIR) ? CRAFTPC_DATA_DIR : null
        };
    });

    ipcMain.on('craftpc:key', (_event, data: any) => {
        if (data.key.length == 1 && data.type == "keydown") {
            proc?.stdin?.write(craftpcHelpers.buildKeyPacket(0, data.key.charCodeAt(0), data.type == "keydown", true, data.repeat, data.ctrlKey));
        }
        proc?.stdin?.write(craftpcHelpers.buildKeyPacket(0, craftpcHelpers.KEY_MAP[data.code], data.type == "keydown", false, data.repeat, data.ctrlKey));
    });

    ipcMain.handle('craftpc:start', async (_event, execPath: string, isRemote: boolean = false) => {
        if (proc) return;
        proc = spawn(execPath, [isRemote ? '--raw-websocket <id>' : '--raw'], { windowsHide: true });

        proc.stdin!.write(craftpcHelpers.HANDSHAKE);

        proc.stdout!.on('data', (chunk: Buffer) => {
            leftover = Buffer.concat([leftover, chunk]);
            const { packets, remaining } = craftpcHelpers.parseCraftOSPackets(leftover, protocolState);
            leftover = remaining;

            for (const { packet } of packets) {
                if (packet.type === 6) {
                    protocolState.useBinaryChecksum = packet.binaryChecksum;
                    protocolState.isVersion11 = true;
                    craftpcHelpers.setBinaryChecksum(packet.binaryChecksum);
                }
                _event.sender.send('craftpc:packet', packet);
            }
        });

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

