import { BlockDefinition } from '../../../models/Block';

export const tableBlocks: BlockDefinition[] = [
  {
    id: 'table_create',
    category: 'tables',
    type: 'statement',
    label: 'set %1 to new list',
    inputs: [{ name: 'name', type: 'variable', label: 'variable' }],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const name = ctx.generateInput(block.inputValues.name, ctx);
      return `${ctx.getIndent()}${name} = {}`;
    },
  },
  {
    id: 'table_insert',
    category: 'tables',
    type: 'statement',
    label: 'add %1 to %2',
    inputs: [
      { name: 'value', type: 'any', label: 'value', defaultValue: '' },
      { name: 'table', type: 'variable', label: 'list' },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const val = ctx.generateInput(block.inputValues.value, ctx);
      const tbl = ctx.generateInput(block.inputValues.table, ctx);
      return `${ctx.getIndent()}table.insert(${tbl}, ${val})`;
    },
  },
  {
    id: 'table_remove',
    category: 'tables',
    type: 'statement',
    label: 'remove item %1 from %2',
    inputs: [
      { name: 'index', type: 'number', label: 'index', defaultValue: 1 },
      { name: 'table', type: 'variable', label: 'list' },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const idx = ctx.generateInput(block.inputValues.index, ctx);
      const tbl = ctx.generateInput(block.inputValues.table, ctx);
      return `${ctx.getIndent()}table.remove(${tbl}, ${idx})`;
    },
  },
  {
    id: 'table_get',
    category: 'tables',
    type: 'expression',
    label: 'item %1 of %2',
    inputs: [
      { name: 'index', type: 'number', label: 'index', defaultValue: 1 },
      { name: 'table', type: 'variable', label: 'list' },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const idx = ctx.generateInput(block.inputValues.index, ctx);
      const tbl = ctx.generateInput(block.inputValues.table, ctx);
      return `${tbl}[${idx}]`;
    },
  },
  {
    id: 'table_set',
    category: 'tables',
    type: 'statement',
    label: 'set item %1 of %2 to %3',
    inputs: [
      { name: 'index', type: 'number', label: 'index', defaultValue: 1 },
      { name: 'table', type: 'variable', label: 'list' },
      { name: 'value', type: 'any', label: 'value', defaultValue: '' },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const idx = ctx.generateInput(block.inputValues.index, ctx);
      const tbl = ctx.generateInput(block.inputValues.table, ctx);
      const val = ctx.generateInput(block.inputValues.value, ctx);
      return `${ctx.getIndent()}${tbl}[${idx}] = ${val}`;
    },
  },
  {
    id: 'table_length',
    category: 'tables',
    type: 'expression',
    label: 'length of %1',
    inputs: [{ name: 'table', type: 'variable', label: 'list' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const tbl = ctx.generateInput(block.inputValues.table, ctx);
      return `#${tbl}`;
    },
  },
  {
    id: 'table_foreach',
    category: 'tables',
    type: 'statement',
    label: 'for each %1 in %2',
    inputs: [
      { name: 'var', type: 'string', label: 'variable', defaultValue: 'item' },
      { name: 'table', type: 'variable', label: 'list' },
    ],
    canHaveNext: true, hasBranch: true, branchCount: 1,
    branchLabels: ['do'],
    luaGenerator: (block, ctx) => {
      const v = ctx.generateInput(block.inputValues.var, ctx);
      const tbl = ctx.generateInput(block.inputValues.table, ctx);
      const body = ctx.generateChain(block.branchBlocks[0], { ...ctx, indent: ctx.indent + 1 });
      return `${ctx.getIndent()}for _, ${v} in ipairs(${tbl}) do\n${body}\n${ctx.getIndent()}end`;
    },
  },
];
