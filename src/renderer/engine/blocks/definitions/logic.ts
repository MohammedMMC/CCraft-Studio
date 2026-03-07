import { BlockDefinition } from '../../../models/Block';

export const logicBlocks: BlockDefinition[] = [
  {
    id: 'logic_compare',
    category: 'logic', type: 'boolean',
    label: '%1 %2 %3',
    inputs: [
      { name: 'a', type: 'any', label: 'a', defaultValue: 0 },
      { name: 'op', type: 'dropdown', label: 'operator', dropdownOptions: [
        { label: '=', value: '==' }, { label: '\u2260', value: '~=' },
        { label: '<', value: '<' }, { label: '>', value: '>' },
        { label: '\u2264', value: '<=' }, { label: '\u2265', value: '>=' },
      ]},
      { name: 'b', type: 'any', label: 'b', defaultValue: 0 },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const a = ctx.generateInput(block.inputValues.a, ctx);
      const op = ctx.generateInput(block.inputValues.op, ctx);
      const b = ctx.generateInput(block.inputValues.b, ctx);
      return `(${a} ${op} ${b})`;
    },
  },
  {
    id: 'logic_and',
    category: 'logic', type: 'boolean',
    label: '%1 and %2',
    inputs: [
      { name: 'a', type: 'boolean', label: 'a' },
      { name: 'b', type: 'boolean', label: 'b' },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `(${ctx.generateInput(block.inputValues.a, ctx)} and ${ctx.generateInput(block.inputValues.b, ctx)})`,
  },
  {
    id: 'logic_or',
    category: 'logic', type: 'boolean',
    label: '%1 or %2',
    inputs: [
      { name: 'a', type: 'boolean', label: 'a' },
      { name: 'b', type: 'boolean', label: 'b' },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `(${ctx.generateInput(block.inputValues.a, ctx)} or ${ctx.generateInput(block.inputValues.b, ctx)})`,
  },
  {
    id: 'logic_not',
    category: 'logic', type: 'boolean',
    label: 'not %1',
    inputs: [{ name: 'value', type: 'boolean', label: 'value' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `(not ${ctx.generateInput(block.inputValues.value, ctx)})`,
  },
  {
    id: 'logic_true',
    category: 'logic', type: 'boolean',
    label: 'true',
    inputs: [],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: () => 'true',
  },
  {
    id: 'logic_false',
    category: 'logic', type: 'boolean',
    label: 'false',
    inputs: [],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: () => 'false',
  },
  {
    id: 'logic_string',
    category: 'logic', type: 'expression',
    label: '"%1"',
    inputs: [{ name: 'value', type: 'string', label: 'text', defaultValue: '' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => ctx.generateInput(block.inputValues.value, ctx),
  },
];
