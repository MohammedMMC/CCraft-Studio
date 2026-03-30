import React, { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useAppStore } from '@/stores/appStore';
import type * as craftpcHelpers from 'src/main/craftospcHelpers';
import * as cosCH from '../../utils/craftospcCanvasHelpers';
import { CC_CHAR_HEIGHT, CC_CHAR_SCALE, CC_CHAR_WIDTH, TerminalRenderer } from '@/engine/terminal/TerminalRenderer';
import { TerminalBuffer } from '@/engine/terminal/TerminalBuffer';
import { CraftOSPCIcons } from '../shared/Icons';

import { ExportOptions, exportProject } from '../../engine/luaExport/index';
import { CCProject } from '@/models/Project';


export const CraftPCPanel: React.FC = () => {
  const project = useProjectStore(s => s.project);
  const craftPCDataPath = useAppStore(s => s.craftPCDataPath);
  const craftPCExecPath = useAppStore(s => s.craftPCExecPath);

  const [termWidth, setTermWidth] = useState(51);
  const [termHeight, setTermHeight] = useState(19);

  const [canvasSize, setCanvasSize] = useState({ width: termWidth * CC_CHAR_WIDTH * CC_CHAR_SCALE, height: termHeight * CC_CHAR_HEIGHT * CC_CHAR_SCALE });

  const windowId = useRef(0);
  const computerId = useRef(0);

  const [currentSessionType, setCurrentSessionType] = useState<"local" | "remote">("local");

  const [failedToStart, setFailedToStart] = useState(true);
  const [sessionConnected, setSessionConnected] = useState(false);

  const [remoteId, setRemoteId] = useState<string | null>(null);

  const isClickHeld = useRef(false);
  const lastSendTime = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terminalBuffer = useRef(new TerminalBuffer(termWidth, termHeight));
  const terminalRenderer = useRef<TerminalRenderer | null>(null);

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const canvas = canvasRef.current as HTMLCanvasElement;

    terminalRenderer.current = new TerminalRenderer(canvas, terminalBuffer.current);
    setInterval(() => terminalRenderer.current?.render(), 100);

    window.electronAPI.craftpc.onPacket((packet: craftpcHelpers.CraftOSPacket) => {
      if (!sessionConnected) setSessionConnected(true);

      if (packet.windowId && packet.windowId !== windowId.current) windowId.current = packet.windowId;
      switch (packet.type) {
        case 0:
          if (packet.windowId === 0) {
            terminalBuffer.current.clear();
            terminalRenderer.current?.setBlinkingCursor(packet.blink, packet.cursorX, packet.cursorY);

            for (let y = 0; y < packet.height; y++) {
              for (let x = 0; x < packet.width; x++) {
                const charCode = packet.screen?.[y]?.[x] ?? 32;
                const char = String.fromCharCode(charCode);

                terminalBuffer.current.setCell(x, y, char, ...cosCH.rgbColorFromPalette(packet.palette, packet.colors, x, y));
              }
            }
          }
          break;
        case 4:
          if (packet.windowId === 0) {
            computerId.current = packet.computerId;
            setTermWidth(packet.width);
            setTermHeight(packet.height);
            updateCanvasSize(packet);
          }
          break;
        default:
          break;
      }
      console.log('Received packet:', packet);
    });

    startLocalSession();

    window.addEventListener("mouseup", () => isClickHeld.current = false);
  }, []);

  function handleKeyboardEvent(e: React.KeyboardEvent) {
    e.preventDefault();
    window.electronAPI.craftpc.key({ key: e.key, code: e.code, repeat: e.repeat, ctrlKey: e.ctrlKey, type: e.type, metaKey: e.metaKey }, windowId.current);
  }

  function handleMouseEvent(e: React.MouseEvent) {
    e.preventDefault();
    if (e.type === "mousemove" && Date.now() - lastSendTime.current < 100) return;
    if (e.type === "mousemove" && !isClickHeld.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;

    if (e.type === "mousedown") isClickHeld.current = true;
    if (e.type === "mouseup") isClickHeld.current = false;

    window.electronAPI.craftpc.mouse({
      eventType: e.type.replace("mousedown", "click").replace("mouseup", "up").replace("mousemove", "drag"),
      button: e.button,
      x: Math.floor(e.nativeEvent.offsetX / (canvas.clientWidth / termWidth)) + 1,
      y: Math.floor(e.nativeEvent.offsetY / (canvas.clientHeight / termHeight)) + 1,
    }, windowId.current);
    lastSendTime.current = Date.now();
  }

  function updateCanvasSize(packet: craftpcHelpers.PacketTermChange) {
    const newcanvasSize = { width: packet.width * CC_CHAR_WIDTH * CC_CHAR_SCALE, height: packet.height * CC_CHAR_HEIGHT * CC_CHAR_SCALE };
    setCanvasSize(newcanvasSize);

    if (canvasRef.current) {
      canvasRef.current.width = newcanvasSize.width;
      canvasRef.current.height = newcanvasSize.height;
      canvasRef.current.style.aspectRatio = `${newcanvasSize.width}/${newcanvasSize.height}`;
    }
  }

  async function startLocalSession() {
    return new Promise<void>((resolve, reject) => {
      setCurrentSessionType("local");
      terminalRenderer.current?.setBlinkingCursor(false, 0, 0);
      terminalBuffer.current.clear();
      setSessionConnected(false);
      setRemoteId(null);

      window.electronAPI.craftpc.stop().then(() => {
        window.electronAPI.craftpc.start(craftPCExecPath || '', false).then(() => {
          console.log('CraftOS-PC process started!');
          setFailedToStart(false);
          resolve();
        }).catch((err) => {
          setFailedToStart(true);
          reject(err);
        });
      });
    });
  }

  function startRemoteSession() {
    setCurrentSessionType("remote");
    terminalRenderer.current?.setBlinkingCursor(false, 0, 0);
    terminalBuffer.current.clear();
    setSessionConnected(false);

    window.electronAPI.craftpc.stop().then(() => {
      setRemoteId(null);
      window.electronAPI.craftpc.start(craftPCExecPath || '', true).then((rId) => {
        setFailedToStart(false);
        setRemoteId(rId);
        console.log('CraftOS-PC remote session started!');
      }).catch((err) => {
        setFailedToStart(true);
      });
    });
  }

  async function reloadFiles() {
    await window.electronAPI.craftpc.closeTestingApp(windowId.current);

    const options: ExportOptions = { mode: "full", minify: true };
    const files = exportProject(project as CCProject, options);

    if (files.length > 0) {
      if (currentSessionType === "local") {
        window.electronAPI.craftpc.exportProject({
          files: files.map(f => ({ path: f.path, content: f.content })),
          path: craftPCDataPath || "",
          isRemote: false,
          computerId: computerId.current,
          projectName: project?.name || "CCProject"
        }).catch(async (err) => {
          await startLocalSession();
          reloadFiles();
        }).then(() => {
          window.electronAPI.craftpc.startTestingApp({
            computerId: computerId.current,
            projectName: project?.name || "CCProject",
            windowId: windowId.current
          });
        });
      } else {

      }
    }

  }

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>CraftOS-PC</span>
      </div>
      <div className="h-full flex flex-col items-center justify-center text-app-text-dim">
        <div className="w-full flex p-4 justify-between">
          {/* <button><CraftOSPCIcons name="monitor" size={36} /></button>
          <button><CraftOSPCIcons name="computer" size={36} /></button> */}
          <button className={failedToStart ? "opacity-50 cursor-not-allowed" : ""} onClick={reloadFiles} disabled={failedToStart}>
            <CraftOSPCIcons name="reload" size={36} />
          </button>
          <button className={currentSessionType == "remote" || failedToStart ? "opacity-50 cursor-not-allowed" : ""} onClick={() => { window.electronAPI.craftpc.openProjectFolder(craftPCDataPath || "", computerId.current) }} disabled={currentSessionType == "remote" || failedToStart}>
            <CraftOSPCIcons name="folder" size={36} />
          </button>
          <button onClick={currentSessionType == "remote" ? startLocalSession : startRemoteSession}>
            <CraftOSPCIcons name="remote" size={36} className={currentSessionType == "remote" ? "fill-app-success/80" : "fill-app-error/80"} />
          </button>
        </div>
        <div className="relative grid bg-black w-full grid-cols-[12px_auto_12px] grid-rows-[12px_auto_12px]">
          {(!craftPCDataPath || !craftPCExecPath || failedToStart) && (
            <div className="absolute flex items-center justify-center h-full w-full p-2">
              <p className="text-center font-[MinecraftFont] tracking-wider text-app-text-dim">CraftOS-PC not detected.</p>
            </div>
          )}

          {(!failedToStart && remoteId && !sessionConnected) && (
            <div className="absolute flex items-center justify-center h-full w-full p-2">
              <p className="text-center font-[MinecraftFont] tracking-wider text-app-text-dim text-xs">{"wget run https://remote.craftos-pc.cc/server.lua " + remoteId}</p>
            </div>
          )}

          <div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:0px_0px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[1/2] bg-repeat-x w-auto h-[12px] bg-[position:0px_0px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:-12px_0px]"></div>
          <div className="CraftOSPC-xsides row-[2/3] col-[1/2] bg-repeat-y w-[12px] h-auto bg-[position:0px_0px]"></div>

          <canvas
            ref={canvasRef}
            tabIndex={0}
            onClick={(e) => e.currentTarget.focus()}
            onKeyDown={handleKeyboardEvent}
            onKeyUp={handleKeyboardEvent}
            onMouseDown={handleMouseEvent}
            onMouseUp={handleMouseEvent}
            onMouseMove={handleMouseEvent}
            // onScroll={handleMouseEvent} // TODO
            className="w-full row-[2/3] col-[2/3] outline-0 cursor-default p-[1px]"
            width={canvasSize.width} height={canvasSize.height}
            style={{ imageRendering: 'pixelated', aspectRatio: `${canvasSize.width}/${canvasSize.height}` }}
          ></canvas>

          <div className="CraftOSPC-xsides row-[2/3] col-[3/4] bg-repeat-y w-[12px] h-auto bg-[position:-12px_0px]"></div>
          <div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[3/4] bg-repeat-x w-auto h-[12px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:-12px_-12px]"></div>
        </div>

      </div>
    </div>
  );
};
