import { BlockDefinition } from '../../../models/Block';

export const stringBlocks: BlockDefinition[] = [
  {
    id: 'string_join',
    category: 'strings',
    type: 'expression',
    label: 'join %1 and %2',
    inputs: [
      { name: 'a', type: 'string', label: 'text', defaultValue: 'hello' },
      { name: 'b', type: 'string', label: 'text', defaultValue: ' world' },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const a = ctx.generateInput(block.inputValues.a, ctx);
      const b = ctx.generateInput(block.inputValues.b, ctx);
      return `(${a} .. ${b})`;
    },
  },
  {
    id: 'string_length',
    category: 'strings',
    type: 'expression',
    label: 'length of %1',
    inputs: [{ name: 'text', type: 'string', label: 'text', defaultValue: '' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const text = ctx.generateInput(block.inputValues.text, ctx);
      return `#${text}`;
    },
  },
  {
    id: 'string_sub',
    category: 'strings',
    type: 'expression',
    label: 'substring of %1 from %2 to %3',
    inputs: [
      { name: 'text', type: 'string', label: 'text', defaultValue: '' },
      { name: 'start', type: 'number', label: 'start', defaultValue: 1 },
      { name: 'end', type: 'number', label: 'end', defaultValue: 5 },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const text = ctx.generateInput(block.inputValues.text, ctx);
      const s = ctx.generateInput(block.inputValues.start, ctx);
      const e = ctx.generateInput(block.inputValues.end, ctx);
      return `string.sub(${text}, ${s}, ${e})`;
    },
  },
  {
    id: 'string_find',
    category: 'strings',
    type: 'expression',
    label: 'find %1 in %2',
    inputs: [
      { name: 'search', type: 'string', label: 'search', defaultValue: '' },
      { name: 'text', type: 'string', label: 'text', defaultValue: '' },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const search = ctx.generateInput(block.inputValues.search, ctx);
      const text = ctx.generateInput(block.inputValues.text, ctx);
      return `(string.find(${text}, ${search}) or 0)`;
    },
  },
  {
    id: 'string_format',
    category: 'strings',
    type: 'expression',
    label: 'to string %1',
    inputs: [{ name: 'value', type: 'any', label: 'value', defaultValue: 0 }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const val = ctx.generateInput(block.inputValues.value, ctx);
      return `tostring(${val})`;
    },
  },
  {
    id: 'string_tonumber',
    category: 'strings',
    type: 'expression',
    label: 'to number %1',
    inputs: [{ name: 'text', type: 'string', label: 'text', defaultValue: '0' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const text = ctx.generateInput(block.inputValues.text, ctx);
      return `(tonumber(${text}) or 0)`;
    },
  },
];
