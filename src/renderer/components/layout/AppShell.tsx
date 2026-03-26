import React, { useRef, useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { Toolbar } from './Toolbar';
import { TabBar } from './TabBar';
import { StatusBar } from './StatusBar';
import { UIEditorCanvas } from '../uiEditor/UIEditorCanvas';
import { ElementToolkit } from '../uiEditor/ElementToolkit';
import { PropertiesPanel } from '../uiEditor/PropertiesPanel';
import { BlocklyWorkspace } from '../blockEditor/BlocklyWorkspace';
import { ElementsPanel } from '../uiEditor/ElementsPanel';
import { CraftPCPanel } from '../uiEditor/CraftPCPanel';
import { useAppStore } from '@/stores/appStore';
import { PanelDiv } from '../shared/PanelDiv';

interface AppShellProps {
  onExport: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ onExport }) => {
  const mode = useEditorStore((s) => s.mode);
  const showCraftPC = useEditorStore(s => s.showCraftPC);
  const useCraftOSPC = useAppStore((s) => s.useCraftOSPC);


  return (
    <div className="flex flex-col w-full h-full">
      <Toolbar onExport={onExport} />
      <TabBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - only in UI mode (Blockly has its own toolbox) */}
        {mode === 'ui' && <ElementToolkit />}

        {/* Center */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {mode === 'ui' ? <UIEditorCanvas /> : <BlocklyWorkspace />}
        </div>

        {/* CraftOS-PC Panel */}
        {mode === 'ui' && useCraftOSPC && showCraftPC && (
          <PanelDiv resizeable={true}>
            <CraftPCPanel />
          </PanelDiv>
        )}

        {/* Elements Panel */}
        {mode === 'ui' && (
          <div className="w-52 border-l border-app-border bg-app-panel flex flex-col overflow-hidden">
            <ElementsPanel />
          </div>
        )}

        {/* Right Panel - Properties (UI mode only) */}
        {mode === 'ui' && <PropertiesPanel />}
      </div>

      <StatusBar />
    </div>
  );
};
