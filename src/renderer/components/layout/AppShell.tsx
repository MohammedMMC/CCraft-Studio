import React from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { Toolbar } from './Toolbar';
import { TabBar } from './TabBar';
import { StatusBar } from './StatusBar';
import { UIEditorCanvas } from '../uiEditor/UIEditorCanvas';
import { ElementToolkit } from '../uiEditor/ElementToolkit';
import { PropertiesPanel } from '../uiEditor/PropertiesPanel';
import { BlocklyWorkspace } from '../blockEditor/BlocklyWorkspace';
import { TerminalPreview } from '../terminal/TerminalPreview';

interface AppShellProps {
  onExport: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ onExport }) => {
  const mode = useEditorStore((s) => s.mode);
  const showPreview = useEditorStore((s) => s.showPreview);

  return (
    <div className="flex flex-col w-full h-full">
      <Toolbar onExport={onExport} />
      <TabBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - only in UI mode (Blockly has its own toolbox) */}
        {mode === 'ui' && <ElementToolkit />}

        {/* Center */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {mode === 'ui' ? <UIEditorCanvas /> : <BlocklyWorkspace />}
          </div>

          {/* Terminal Preview */}
          {showPreview && (
            <div className="w-80 border-l border-ide-border bg-ide-panel flex flex-col">
              <TerminalPreview />
            </div>
          )}
        </div>

        {/* Right Panel - Properties (UI mode only) */}
        {mode === 'ui' && <PropertiesPanel />}
      </div>

      <StatusBar />
    </div>
  );
};
