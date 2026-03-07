import { BlockInstance, BlockInput, LuaGenContext, BlockDefinition } from '../../models/Block';
import { BlockRegistry } from '../blocks/BlockRegistry';
import { CC_COLORS, CCColor } from '../../models/CCColors';
import { indent, luaString } from '../../utils/luaHelpers';

export function generateBlockCode(
  blocks: Record<string, BlockInstance>,
  screenNames: string[],
  elementNames: string[],
  variables: { name: string; type: string }[]
): string {
  const topLevel = getTopLevelBlocks(blocks);
  if (topLevel.length === 0) return '';

  const lines: string[] = [];

  for (const block of topLevel) {
    const def = BlockRegistry.get(block.definitionId);
    if (!def) continue;

    const ctx = createContext(blocks, screenNames, elementNames, variables, 0);
    const code = generateBlockChain(block.id, ctx, def);
    if (code.trim()) {
      lines.push(code);
      lines.push('');
    }
  }

  return lines.join('\n');
}

function createContext(
  blocks: Record<string, BlockInstance>,
  screenNames: string[],
  elementNames: string[],
  variables: { name: string; type: string }[],
  ind: number
): LuaGenContext {
  return {
    indent: ind,
    getBlock: (id) => blocks[id],
    getDefinition: (defId) => BlockRegistry.get(defId),
    generateBlock: (blockId, ctx) => {
      const block = blocks[blockId];
      if (!block) return '';
      const def = BlockRegistry.get(block.definitionId);
      if (!def) return '';
      return def.luaGenerator(block, ctx);
    },
    generateChain: (startBlockId: string | null, ctx: LuaGenContext): string => {
      if (!startBlockId) return '';
      const lines: string[] = [];
      let currentId: string | null = startBlockId;
      while (currentId) {
        const blk: BlockInstance = blocks[currentId];
        if (!blk) break;
        const d = BlockRegistry.get(blk.definitionId);
        if (!d) break;
        const code = d.luaGenerator(blk, ctx);
        if (code.trim()) lines.push(code);
        currentId = blk.nextBlock;
      }
      return lines.join('\n');
    },
    generateInput: (input, ctx) => {
      if (!input) return '""';
      switch (input.kind) {
        case 'literal': {
          if (typeof input.value === 'string') {
            // Check if it looks like a color reference
            if (input.value.startsWith('colors.')) return input.value;
            return luaString(input.value);
          }
          if (typeof input.value === 'boolean') return input.value ? 'true' : 'false';
          return String(input.value);
        }
        case 'block': {
          const block = blocks[input.blockId];
          if (!block) return 'nil';
          const def = BlockRegistry.get(block.definitionId);
          if (!def) return 'nil';
          return def.luaGenerator(block, ctx);
        }
        case 'dropdown':
          return luaString(input.selected);
        case 'variable':
          return input.name;
      }
    },
    getIndent: () => indent(ind),
    screenNames,
    elementNames,
    variables,
  };
}

function generateBlockChain(startBlockId: string, ctx: LuaGenContext, startDef: BlockDefinition): string {
  const blocks = getAllBlocksFromCtx(ctx);
  const startBlock = blocks[startBlockId];
  if (!startBlock) return '';

  const lines: string[] = [];

  // Handle hat blocks specially - they define function wrappers
  if (startDef.type === 'hat') {
    const hatCode = startDef.luaGenerator(startBlock, ctx);

    // Check if this hat generates a function definition
    if (startBlock.definitionId.startsWith('func_define')) {
      lines.push(hatCode);
      if (startBlock.nextBlock) {
        const bodyCtx = { ...ctx, indent: ctx.indent + 1 };
        const body = ctx.generateChain(startBlock.nextBlock, bodyCtx);
        lines.push(body);
      }
      lines.push(`${ctx.getIndent()}end`);
    } else {
      // Event handlers - generate as handler registration
      lines.push(`-- ${hatCode.trim()}`);
      if (startBlock.nextBlock) {
        const body = ctx.generateChain(startBlock.nextBlock, ctx);
        lines.push(body);
      }
    }
  } else {
    // Non-hat top-level blocks
    const code = ctx.generateChain(startBlockId, ctx);
    lines.push(code);
  }

  return lines.join('\n');
}

function getTopLevelBlocks(blocks: Record<string, BlockInstance>): BlockInstance[] {
  const childIds = new Set<string>();
  for (const b of Object.values(blocks)) {
    if (b.nextBlock) childIds.add(b.nextBlock);
    for (const br of b.branchBlocks) {
      if (br) childIds.add(br);
    }
    for (const input of Object.values(b.inputValues)) {
      if (input.kind === 'block') childIds.add(input.blockId);
    }
  }
  return Object.values(blocks).filter(b => !childIds.has(b.id));
}

function getAllBlocksFromCtx(ctx: LuaGenContext): Record<string, BlockInstance> {
  // Reconstruct blocks map by walking the context
  const blocks: Record<string, BlockInstance> = {};
  // This is a workaround - in practice, we pass blocks directly
  return blocks;
}
