import React, { useState } from 'react';
import { BlockCategory, BLOCK_CATEGORY_META, BlockDefinition, createBlockInstance } from '../../models/Block';
import { BlockRegistry } from '../../engine/blocks/BlockRegistry';
import { useBlockStore } from '../../stores/blockStore';

const CATEGORIES: BlockCategory[] = [
  'events', 'control', 'uiActions', 'variables', 'strings',
  'tables', 'ccApi', 'math', 'logic', 'functions',
];

export const BlockPalette: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BlockCategory>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const addBlock = useBlockStore((s) => s.addBlock);

  const blocks = searchQuery
    ? BlockRegistry.search(searchQuery)
    : BlockRegistry.getByCategory(activeCategory);

  const handleAddBlock = (def: BlockDefinition) => {
    const instance = createBlockInstance(def.id, def);
    instance.position = { x: 200 + Math.random() * 100, y: 100 + Math.random() * 100 };
    addBlock(instance);
  };

  return (
    <div className="w-52 bg-app-panel border-r border-app-border flex flex-col h-full">
      <div className="panel-header">Blocks</div>

      {/* Search */}
      <div className="px-2 py-2">
        <input
          className="input-field text-xs"
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="px-2 pb-1 flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => {
            const meta = BLOCK_CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] px-1.5 py-0.5 rounded transition-all ${
                  activeCategory === cat
                    ? 'text-white font-medium'
                    : 'text-app-text-dim hover:text-app-text bg-app-bg'
                }`}
                style={activeCategory === cat ? { backgroundColor: meta.color } : {}}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Block List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {blocks.map((def) => {
          const meta = BLOCK_CATEGORY_META[def.category];
          return (
            <button
              key={def.id}
              onClick={() => handleAddBlock(def)}
              className="w-full text-left p-2 rounded text-xs text-white transition-all
                         hover:brightness-110 active:brightness-90"
              style={{ backgroundColor: meta.color }}
              title={def.tooltip}
            >
              <div className="font-medium">{formatBlockLabel(def.label)}</div>
              {def.tooltip && (
                <div className="text-[10px] opacity-70 mt-0.5">{def.tooltip}</div>
              )}
              <div className="flex gap-1 mt-1">
                <span className="text-[9px] opacity-60 bg-black/20 px-1 rounded">
                  {def.type}
                </span>
              </div>
            </button>
          );
        })}
        {blocks.length === 0 && (
          <div className="text-xs text-app-text-dim text-center py-4">
            {searchQuery ? 'No blocks found' : 'No blocks in this category'}
          </div>
        )}
      </div>
    </div>
  );
};

function formatBlockLabel(label: string): string {
  return label.replace(/%\d+/g, '___');
}
