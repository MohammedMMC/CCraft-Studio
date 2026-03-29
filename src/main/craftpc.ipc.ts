import { ipcMain, shell, WebContents } from 'electron';
import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as craftpcHelpers from './craftospcHelpers';
import WebSocket from 'ws';

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
let socket: WebSocket | null = null;
let leftover: Buffer = Buffer.alloc(0);
let protocolState: craftpcHelpers.ParseOptions = {};

export function setupCraftPCIPC(): void {
    ipcMain.handle('craftpc:getDirs', async () => {
        return {
            exec: fs.existsSync(CRAFTPC_EXEC_PATH) ? CRAFTPC_EXEC_PATH : null,
            data: fs.existsSync(CRAFTPC_DATA_DIR) ? CRAFTPC_DATA_DIR : null
        };
    });

    ipcMain.handle('craftpc:openProjectFolder', async (_event, dirPath: string, computerId: number) => {
        await shell.openPath(path.join(dirPath, "computer", String(computerId)));
    });

    ipcMain.on('craftpc:key', (_event, data: any, windowId: number = 0) => {
        if (data.key.length == 1 && data.type == "keydown") {
            proc!.stdin!.write(craftpcHelpers.buildKeyPacket(windowId, data.key.charCodeAt(0), data.type == "keydown", true, data.repeat, data.ctrlKey));
        }
        proc!.stdin!.write(craftpcHelpers.buildKeyPacket(windowId, craftpcHelpers.KEY_MAP[data.code], data.type == "keydown", false, data.repeat, data.ctrlKey));
    });

    ipcMain.on('craftpc:mouse', (_event, data, windowId: number = 0) => {
        proc!.stdin!.write(craftpcHelpers.buildMousePacket(windowId, data.eventType, 0, data.x, data.y));
    });

    ipcMain.handle('craftpc:start', async (_event, execPath: string, isRemote: boolean = false) => {
        if (proc) return;
        let remoteId: string = "";

        if (isRemote) {
            remoteId = await fetch("https://remote.craftos-pc.cc/new").then(res => res.text());

            if (remoteId.length !== 40) {
                throw new Error("Failed to obtain remote ID");
            }
        }

        proc = spawn(execPath, [isRemote ? ('--raw-websocket wss://remote.craftos-pc.cc/' + remoteId) : '--raw'], { windowsHide: true });


        if (isRemote) {
            socket = new WebSocket("wss://remote.craftos-pc.cc/" + remoteId);

            if (proc && proc.stdin) proc.stdin.write = socket?.send.bind(socket) as any;

            socket.on('open', () => {
                socket?.send(craftpcHelpers.HANDSHAKE);
            });

            socket.on('message', (data) => {
                leftover = Buffer.concat([leftover, data as Buffer]);
                const { packets, remaining } = craftpcHelpers.parseCraftOSPackets(leftover, protocolState);
                leftover = remaining;

                for (const { packet } of packets) {
                    if (packet.type === 6) {
                        protocolState.useBinaryChecksum = packet.binaryChecksum;
                        protocolState.isVersion11 = true;
                        craftpcHelpers.setBinaryChecksum(packet.binaryChecksum);
                    }

                    if (packet.type === 4 && !protocolState.isVersion11) socket?.send(craftpcHelpers.HANDSHAKE);

                    _event.sender.send('craftpc:packet', packet);
                }

            });

            socket.on('error', () => {
                socket?.close();
            });

            socket.on('close', () => {
                ipcMain.emit('craftpc:stop');
            });

        } else {
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
        }

        proc.stderr!.on('data', (d: Buffer) => console.error('[CraftOS-PC]', d.toString()));
        proc.on('error', () => { ipcMain.emit('craftpc:stop'); });
        proc.on('close', () => { ipcMain.emit('craftpc:stop'); });

        return remoteId;
    });

    ipcMain.handle('craftpc:stop', async () => {
        proc?.stdin?.write(protocolState.useBinaryChecksum ? '!CPC000CBAACAAAAAAAA2C7A548B\n' : '!CPC000CBAACAAAAAAAA3AB9B910\n');

        proc?.kill();
        proc = null;

        socket?.close();
        socket = null;

        protocolState = {};
        craftpcHelpers.setBinaryChecksum(false);
    });

    ipcMain.handle('craftpc:exportProject', async (_event, data: { files: { path: string; content: string }[], path: string, isRemote: boolean, computerId: number, projectName: string }) => {

        if (data.isRemote) {

        } else {
            if (!fs.existsSync(data.path)) return null;

            const dir = path.join(data.path, "computer", String(data.computerId), data.projectName);

            await new Promise((resolve, reject) => {
                if (fs.existsSync(dir)) {
                    fs.rmdir(dir, { recursive: true }, (err) => {
                        if (err) reject(err);
                        fs.mkdir(dir, { recursive: true }, (err) => {
                            if (err) reject(err);
                            else resolve(undefined);
                        });
                    });
                } else {
                    fs.mkdir(dir, { recursive: true }, (err) => {
                        if (err) reject(err);
                        else resolve(undefined);
                    });
                }
            });

            for (const file of data.files) {
                const fullPath = path.join(dir, file.path);
                const fileDir = path.dirname(fullPath);
                if (!fs.existsSync(fileDir)) {
                    fs.mkdirSync(fileDir, { recursive: true });
                }
                fs.writeFileSync(fullPath, file.content, 'utf-8');
            }
            return dir;
        }
    });

}
