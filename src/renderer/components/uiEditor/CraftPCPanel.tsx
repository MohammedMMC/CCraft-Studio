import React, { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useAppStore } from '@/stores/appStore';
import type * as craftpcHelpers from 'src/main/craftospcHelpers';
import * as cosCH from '../../utils/craftospcCanvasHelpers';
import { TerminalRenderer } from '@/engine/terminal/TerminalRenderer';
import { TerminalBuffer } from '@/engine/terminal/TerminalBuffer';



export const CraftPCPanel: React.FC = () => {
  const project = useProjectStore(s => s.project);
  const craftPCDataPath = useAppStore(s => s.craftPCDataPath);
  const craftPCExecPath = useAppStore(s => s.craftPCExecPath);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    window.electronAPI.craftpc.onPacket((packet: craftpcHelpers.CraftOSPacket) => {
      switch (packet.type) {
        case 0:
          const canvas = canvasRef.current as HTMLCanvasElement;

          const buffer = new TerminalBuffer(packet.width, packet.height);
          const terminalRenderer = new TerminalRenderer(canvas, buffer);

          buffer.clear();

          terminalRenderer.setBlinkingCursor(packet.blink, packet.cursorX, packet.cursorY);

          for (let y = 0; y < packet.height; y++) {
            for (let x = 0; x < packet.width; x++) {
              const charCode = packet.screen?.[y]?.[x] ?? 32;
              const char = String.fromCharCode(charCode);

              if (charCode !== 32 && charCode !== 0) {
                buffer.setCell(x, y, char, ...cosCH.rgbColorFromPalette(packet.palette, packet.colors, x, y));
              }
            }
          }
          break;
        case 4:
          break;
        default:
          break;
      }
      console.log('Received packet:', packet);
    });

    window.electronAPI.craftpc.start(craftPCExecPath || '', false).then(() => {
      console.log('CraftOS-PC process started!');
    }).catch((err) => {
      console.error('Failed to start CraftOS-PC:', err);
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>CraftOS-PC</span>
      </div>
      <div className="h-full flex flex-col items-center justify-center text-app-text-dim">
        {/* <div className="w-full flex p-4 justify-between">
          <CraftOSPCIcons name="monitor" size={36} />
          <CraftOSPCIcons name="computer" size={36} />
        </div> */}
        <div className="relative grid bg-app-bg w-full aspect-[62/35]">
          {(!craftPCDataPath || !craftPCExecPath) && (
            <div className="absolute flex items-center justify-center h-full w-full">
              <p className="text-center font-[MinecraftFont] tracking-wider text-app-text-dim">CraftOS-PC not detected.</p>
            </div>
          )}
          <div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:0px_0px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[1/2] bg-repeat-x w-auto h-[12px] bg-[position:0px_0px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:-12px_0px]"></div>
          <div className="CraftOSPC-xsides row-[2/3] col-[1/2] bg-repeat-y w-[12px] h-auto bg-[position:0px_0px]"></div>

          <canvas
            ref={canvasRef}
            className="w-full row-[2/3] col-[2/3]"
            width={620} height={350}
            style={{ imageRendering: 'pixelated', cursor: 'default' }}

          ></canvas>

          <div className="CraftOSPC-xsides row-[2/3] col-[3/4] bg-repeat-y w-[12px] h-auto bg-[position:-12px_0px]"></div>
          <div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[3/4] bg-repeat-x w-auto h-[12px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:-12px_-12px]"></div>
        </div>

      </div>
    </div>
  );
};
