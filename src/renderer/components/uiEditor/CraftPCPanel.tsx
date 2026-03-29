import React, { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useAppStore } from '@/stores/appStore';
import type * as craftpcHelpers from 'src/main/craftospcHelpers';
import * as cosCH from '../../utils/craftospcCanvasHelpers';
import { CC_CHAR_HEIGHT, CC_CHAR_SCALE, CC_CHAR_WIDTH, TerminalRenderer } from '@/engine/terminal/TerminalRenderer';
import { TerminalBuffer } from '@/engine/terminal/TerminalBuffer';
import { CraftOSPCIcons } from '../shared/Icons';



export const CraftPCPanel: React.FC = () => {
  const project = useProjectStore(s => s.project);
  const craftPCDataPath = useAppStore(s => s.craftPCDataPath);
  const craftPCExecPath = useAppStore(s => s.craftPCExecPath);

  const [termWidth, setTermWidth] = useState(51);
  const [termHeight, setTermHeight] = useState(19);

  const [canvasSize, setCanvasSize] = useState({ width: termWidth * CC_CHAR_WIDTH * CC_CHAR_SCALE, height: termHeight * CC_CHAR_HEIGHT * CC_CHAR_SCALE });

  const [windowId, setWindowId] = useState(0);
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

  const [monitors, setMonitors] = useState<Map<number, cosCH.Monitor>>(new Map());

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const canvas = canvasRef.current as HTMLCanvasElement;

    terminalRenderer.current = new TerminalRenderer(canvas, terminalBuffer.current);
    setInterval(() => terminalRenderer.current?.render(), 100);

    window.electronAPI.craftpc.onPacket((packet: craftpcHelpers.CraftOSPacket) => {
      if (!sessionConnected) setSessionConnected(true);

      if (packet.windowId && packet.windowId !== windowId) setWindowId(packet.windowId);
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
          computerId.current = packet.computerId;
          if (packet.windowId === 0) {
            setWindowId(0);
            // setTermWidth(packet.width);
            // setTermHeight(packet.height);
            // updateCanvasSize(packet);
          }
          // if (packet.title.toLowerCase().includes("monitor")) {
          setMonitors(prev => new Map(prev).set(packet.windowId, {
            windowId: packet.windowId,
            width: packet.width, height: packet.height,
            canvasWidth: packet.width * CC_CHAR_WIDTH * CC_CHAR_SCALE,
            canvasHeight: packet.height * CC_CHAR_HEIGHT * CC_CHAR_SCALE,
            id: packet.title.split("")[1].split(" ")[1],
            buffer: new TerminalBuffer(packet.width, packet.height),
            renderer: new TerminalRenderer(canvas, new TerminalBuffer(packet.width, packet.height))
          }));
          // }
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
    window.electronAPI.craftpc.key({ key: e.key, code: e.code, repeat: e.repeat, ctrlKey: e.ctrlKey, type: e.type }, windowId);
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
    }, windowId);
    lastSendTime.current = Date.now();
  }

  function updateCanvasSize(packet: { width: number; height: number }) {
    const newcanvasSize = { width: packet.width * CC_CHAR_WIDTH * CC_CHAR_SCALE, height: packet.height * CC_CHAR_HEIGHT * CC_CHAR_SCALE };
    setCanvasSize(newcanvasSize);

    if (canvasRef.current) {
      canvasRef.current.width = newcanvasSize.width;
      canvasRef.current.height = newcanvasSize.height;
      canvasRef.current.style.aspectRatio = `${newcanvasSize.width}/${newcanvasSize.height}`;
    }
  }

  function startLocalSession() {
    setCurrentSessionType("local");
    terminalRenderer.current?.setBlinkingCursor(false, 0, 0);
    terminalBuffer.current.clear();
    setSessionConnected(false);
    setRemoteId(null);

    window.electronAPI.craftpc.stop().then(() => {
      window.electronAPI.craftpc.start(craftPCExecPath || '', false).then(() => {
        console.log('CraftOS-PC process started!');
        setFailedToStart(false);
      }).catch((err) => {
        console.error('Failed to start CraftOS-PC:', err);
        setFailedToStart(true);
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

  useEffect(() => {
    const currentMonitor = monitors.get(windowId);
    if (currentMonitor) {
      currentMonitor.renderer.setBuffer(currentMonitor.buffer);
      updateCanvasSize({ width: currentMonitor.width, height: currentMonitor.height });
    }
  }, [windowId]);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>CraftOS-PC</span>
      </div>
      <div className="h-full flex flex-col items-center justify-center text-app-text-dim">
        <div className="w-full flex p-4 justify-between">
          {/* <button><CraftOSPCIcons name="monitor" size={36} /></button>
          <button><CraftOSPCIcons name="computer" size={36} /></button> */}
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
            className="w-full row-[2/3] col-[2/3] outline-0 m-1 cursor-default"
            width={canvasSize.width} height={canvasSize.height}
            style={{ imageRendering: 'pixelated', aspectRatio: `${canvasSize.width}/${canvasSize.height}` }}
          ></canvas>

          <div className="CraftOSPC-xsides row-[2/3] col-[3/4] bg-repeat-y w-[12px] h-auto bg-[position:-12px_0px]"></div>
          <div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[3/4] bg-repeat-x w-auto h-[12px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:-12px_-12px]"></div>
        </div>

        <div className="h-32 w-[calc(100%-16px)] overflow-x-auto flex justify-between gap-2 m-2 overflow-hidden">
          {monitors.size > 0 && Array.from(monitors.values()).map(monitor => (
            <>
              <div
                style={{ aspectRatio: `${monitor.canvasWidth}/${monitor.canvasHeight}` }}
                className={(windowId == monitor.windowId ? "hidden " : "") + "relative grid bg-black grid-cols-[6px_auto_6px] grid-rows-[6px_auto_6px]"}>
                <div className="CraftOSPC-corners bg-no-repeat w-[6px] h-[6px] bg-[position:0px_0px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[1/2] bg-repeat-x w-auto h-[6px] bg-[position:0px_0px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[6px] h-[6px] bg-[position:-12px_0px]"></div>
                <div className="CraftOSPC-xsides row-[2/3] col-[1/2] bg-repeat-y w-[6px] bg-[position:0px_0px]"></div>

                <canvas
                  onClick={(e) => setWindowId(monitor.windowId)}
                  className="w-full row-[2/3] col-[2/3] cursor-pointer"
                  width={monitor.canvasWidth} height={monitor.canvasHeight}
                  style={{ height: "calc(128px - 6px * 2)", imageRendering: 'pixelated', aspectRatio: `${monitor.canvasWidth}/${monitor.canvasHeight}` }}
                ></canvas>

                <div className="CraftOSPC-xsides row-[2/3] col-[3/4] bg-repeat-y w-[6px] bg-[position:-12px_0px]"></div>
                <div className="CraftOSPC-corners bg-no-repeat w-[6px] h-[6px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[3/4] bg-repeat-x w-auto h-[6px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[6px] h-[6px] bg-[position:-12px_-12px]"></div>
              </div>
            </>
          ))}
        </div>

      </div>
    </div>
  );
};
