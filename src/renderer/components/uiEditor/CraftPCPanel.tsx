import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useAppStore } from '@/stores/appStore';

export const CraftPCPanel: React.FC = () => {
  const project = useProjectStore(s => s.project);
  const craftPCDataPath = useAppStore(s => s.craftPCDataPath);
  const craftPCExecPath = useAppStore(s => s.craftPCExecPath);


  
  window.electronAPI.craftpc.start(craftPCExecPath || '', false).then(() => {
    console.log('CraftOS-PC process exited');
    // window.electronAPI.craftpc.onOutput((data: any) => {
      
    // });
  }).catch((err) => {
    console.error('Failed to start CraftOS-PC:', err);
  });

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
        <div id="craftpc-canvas" className="relative grid bg-app-bg w-full aspect-[62/35]">
          {(!craftPCDataPath || !craftPCExecPath) && (
            <div className="absolute flex items-center justify-center h-full w-full">
              <p className="text-center font-[MinecraftFont] tracking-wider text-app-text-dim">CraftOS-PC not detected.</p>
            </div>
          )}
          <div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:0px_0px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[1/2] bg-repeat-x w-auto h-[12px] bg-[position:0px_0px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:-12px_0px]"></div>
          <div className="CraftOSPC-xsides row-[2/3] col-[1/2] bg-repeat-y w-[12px] h-auto bg-[position:0px_0px]"></div><canvas className="w-full row-[2/3] col-[2/3]" width={620} height={350}></canvas><div className="CraftOSPC-xsides row-[2/3] col-[3/4] bg-repeat-y w-[12px] h-auto bg-[position:-12px_0px]"></div>
          <div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-ysides col-[2/3] row-[3/4] bg-repeat-x w-auto h-[12px] bg-[position:0px_-12px]"></div><div className="CraftOSPC-corners bg-no-repeat w-[12px] h-[12px] bg-[position:-12px_-12px]"></div>
        </div>

      </div>
    </div>
  );
};
