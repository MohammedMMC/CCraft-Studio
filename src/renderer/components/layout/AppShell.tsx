import React, { useCallback, useRef, useState } from 'react';
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
  const previewWidth = useEditorStore((s) => s.previewWidth);
  const setPreviewWidth = useEditorStore((s) => s.setPreviewWidth);

  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = previewWidth;

    const onMove = (me: MouseEvent) => {
      const delta = startXRef.current - me.clientX;
      setPreviewWidth(startWidthRef.current + delta);
    };

    const onUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [previewWidth, setPreviewWidth]);

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
            <div className="flex flex-row h-full" style={{ width: previewWidth, minWidth: 200, maxWidth: 800 }}>
              {/* Resize handle */}
              <div
                className="w-1 cursor-col-resize hover:bg-ide-accent/40 active:bg-ide-accent/60 transition-colors flex-shrink-0"
                style={{ backgroundColor: isResizing ? 'rgba(137,180,250,0.5)' : undefined }}
                onMouseDown={handleResizeStart}
              />
              <div className="flex-1 border-l border-ide-border bg-ide-panel flex flex-col overflow-hidden">
                <TerminalPreview />
              </div>
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
