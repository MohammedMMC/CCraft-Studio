import { BlockDefinition } from '../../../models/Block';

export const uiActionBlocks: BlockDefinition[] = [
  {
    id: 'ui_set_text',
    category: 'uiActions',
    type: 'statement',
    label: 'set %1 text to %2',
    inputs: [
      { name: 'element', type: 'dropdown', label: 'element', dropdownOptions: [] },
      { name: 'text', type: 'string', label: 'text', defaultValue: 'Hello' },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const el = ctx.generateInput(block.inputValues.element, ctx);
      const text = ctx.generateInput(block.inputValues.text, ctx);
      return `${ctx.getIndent()}getElement(${el}).text = ${text}\n${ctx.getIndent()}refreshScreen()`;
    },
  },
  {
    id: 'ui_set_color',
    category: 'uiActions',
    type: 'statement',
    label: 'set %1 %2 color to %3',
    inputs: [
      { name: 'element', type: 'dropdown', label: 'element', dropdownOptions: [] },
      { name: 'prop', type: 'dropdown', label: 'property', dropdownOptions: [
        { label: 'background', value: 'bgColor' },
        { label: 'foreground', value: 'fgColor' },
      ]},
      { name: 'color', type: 'color', label: 'color' },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const el = ctx.generateInput(block.inputValues.element, ctx);
      const prop = ctx.generateInput(block.inputValues.prop, ctx);
      const color = ctx.generateInput(block.inputValues.color, ctx);
      return `${ctx.getIndent()}getElement(${el}).${prop} = ${color}\n${ctx.getIndent()}refreshScreen()`;
    },
  },
  {
    id: 'ui_show_element',
    category: 'uiActions',
    type: 'statement',
    label: 'show %1',
    inputs: [
      { name: 'element', type: 'dropdown', label: 'element', dropdownOptions: [] },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const el = ctx.generateInput(block.inputValues.element, ctx);
      return `${ctx.getIndent()}getElement(${el}).visible = true\n${ctx.getIndent()}refreshScreen()`;
    },
  },
  {
    id: 'ui_hide_element',
    category: 'uiActions',
    type: 'statement',
    label: 'hide %1',
    inputs: [
      { name: 'element', type: 'dropdown', label: 'element', dropdownOptions: [] },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const el = ctx.generateInput(block.inputValues.element, ctx);
      return `${ctx.getIndent()}getElement(${el}).visible = false\n${ctx.getIndent()}refreshScreen()`;
    },
  },
  {
    id: 'ui_navigate',
    category: 'uiActions',
    type: 'statement',
    label: 'navigate to screen %1',
    inputs: [
      { name: 'screen', type: 'dropdown', label: 'screen', dropdownOptions: [] },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const screen = ctx.generateInput(block.inputValues.screen, ctx);
      return `${ctx.getIndent()}navigate(${screen})`;
    },
  },
  {
    id: 'ui_set_progress',
    category: 'uiActions',
    type: 'statement',
    label: 'set %1 progress to %2',
    inputs: [
      { name: 'element', type: 'dropdown', label: 'element', dropdownOptions: [] },
      { name: 'value', type: 'number', label: 'value', defaultValue: 50 },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const el = ctx.generateInput(block.inputValues.element, ctx);
      const val = ctx.generateInput(block.inputValues.value, ctx);
      return `${ctx.getIndent()}getElement(${el}).value = ${val}\n${ctx.getIndent()}refreshScreen()`;
    },
  },
  {
    id: 'ui_clear_screen',
    category: 'uiActions',
    type: 'statement',
    label: 'clear screen',
    inputs: [],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => {
      return `${ctx.getIndent()}term.clear()\n${ctx.getIndent()}term.setCursorPos(1, 1)`;
    },
  },
  {
    id: 'ui_write_at',
    category: 'uiActions',
    type: 'statement',
    label: 'write %1 at x:%2 y:%3',
    inputs: [
      { name: 'text', type: 'string', label: 'text', defaultValue: 'Hello' },
      { name: 'x', type: 'number', label: 'x', defaultValue: 1 },
      { name: 'y', type: 'number', label: 'y', defaultValue: 1 },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const text = ctx.generateInput(block.inputValues.text, ctx);
      const x = ctx.generateInput(block.inputValues.x, ctx);
      const y = ctx.generateInput(block.inputValues.y, ctx);
      return `${ctx.getIndent()}term.setCursorPos(${x}, ${y})\n${ctx.getIndent()}term.write(${text})`;
    },
  },
];
