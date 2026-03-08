import React, { useState, useCallback } from 'react';
import { useBlockStore } from '../../stores/blockStore';
import { useEditorStore } from '../../stores/editorStore';
import { BlockComponent } from './BlockComponent';

export const BlockEditorWorkspace: React.FC = () => {
  const topLevelBlocks = useBlockStore((s) => s.getTopLevelBlocks());
  const zoom = useEditorStore((s) => s.zoom);
  const panOffset = useEditorStore((s) => s.panOffset);
  const setPanOffset = useEditorStore((s) => s.setPanOffset);
  const selectBlock = useEditorStore((s) => s.selectBlock);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [isPanning, panStart, setPanOffset]
  );

  const handleMouseUp = () => setIsPanning(false);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      useEditorStore.getState().setZoom(zoom + delta);
    }
  };

  return (
    <div
      className="flex-1 overflow-hidden bg-ide-bg relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      style={{
        cursor: isPanning ? 'grabbing' : 'default',
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
      }}
    >
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        {topLevelBlocks.map((block) => (
          <BlockComponent key={block.id} blockId={block.id} isTopLevel />
        ))}

        {topLevelBlocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-ide-text-dim text-sm text-center">
              <div className="text-lg mb-2">Block Editor</div>
              <div className="text-xs">Click blocks from the palette to add them here</div>
              <div className="text-xs mt-1">Right-click a block to delete it</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
