import React, { useState } from 'react';
import { BlockInstance, BlockInput, BLOCK_CATEGORY_META, BlockDefinition } from '../../models/Block';
import { BlockRegistry } from '../../engine/blocks/BlockRegistry';
import { useBlockStore } from '../../stores/blockStore';
import { useEditorStore } from '../../stores/editorStore';
import { CC_COLORS, CC_COLOR_NAMES, CCColor } from '../../models/CCColors';

interface BlockComponentProps {
  blockId: string;
  isTopLevel?: boolean;
}

export const BlockComponent: React.FC<BlockComponentProps> = ({ blockId, isTopLevel = false }) => {
  const block = useBlockStore((s) => s.blocks[blockId]);
  const updateInput = useBlockStore((s) => s.updateBlockInput);
  const removeBlock = useBlockStore((s) => s.removeBlock);
  const moveBlock = useBlockStore((s) => s.moveBlock);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);

  const [isDragging, setIsDragging] = useState(false);

  if (!block) return null;

  const def = BlockRegistry.get(block.definitionId);
  if (!def) return null;

  const meta = BLOCK_CATEGORY_META[def.category];
  const isSelected = selectedBlockId === blockId;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTopLevel && !block.position) return;
    e.stopPropagation();
    selectBlock(blockId);
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = block.position?.x ?? 0;
    const origY = block.position?.y ?? 0;

    const handleMove = (me: MouseEvent) => {
      const zoom = useEditorStore.getState().zoom;
      const dx = (me.clientX - startX) / zoom;
      const dy = (me.clientY - startY) / zoom;
      moveBlock(blockId, origX + dx, origY + dy);
    };

    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeBlock(blockId);
  };

  // Build the label with input slots
  const renderLabel = () => {
    const parts = def.label.split(/(%\d+)/g);
    return parts.map((part, i) => {
      const match = part.match(/%(\d+)/);
      if (match) {
        const inputIdx = parseInt(match[1]) - 1;
        const inputDef = def.inputs[inputIdx];
        if (!inputDef) return null;
        const inputValue = block.inputValues[inputDef.name];
        return (
          <InlineInput
            key={i}
            inputDef={inputDef}
            value={inputValue}
            onChange={(v) => updateInput(blockId, inputDef.name, v)}
          />
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const blockStyle: React.CSSProperties = {
    backgroundColor: meta.color,
    ...(isTopLevel && block.position ? { left: block.position.x, top: block.position.y, position: 'absolute' } : {}),
  };

  // Block shape classes
  const shapeClass = def.type === 'hat'
    ? 'rounded-t-lg'
    : def.type === 'cap'
      ? 'rounded-b-lg'
      : def.type === 'expression'
        ? 'rounded-full'
        : def.type === 'boolean'
          ? 'clip-diamond'
          : '';

  return (
    <div
      style={blockStyle}
      className={`inline-block select-none ${isDragging ? 'opacity-80' : ''}`}
    >
      {/* Main block body */}
      <div
        className={`flex items-center gap-1 px-3 py-1.5 text-xs text-white cursor-grab ${shapeClass}
                    ${isSelected ? 'ring-2 ring-white/50' : ''}`}
        onMouseDown={handleMouseDown}
        onClick={(e) => { e.stopPropagation(); selectBlock(blockId); }}
        onContextMenu={handleContextMenu}
        style={{ minHeight: 28 }}
      >
        {renderLabel()}
      </div>

      {/* Branch bodies */}
      {def.hasBranch && block.branchBlocks.map((branchBlockId, branchIdx) => (
        <div key={branchIdx}>
          {def.branchLabels?.[branchIdx] && branchIdx > 0 && (
            <div
              className="px-3 py-1 text-[10px] text-white/80 font-medium"
              style={{ backgroundColor: meta.color }}
            >
              {def.branchLabels[branchIdx]}
            </div>
          )}
          <div className="ml-4 border-l-4 min-h-[24px] py-1 pl-2" style={{ borderColor: meta.color }}>
            {branchBlockId && <BlockChain startBlockId={branchBlockId} />}
            {!branchBlockId && (
              <div className="text-[10px] text-ide-text-dim italic px-2 py-1">empty</div>
            )}
          </div>
        </div>
      ))}

      {/* Bottom cap for branch blocks */}
      {def.hasBranch && (
        <div className="h-1.5 rounded-b" style={{ backgroundColor: meta.color }} />
      )}

      {/* Next block */}
      {block.nextBlock && (
        <BlockComponent blockId={block.nextBlock} />
      )}
    </div>
  );
};

// Renders a chain of connected blocks
export const BlockChain: React.FC<{ startBlockId: string }> = ({ startBlockId }) => {
  return <BlockComponent blockId={startBlockId} />;
};

// Inline input field within a block
interface InlineInputProps {
  inputDef: { name: string; type: string; label?: string; dropdownOptions?: { label: string; value: string }[] };
  value: BlockInput | undefined;
  onChange: (value: BlockInput) => void;
}

const InlineInput: React.FC<InlineInputProps> = ({ inputDef, value, onChange }) => {
  const currentValue = value?.kind === 'literal' ? value.value : value?.kind === 'dropdown' ? value.selected : value?.kind === 'variable' ? value.name : '';

  if (inputDef.type === 'dropdown' && inputDef.dropdownOptions) {
    return (
      <select
        className="bg-black/30 text-white text-[11px] rounded px-1 py-0.5 outline-none border-none mx-0.5"
        value={String(currentValue)}
        onChange={(e) => onChange({ kind: 'dropdown', selected: e.target.value })}
        onClick={(e) => e.stopPropagation()}
      >
        {inputDef.dropdownOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  if (inputDef.type === 'color') {
    return (
      <select
        className="bg-black/30 text-white text-[11px] rounded px-1 py-0.5 outline-none border-none mx-0.5"
        value={String(currentValue)}
        onChange={(e) => onChange({ kind: 'literal', value: e.target.value })}
        onClick={(e) => e.stopPropagation()}
      >
        {CC_COLOR_NAMES.map((c) => (
          <option key={c} value={CC_COLORS[c].luaName}>{c}</option>
        ))}
      </select>
    );
  }

  if (inputDef.type === 'boolean') {
    return (
      <select
        className="bg-black/30 text-white text-[11px] rounded px-1 py-0.5 outline-none border-none mx-0.5"
        value={String(currentValue)}
        onChange={(e) => onChange({ kind: 'literal', value: e.target.value === 'true' })}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  if (inputDef.type === 'number') {
    return (
      <input
        type="number"
        className="bg-black/30 text-white text-[11px] rounded px-1 py-0.5 outline-none border-none w-12 mx-0.5"
        value={String(currentValue)}
        onChange={(e) => onChange({ kind: 'literal', value: parseFloat(e.target.value) || 0 })}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  if (inputDef.type === 'variable') {
    return (
      <input
        className="bg-black/30 text-white text-[11px] rounded px-1 py-0.5 outline-none border-none w-16 mx-0.5 italic"
        value={String(value?.kind === 'variable' ? value.name : currentValue)}
        onChange={(e) => onChange({ kind: 'variable', name: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="var"
      />
    );
  }

  // String or any
  return (
    <input
      className="bg-black/30 text-white text-[11px] rounded px-1.5 py-0.5 outline-none border-none min-w-[40px] w-auto mx-0.5"
      value={String(currentValue)}
      onChange={(e) => onChange({ kind: 'literal', value: e.target.value })}
      onClick={(e) => e.stopPropagation()}
      placeholder={inputDef.label}
      style={{ width: `${Math.max(40, String(currentValue).length * 7 + 16)}px` }}
    />
  );
};
