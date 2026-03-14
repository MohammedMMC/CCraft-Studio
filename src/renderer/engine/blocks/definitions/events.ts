import { BlockDefinition } from '../../../models/Block';

export const eventBlocks: BlockDefinition[] = [
  {
    id: 'event_screen_load',
    category: 'events',
    type: 'hat',
    label: 'When screen loads',
    inputs: [],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    tooltip: 'Runs when this screen is displayed',
    luaGenerator: (_block, ctx) => {
      return `${ctx.getIndent()}-- When screen loads`;
    },
  },
  {
    id: 'event_button_click',
    category: 'events',
    type: 'hat',
    label: 'When %1 is clicked',
    inputs: [
      { name: 'button', type: 'dropdown', label: 'button', dropdownOptions: [] },
    ],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    tooltip: 'Runs when a button element is clicked',
    luaGenerator: (block, ctx) => {
      const btn = ctx.generateInput(block.inputValues.button, ctx);
      return `${ctx.getIndent()}-- When ${btn} is clicked`;
    },
  },
  {
    id: 'event_button_focus',
    category: 'events',
    type: 'hat',
    label: 'While %1 is focused',
    inputs: [
      { name: 'button', type: 'dropdown', label: 'button', dropdownOptions: [] },
    ],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    tooltip: 'Runs while a button is held down (focused)',
    luaGenerator: (block, ctx) => {
      const btn = ctx.generateInput(block.inputValues.button, ctx);
      return `${ctx.getIndent()}-- While ${btn} is focused`;
    },
  },
  {
    id: 'event_button_release',
    category: 'events',
    type: 'hat',
    label: 'When %1 is released',
    inputs: [
      { name: 'button', type: 'dropdown', label: 'button', dropdownOptions: [] },
    ],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    tooltip: 'Runs when a button is released after being clicked',
    luaGenerator: (block, ctx) => {
      const btn = ctx.generateInput(block.inputValues.button, ctx);
      return `${ctx.getIndent()}-- When ${btn} is released`;
    },
  },
  {
    id: 'event_key_press',
    category: 'events',
    type: 'hat',
    label: 'When key %1 is pressed',
    inputs: [
      { name: 'key', type: 'string', label: 'key', defaultValue: 'enter' },
    ],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    tooltip: 'Runs when a keyboard key is pressed',
    luaGenerator: (block, ctx) => {
      const key = ctx.generateInput(block.inputValues.key, ctx);
      return `${ctx.getIndent()}-- When key ${key} is pressed`;
    },
  },
  {
    id: 'event_timer',
    category: 'events',
    type: 'hat',
    label: 'Every %1 seconds',
    inputs: [
      { name: 'interval', type: 'number', label: 'seconds', defaultValue: 1 },
    ],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    tooltip: 'Runs repeatedly at a timed interval',
    luaGenerator: (block, ctx) => {
      const interval = ctx.generateInput(block.inputValues.interval, ctx);
      return `${ctx.getIndent()}-- Every ${interval} seconds`;
    },
  },
  {
    id: 'event_redstone',
    category: 'events',
    type: 'hat',
    label: 'When redstone input changes',
    inputs: [],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    tooltip: 'Runs when a redstone signal changes',
    luaGenerator: (_block, ctx) => {
      return `${ctx.getIndent()}-- When redstone changes`;
    },
  },
  {
    id: 'event_modem_message',
    category: 'events',
    type: 'hat',
    label: 'When modem message received on channel %1',
    inputs: [
      { name: 'channel', type: 'number', label: 'channel', defaultValue: 1 },
    ],
    canHaveNext: true,
    hasBranch: false,
    branchCount: 0,
    tooltip: 'Runs when a modem message is received',
    luaGenerator: (block, ctx) => {
      const ch = ctx.generateInput(block.inputValues.channel, ctx);
      return `${ctx.getIndent()}-- When modem message on channel ${ch}`;
    },
  },
];
