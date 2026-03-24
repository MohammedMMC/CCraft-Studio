import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { CraftOSPCIcons } from '../shared/Icons';

export const CraftPCPanel: React.FC = () => {
  const project = useProjectStore((s) => s.project);

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
        <div className="bg-app-bg w-full aspect-video">

        </div>

      </div>
    </div>
  );
};
