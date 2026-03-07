import { BlockDefinition } from '../../../models/Block';

export const variableBlocks: BlockDefinition[] = [
  {
    id: 'var_set',
    category: 'variables',
    type: 'statement',
    label: 'set %1 to %2',
    inputs: [
      { name: 'name', type: 'variable', label: 'variable' },
      { name: 'value', type: 'any', label: 'value', defaultValue: 0 },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const name = ctx.generateInput(block.inputValues.name, ctx);
      const val = ctx.generateInput(block.inputValues.value, ctx);
      return `${ctx.getIndent()}${name} = ${val}`;
    },
  },
  {
    id: 'var_change',
    category: 'variables',
    type: 'statement',
    label: 'change %1 by %2',
    inputs: [
      { name: 'name', type: 'variable', label: 'variable' },
      { name: 'amount', type: 'number', label: 'amount', defaultValue: 1 },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const name = ctx.generateInput(block.inputValues.name, ctx);
      const amt = ctx.generateInput(block.inputValues.amount, ctx);
      return `${ctx.getIndent()}${name} = ${name} + ${amt}`;
    },
  },
  {
    id: 'var_get',
    category: 'variables',
    type: 'expression',
    label: '%1',
    inputs: [
      { name: 'name', type: 'variable', label: 'variable' },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => ctx.generateInput(block.inputValues.name, ctx),
  },
];
