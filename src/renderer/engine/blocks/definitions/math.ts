import { BlockDefinition } from '../../../models/Block';

export const mathBlocks: BlockDefinition[] = [
  {
    id: 'math_arithmetic',
    category: 'math', type: 'expression',
    label: '%1 %2 %3',
    inputs: [
      { name: 'a', type: 'number', label: 'a', defaultValue: 0 },
      { name: 'op', type: 'dropdown', label: 'operator', dropdownOptions: [
        { label: '+', value: '+' }, { label: '-', value: '-' },
        { label: '*', value: '*' }, { label: '/', value: '/' },
        { label: '%', value: '%' }, { label: '^', value: '^' },
      ]},
      { name: 'b', type: 'number', label: 'b', defaultValue: 0 },
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
    id: 'math_floor',
    category: 'math', type: 'expression',
    label: 'floor %1',
    inputs: [{ name: 'n', type: 'number', label: 'number', defaultValue: 0 }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `math.floor(${ctx.generateInput(block.inputValues.n, ctx)})`,
  },
  {
    id: 'math_ceil',
    category: 'math', type: 'expression',
    label: 'ceil %1',
    inputs: [{ name: 'n', type: 'number', label: 'number', defaultValue: 0 }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `math.ceil(${ctx.generateInput(block.inputValues.n, ctx)})`,
  },
  {
    id: 'math_random',
    category: 'math', type: 'expression',
    label: 'random from %1 to %2',
    inputs: [
      { name: 'min', type: 'number', label: 'min', defaultValue: 1 },
      { name: 'max', type: 'number', label: 'max', defaultValue: 10 },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `math.random(${ctx.generateInput(block.inputValues.min, ctx)}, ${ctx.generateInput(block.inputValues.max, ctx)})`,
  },
  {
    id: 'math_min',
    category: 'math', type: 'expression',
    label: 'min of %1 and %2',
    inputs: [
      { name: 'a', type: 'number', label: 'a', defaultValue: 0 },
      { name: 'b', type: 'number', label: 'b', defaultValue: 0 },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `math.min(${ctx.generateInput(block.inputValues.a, ctx)}, ${ctx.generateInput(block.inputValues.b, ctx)})`,
  },
  {
    id: 'math_max',
    category: 'math', type: 'expression',
    label: 'max of %1 and %2',
    inputs: [
      { name: 'a', type: 'number', label: 'a', defaultValue: 0 },
      { name: 'b', type: 'number', label: 'b', defaultValue: 0 },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `math.max(${ctx.generateInput(block.inputValues.a, ctx)}, ${ctx.generateInput(block.inputValues.b, ctx)})`,
  },
  {
    id: 'math_abs',
    category: 'math', type: 'expression',
    label: 'abs %1',
    inputs: [{ name: 'n', type: 'number', label: 'number', defaultValue: 0 }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `math.abs(${ctx.generateInput(block.inputValues.n, ctx)})`,
  },
  {
    id: 'math_number',
    category: 'math', type: 'expression',
    label: '%1',
    inputs: [{ name: 'value', type: 'number', label: 'number', defaultValue: 0 }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => ctx.generateInput(block.inputValues.value, ctx),
  },
];
