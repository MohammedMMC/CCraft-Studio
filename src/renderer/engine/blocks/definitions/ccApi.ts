import { BlockDefinition } from '../../../models/Block';

export const ccApiBlocks: BlockDefinition[] = [
  // Term API
  {
    id: 'cc_term_write',
    category: 'ccApi', type: 'statement',
    label: 'term.write %1',
    inputs: [{ name: 'text', type: 'string', label: 'text', defaultValue: '' }],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `${ctx.getIndent()}term.write(${ctx.generateInput(block.inputValues.text, ctx)})`,
  },
  {
    id: 'cc_term_setCursorPos',
    category: 'ccApi', type: 'statement',
    label: 'set cursor to x:%1 y:%2',
    inputs: [
      { name: 'x', type: 'number', label: 'x', defaultValue: 1 },
      { name: 'y', type: 'number', label: 'y', defaultValue: 1 },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `${ctx.getIndent()}term.setCursorPos(${ctx.generateInput(block.inputValues.x, ctx)}, ${ctx.generateInput(block.inputValues.y, ctx)})`,
  },
  {
    id: 'cc_term_setTextColor',
    category: 'ccApi', type: 'statement',
    label: 'set text color to %1',
    inputs: [{ name: 'color', type: 'color', label: 'color' }],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `${ctx.getIndent()}term.setTextColor(${ctx.generateInput(block.inputValues.color, ctx)})`,
  },
  {
    id: 'cc_term_setBgColor',
    category: 'ccApi', type: 'statement',
    label: 'set background color to %1',
    inputs: [{ name: 'color', type: 'color', label: 'color' }],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `${ctx.getIndent()}term.setBackgroundColor(${ctx.generateInput(block.inputValues.color, ctx)})`,
  },
  {
    id: 'cc_term_clear',
    category: 'ccApi', type: 'statement',
    label: 'clear terminal',
    inputs: [],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}term.clear()`,
  },
  {
    id: 'cc_term_scroll',
    category: 'ccApi', type: 'statement',
    label: 'scroll %1 lines',
    inputs: [{ name: 'n', type: 'number', label: 'lines', defaultValue: 1 }],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `${ctx.getIndent()}term.scroll(${ctx.generateInput(block.inputValues.n, ctx)})`,
  },

  // Peripheral API
  {
    id: 'cc_peripheral_find',
    category: 'ccApi', type: 'expression',
    label: 'find peripheral %1',
    inputs: [{ name: 'type', type: 'string', label: 'type', defaultValue: 'monitor' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `peripheral.find(${ctx.generateInput(block.inputValues.type, ctx)})`,
  },
  {
    id: 'cc_peripheral_wrap',
    category: 'ccApi', type: 'expression',
    label: 'wrap peripheral %1',
    inputs: [{ name: 'side', type: 'dropdown', label: 'side', dropdownOptions: [
      { label: 'left', value: 'left' }, { label: 'right', value: 'right' },
      { label: 'top', value: 'top' }, { label: 'bottom', value: 'bottom' },
      { label: 'front', value: 'front' }, { label: 'back', value: 'back' },
    ]}],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `peripheral.wrap(${ctx.generateInput(block.inputValues.side, ctx)})`,
  },

  // Redstone API
  {
    id: 'cc_rs_getInput',
    category: 'ccApi', type: 'expression',
    label: 'redstone input on %1',
    inputs: [{ name: 'side', type: 'dropdown', label: 'side', dropdownOptions: [
      { label: 'left', value: 'left' }, { label: 'right', value: 'right' },
      { label: 'top', value: 'top' }, { label: 'bottom', value: 'bottom' },
      { label: 'front', value: 'front' }, { label: 'back', value: 'back' },
    ]}],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `redstone.getInput(${ctx.generateInput(block.inputValues.side, ctx)})`,
  },
  {
    id: 'cc_rs_setOutput',
    category: 'ccApi', type: 'statement',
    label: 'set redstone output %1 to %2',
    inputs: [
      { name: 'side', type: 'dropdown', label: 'side', dropdownOptions: [
        { label: 'left', value: 'left' }, { label: 'right', value: 'right' },
        { label: 'top', value: 'top' }, { label: 'bottom', value: 'bottom' },
        { label: 'front', value: 'front' }, { label: 'back', value: 'back' },
      ]},
      { name: 'value', type: 'boolean', label: 'value', defaultValue: true },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `${ctx.getIndent()}redstone.setOutput(${ctx.generateInput(block.inputValues.side, ctx)}, ${ctx.generateInput(block.inputValues.value, ctx)})`,
  },

  // FS API
  {
    id: 'cc_fs_read',
    category: 'ccApi', type: 'expression',
    label: 'read file %1',
    inputs: [{ name: 'path', type: 'string', label: 'path', defaultValue: 'data.txt' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const p = ctx.generateInput(block.inputValues.path, ctx);
      return `(function() local f = fs.open(${p}, "r") if f then local d = f.readAll() f.close() return d end return "" end)()`;
    },
  },
  {
    id: 'cc_fs_write',
    category: 'ccApi', type: 'statement',
    label: 'write %1 to file %2',
    inputs: [
      { name: 'content', type: 'string', label: 'content', defaultValue: '' },
      { name: 'path', type: 'string', label: 'path', defaultValue: 'data.txt' },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const content = ctx.generateInput(block.inputValues.content, ctx);
      const p = ctx.generateInput(block.inputValues.path, ctx);
      return `${ctx.getIndent()}local f = fs.open(${p}, "w")\n${ctx.getIndent()}if f then f.write(${content}) f.close() end`;
    },
  },
  {
    id: 'cc_fs_exists',
    category: 'ccApi', type: 'boolean',
    label: 'file %1 exists',
    inputs: [{ name: 'path', type: 'string', label: 'path', defaultValue: 'data.txt' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `fs.exists(${ctx.generateInput(block.inputValues.path, ctx)})`,
  },

  // HTTP API
  {
    id: 'cc_http_get',
    category: 'ccApi', type: 'expression',
    label: 'http GET %1',
    inputs: [{ name: 'url', type: 'string', label: 'URL', defaultValue: 'https://example.com' }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const url = ctx.generateInput(block.inputValues.url, ctx);
      return `(function() local r = http.get(${url}) if r then local d = r.readAll() r.close() return d end return nil end)()`;
    },
  },
  {
    id: 'cc_http_post',
    category: 'ccApi', type: 'expression',
    label: 'http POST %1 body %2',
    inputs: [
      { name: 'url', type: 'string', label: 'URL', defaultValue: 'https://example.com' },
      { name: 'body', type: 'string', label: 'body', defaultValue: '' },
    ],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const url = ctx.generateInput(block.inputValues.url, ctx);
      const body = ctx.generateInput(block.inputValues.body, ctx);
      return `(function() local r = http.post(${url}, ${body}) if r then local d = r.readAll() r.close() return d end return nil end)()`;
    },
  },

  // OS API
  {
    id: 'cc_os_startTimer',
    category: 'ccApi', type: 'expression',
    label: 'start timer %1 seconds',
    inputs: [{ name: 'seconds', type: 'number', label: 'seconds', defaultValue: 1 }],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `os.startTimer(${ctx.generateInput(block.inputValues.seconds, ctx)})`,
  },
  {
    id: 'cc_os_time',
    category: 'ccApi', type: 'expression',
    label: 'current time',
    inputs: [],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: () => `os.time()`,
  },
  {
    id: 'cc_os_day',
    category: 'ccApi', type: 'expression',
    label: 'current day',
    inputs: [],
    canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: () => `os.day()`,
  },
  {
    id: 'cc_print',
    category: 'ccApi', type: 'statement',
    label: 'print %1',
    inputs: [{ name: 'text', type: 'any', label: 'text', defaultValue: 'Hello World' }],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => `${ctx.getIndent()}print(${ctx.generateInput(block.inputValues.text, ctx)})`,
  },

  // Turtle API
  {
    id: 'cc_turtle_forward',
    category: 'ccApi', type: 'statement',
    label: 'turtle forward',
    inputs: [], canHaveNext: true, hasBranch: false, branchCount: 0,
    tooltip: 'Move turtle forward one block',
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}turtle.forward()`,
  },
  {
    id: 'cc_turtle_back',
    category: 'ccApi', type: 'statement',
    label: 'turtle back',
    inputs: [], canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}turtle.back()`,
  },
  {
    id: 'cc_turtle_up',
    category: 'ccApi', type: 'statement',
    label: 'turtle up',
    inputs: [], canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}turtle.up()`,
  },
  {
    id: 'cc_turtle_down',
    category: 'ccApi', type: 'statement',
    label: 'turtle down',
    inputs: [], canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}turtle.down()`,
  },
  {
    id: 'cc_turtle_turnLeft',
    category: 'ccApi', type: 'statement',
    label: 'turtle turn left',
    inputs: [], canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}turtle.turnLeft()`,
  },
  {
    id: 'cc_turtle_turnRight',
    category: 'ccApi', type: 'statement',
    label: 'turtle turn right',
    inputs: [], canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}turtle.turnRight()`,
  },
  {
    id: 'cc_turtle_dig',
    category: 'ccApi', type: 'statement',
    label: 'turtle dig',
    inputs: [], canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}turtle.dig()`,
  },
  {
    id: 'cc_turtle_place',
    category: 'ccApi', type: 'statement',
    label: 'turtle place',
    inputs: [], canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (_block, ctx) => `${ctx.getIndent()}turtle.place()`,
  },
  {
    id: 'cc_turtle_detect',
    category: 'ccApi', type: 'boolean',
    label: 'turtle detect block ahead',
    inputs: [], canHaveNext: false, hasBranch: false, branchCount: 0,
    luaGenerator: () => `turtle.detect()`,
  },

  // Modem
  {
    id: 'cc_modem_transmit',
    category: 'ccApi', type: 'statement',
    label: 'transmit on channel %1 reply %2 message %3',
    inputs: [
      { name: 'channel', type: 'number', label: 'channel', defaultValue: 1 },
      { name: 'reply', type: 'number', label: 'reply channel', defaultValue: 1 },
      { name: 'message', type: 'any', label: 'message', defaultValue: '' },
    ],
    canHaveNext: true, hasBranch: false, branchCount: 0,
    luaGenerator: (block, ctx) => {
      const ch = ctx.generateInput(block.inputValues.channel, ctx);
      const reply = ctx.generateInput(block.inputValues.reply, ctx);
      const msg = ctx.generateInput(block.inputValues.message, ctx);
      return `${ctx.getIndent()}modem.transmit(${ch}, ${reply}, ${msg})`;
    },
  },
];
