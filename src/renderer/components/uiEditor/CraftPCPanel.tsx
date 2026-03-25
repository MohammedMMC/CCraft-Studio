import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { CraftOSPCIcons } from '../shared/Icons';

export const CraftPCPanel: React.FC = () => {
  const project = useProjectStore(s => s.project);



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
        <div id="craftpc-canvas" className="grid bg-app-bg w-full aspect-[62/35]">
          <div className="border-top-left bg-no-repeat"></div><div className="border-top row-[2/3] bg-repeat-x"></div><div className="border-top-right bg-no-repeat"></div>
          <div className="border-left row-[2/3] bg-repeat-y"></div><canvas className="w-full row-[2/3] col-[2/3]" width={620} height={350}></canvas><div className="border-right row-[2/3] bg-repeat-y"></div>
          <div className="border-bottom-left bg-no-repeat"></div><div className="border-bottom row-[2/3] bg-repeat-x"></div><div className="border-bottom-right bg-no-repeat"></div>
        </div>

      </div>
    </div>
  );
};
