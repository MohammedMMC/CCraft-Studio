import { BlockDefinition } from '../../../models/Block';

export const controlBlocks: BlockDefinition[] = [
  {
    id: 'control_if',
    category: 'control',
    type: 'statement',
    label: 'if %1 then',
    inputs: [{ name: 'condition', type: 'boolean', label: 'condition' }],
    canHaveNext: true,
    hasBranch: true,
    branchCount: 1,
    branchLabels: ['then'],
    luaGenerator: (block, ctx) => {
      const cond = ctx.generateInput(block.inputValues.condition, ctx);
      const body = ctx.generateChain(block.branchBlocks[0], { ...ctx, indent: ctx.indent + 1 });
      return `${ctx.getIndent()}if ${cond} then\n${body}\n${ctx.getIndent()}end`;
    },
  },
  {
    id: 'control_if_else',
    category: 'control',
    type: 'statement',
    label: 'if %1 then / else',
    inputs: [{ name: 'condition', type: 'boolean', label: 'condition' }],
    canHaveNext: true,
    hasBranch: true,
    branchCount: 2,
    branchLabels: ['then', 'else'],
    luaGenerator: (block, ctx) => {
      const cond = ctx.generateInput(block.inputValues.condition, ctx);
      const thenBody = ctx.generateChain(block.branchBlocks[0], { ...ctx, indent: ctx.indent + 1 });
      const elseBody = ctx.generateChain(block.branchBlocks[1], { ...ctx, indent: ctx.indent + 1 });
      return `${ctx.getIndent()}if ${cond} then\n${thenBody}\n${ctx.getIndent()}else\n${elseBody}\n${ctx.getIndent()}end`;
    },
  },
  {
    id: 'control_while',
    category: 'control',
    type: 'statement',
    label: 'while %1 do',
    inputs: [{ name: 'condition', type: 'boolean', label: 'condition', defaultValue: true }],
    canHaveNext: true,
    hasBranch: true,
    branchCount: 1,
    branchLabels: ['do'],
    luaGenerator: (block, ctx) => {
      const cond = ctx.generateInput(block.inputValues.condition, ctx);
      const body = ctx.generateChain(block.branchBlocks[0], { ...ctx, indent: ctx.indent + 1 });
      return `${ctx.getIndent()}while ${cond} do\n${body}\n${ctx.getIndent()}end`;
    },
  },
  {
    id: 'control_for',
    category: 'control',
    type: 'statement',
    label: 'for %1 = %2 to %3',
    inputs: [
      { name: 'var', type: 'string', label: 'variable', defaultValue: 'i' },
      { name: 'start', type: 'number', label: 'start', defaultValue: 1 },
      { name: 'end', type: 'number', label: 'end', defaultValue: 10 },
    ],
    canHaveNext: true,
    hasBranch: true,
    branchCount: 1,
    branchLabels: ['do'],
    luaGenerator: (block, ctx) => {
      const v = ctx.generateInput(block.inputValues.var, ctx);
      const s = ctx.generateInput(block.inputValues.start, ctx);
      const e = ctx.generateInput(block.inputValues.end, ctx);
      const body = ctx.generateChain(block.branchBlocks[0], { ...ctx, indent: ctx.indent + 1 });
      return `${ctx.getIndent()}for ${v} = ${s}, ${e} do\n${body}\n${ctx.getIndent()}end`;
    },
  },
  {
    id: 'control_repeat',
    category: 'control',
    type: 'statement',
    label: 'repeat %1 times',
    inputs: [{ name: 'count', type: 'number', label: 'count', defaultValue: 10 }],
    canHaveNext: true,
    hasBranch: true,
    branchCount: 1,
    branchLabels: ['do'],
    luaGenerator: (block, ctx) => {
      const count = ctx.generateInput(block.inputValues.count, ctx);
      const body = ctx.generateChain(block.branchBlocks[0], { ...ctx, indent: ctx.indent + 1 });
      return `${ctx.getIndent()}for _i = 1, ${count} do\n${body}\n${ctx.getIndent()}end`;
    },
  },
  {
    id: 'control_wait',
    category: 'control',
    type: 'statement',
    label: 'wait %1 seconds',
    inputs: [{ name: 'seconds', type: 'number', label: 'seconds', defaultValue: 1 }],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    luaGenerator: (block, ctx) => {
      const secs = ctx.generateInput(block.inputValues.seconds, ctx);
      return `${ctx.getIndent()}sleep(${secs})`;
    },
  },
  {
    id: 'control_break',
    category: 'control',
    type: 'cap',
    label: 'break',
    inputs: [],
    canHaveNext: false,
    hasBranch: false,
    branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}break`,
  },
];
