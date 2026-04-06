import * as Blockly from 'blockly';

// Lua order of operations (precedence)
export const Order = {
  ATOMIC: 0,
  HIGH: 1,       // unary operators: not, #, -
  EXPONENT: 2,   // ^
  MULTIPLY: 3,   // *, /, %
  ADD: 4,        // +, -
  CONCAT: 5,     // ..
  RELATIONAL: 6, // <, >, <=, >=, ~=, ==
  AND: 7,        // and
  OR: 8,         // or
  NONE: 99,
};

type GeneratorFunc = (block: Blockly.Block, generator: LuaGen) => string | [string, number];

class LuaGen {
  private blockGenerators: Record<string, GeneratorFunc> = {};
  private indent_ = 0;

  addGenerator(blockType: string, fn: GeneratorFunc) {
    this.blockGenerators[blockType] = fn;
  }

  getIndent(): string {
    return '  '.repeat(this.indent_);
  }

  indent() { this.indent_++; }
  deindent() { this.indent_ = Math.max(0, this.indent_ - 1); }
  resetIndent() { this.indent_ = 0; }

  blockToCode(block: Blockly.Block | null): string | [string, number] {
    if (!block) return '';
    const fn = this.blockGenerators[block.type];
    if (!fn) return '';
    return fn(block, this);
  }

  valueToCode(block: Blockly.Block, name: string, order: number): string {
    const target = block.getInputTargetBlock(name);
    if (!target) return 'nil';
    const result = this.blockToCode(target);
    if (Array.isArray(result)) return result[0];
    return result || 'nil';
  }

  statementToCode(block: Blockly.Block, name: string): string {
    const target = block.getInputTargetBlock(name);
    if (!target) return '';
    return this.chainToCode(target);
  }

  chainToCode(block: Blockly.Block | null): string {
    const lines: string[] = [];
    let current = block;
    while (current) {
      const code = this.blockToCode(current);
      if (typeof code === 'string' && code.trim()) {
        lines.push(code);
      } else if (Array.isArray(code) && code[0].trim()) {
        lines.push(code[0]);
      }
      current = current.getNextBlock();
    }
    return lines.join('\n');
  }

  workspaceToCode(workspace: Blockly.Workspace): string {
    this.resetIndent();
    const topBlocks = workspace.getTopBlocks(true);
    const sections: string[] = [];

    for (const block of topBlocks) {
      const code = this.chainToCode(block);
      if (code.trim()) sections.push(code);
    }

    return sections.join('\n\n');
  }
}

export const luaGenerator = new LuaGen();

// ===================================================================
// Register all generators
// ===================================================================

export function registerAllGenerators() {

  // =================================================================
  // 1. EVENTS
  // =================================================================

  luaGenerator.addGenerator('event_screen_load', (block, gen) => {
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:screen_load]\n${body}\n-- [/EVENT:screen_load]`;
  });

  luaGenerator.addGenerator('event_button_click', (block, gen) => {
    const btn = block.getFieldValue('BUTTON');
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:button_click:${btn}]\n${body}\n-- [/EVENT:button_click:${btn}]`;
  });

  luaGenerator.addGenerator('event_button_focus', (block, gen) => {
    const btn = block.getFieldValue('BUTTON');
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:button_focus:${btn}]\n${body}\n-- [/EVENT:button_focus:${btn}]`;
  });

  luaGenerator.addGenerator('event_button_release', (block, gen) => {
    const btn = block.getFieldValue('BUTTON');
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:button_release:${btn}]\n${body}\n-- [/EVENT:button_release:${btn}]`;
  });

  luaGenerator.addGenerator('event_key_press', (block, gen) => {
    const key = block.getFieldValue('KEY');
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:key_press:${key}]\n${body}\n-- [/EVENT:key_press:${key}]`;
  });

  luaGenerator.addGenerator('event_timer', (block, gen) => {
    const interval = block.getFieldValue('INTERVAL');
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:timer:${interval}]\n${body}\n-- [/EVENT:timer:${interval}]`;
  });

  luaGenerator.addGenerator('event_redstone', (block, gen) => {
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:redstone]\n${body}\n-- [/EVENT:redstone]`;
  });

  luaGenerator.addGenerator('event_modem_message', (block, gen) => {
    const ch = block.getFieldValue('CHANNEL');
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:modem_message:${ch}]\n${body}\n-- [/EVENT:modem_message:${ch}]`;
  });

  luaGenerator.addGenerator('event_any', (block, gen) => {
    const body = gen.statementToCode(block, 'DO');
    return `-- [EVENT:any]\n${body}\n-- [/EVENT:any]`;
  });

  // =================================================================
  // 2. UI ACTIONS
  // =================================================================

  luaGenerator.addGenerator('ui_set_text', (block, gen) => {
    const el = block.getFieldValue('ELEMENT');
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    return `${gen.getIndent()}getElement("${el}").text = ${text}\n${gen.getIndent()}drawCurrentScreen()`;
  });

  luaGenerator.addGenerator('ui_set_color', (block, gen) => {
    const el = block.getFieldValue('ELEMENT');
    const prop = block.getFieldValue('PROP');
    const color = block.getFieldValue('COLOR');
    return `${gen.getIndent()}getElement("${el}").${prop} = ${color}\n${gen.getIndent()}drawCurrentScreen()`;
  });

  luaGenerator.addGenerator('ui_show', (block, gen) => {
    const el = block.getFieldValue('ELEMENT');
    return `${gen.getIndent()}getElement("${el}").visible = true\n${gen.getIndent()}drawCurrentScreen()`;
  });

  luaGenerator.addGenerator('ui_hide', (block, gen) => {
    const el = block.getFieldValue('ELEMENT');
    return `${gen.getIndent()}getElement("${el}").visible = false\n${gen.getIndent()}drawCurrentScreen()`;
  });

  luaGenerator.addGenerator('ui_navigate', (block, gen) => {
    const screen = (block.getFieldValue('SCREEN') || '').replace(/[^a-zA-Z0-9_]/g, '_');
    return `${gen.getIndent()}navigate("${screen}")`;
  });

  luaGenerator.addGenerator('ui_set_progress', (block, gen) => {
    const el = block.getFieldValue('ELEMENT');
    const val = gen.valueToCode(block, 'VALUE', Order.NONE);
    return `${gen.getIndent()}getElement("${el}").value = ${val}\n${gen.getIndent()}drawCurrentScreen()`;
  });

  luaGenerator.addGenerator('ui_write_at', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    const x = gen.valueToCode(block, 'X', Order.NONE);
    const y = gen.valueToCode(block, 'Y', Order.NONE);
    return `${gen.getIndent()}term.setCursorPos(${x}, ${y})\n${gen.getIndent()}term.write(${text})`;
  });
  
  luaGenerator.addGenerator('ui_set_visible', (block, gen) => {
    const el = block.getFieldValue('ELEMENT');
    const bool = gen.valueToCode(block, 'BOOL', Order.NONE);
    return `${gen.getIndent()}getElement("${el}").visible = ${bool}\n${gen.getIndent()}drawCurrentScreen()`;
  });

  luaGenerator.addGenerator('ui_get_text', (block) => {
    const el = block.getFieldValue('ELEMENT');
    return [`getElement("${el}").text`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('ui_get_value', (block) => {
    const el = block.getFieldValue('ELEMENT');
    return [`getElement("${el}").value`, Order.ATOMIC];
  });

  // =================================================================
  // 3. TERMINAL API
  // =================================================================

  luaGenerator.addGenerator('term_write', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    return `${gen.getIndent()}term.write(${text})`;
  });

  luaGenerator.addGenerator('term_clear', (_block, gen) => {
    return `${gen.getIndent()}term.clear()`;
  });

  luaGenerator.addGenerator('term_clearLine', (_block, gen) => {
    return `${gen.getIndent()}term.clearLine()`;
  });

  luaGenerator.addGenerator('term_setCursorPos', (block, gen) => {
    const x = gen.valueToCode(block, 'X', Order.NONE);
    const y = gen.valueToCode(block, 'Y', Order.NONE);
    return `${gen.getIndent()}term.setCursorPos(${x}, ${y})`;
  });

  luaGenerator.addGenerator('term_setCursorBlink', (block, gen) => {
    const blink = gen.valueToCode(block, 'BOOL', Order.NONE);
    return `${gen.getIndent()}term.setCursorBlink(${blink})`;
  });

  luaGenerator.addGenerator('term_setTextColor', (block, gen) => {
    const color = block.getFieldValue('COLOR');
    return `${gen.getIndent()}term.setTextColor(${color})`;
  });

  luaGenerator.addGenerator('term_setBgColor', (block, gen) => {
    const color = block.getFieldValue('COLOR');
    return `${gen.getIndent()}term.setBackgroundColor(${color})`;
  });

  luaGenerator.addGenerator('term_scroll', (block, gen) => {
    const n = gen.valueToCode(block, 'N', Order.NONE);
    return `${gen.getIndent()}term.scroll(${n})`;
  });

  luaGenerator.addGenerator('term_blit', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    const fg = gen.valueToCode(block, 'FG', Order.NONE);
    const bg = gen.valueToCode(block, 'BG', Order.NONE);
    return `${gen.getIndent()}term.blit(${text}, ${fg}, ${bg})`;
  });

  luaGenerator.addGenerator('term_getWidth', () => {
    return [`({term.getSize()})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('term_getHeight', () => {
    return [`select(2, term.getSize())`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('term_getCursorX', () => {
    return [`({term.getCursorPos()})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('term_getCursorY', () => {
    return [`select(2, term.getCursorPos())`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('term_getTextColor', () => {
    return [`term.getTextColor()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('term_getBgColor', () => {
    return [`term.getBackgroundColor()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('term_isColor', () => {
    return [`term.isColor()`, Order.ATOMIC];
  });

  // =================================================================
  // 4. REDSTONE API
  // =================================================================

  luaGenerator.addGenerator('rs_setOutput', (block, gen) => {
    const side = block.getFieldValue('SIDE');
    const value = block.getFieldValue('VALUE');
    return `${gen.getIndent()}redstone.setOutput("${side}", ${value})`;
  });

  luaGenerator.addGenerator('rs_setAnalogOutput', (block, gen) => {
    const side = block.getFieldValue('SIDE');
    const value = block.getFieldValue('VALUE');
    return `${gen.getIndent()}redstone.setAnalogOutput("${side}", ${value})`;
  });

  luaGenerator.addGenerator('rs_setBundledOutput', (block, gen) => {
    const side = block.getFieldValue('SIDE');
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    return `${gen.getIndent()}redstone.setBundledOutput("${side}", ${value})`;
  });

  luaGenerator.addGenerator('rs_getInput', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`redstone.getInput("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('rs_getOutput', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`redstone.getOutput("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('rs_getAnalogInput', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`redstone.getAnalogInput("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('rs_getAnalogOutput', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`redstone.getAnalogOutput("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('rs_getBundledInput', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`redstone.getBundledInput("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('rs_testBundledInput', (block) => {
    const side = block.getFieldValue('SIDE');
    const color = block.getFieldValue('COLOR');
    return [`redstone.testBundledInput("${side}", ${color})`, Order.ATOMIC];
  });

  // =================================================================
  // 5. FILESYSTEM API
  // =================================================================

  luaGenerator.addGenerator('fs_writeFile', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    const content = gen.valueToCode(block, 'CONTENT', Order.NONE);
    return `${gen.getIndent()}local _fh = fs.open(${path}, "w")\n${gen.getIndent()}if _fh then _fh.write(${content}); _fh.close() end`;
  });

  luaGenerator.addGenerator('fs_appendFile', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    const content = gen.valueToCode(block, 'CONTENT', Order.NONE);
    return `${gen.getIndent()}local _fh = fs.open(${path}, "a")\n${gen.getIndent()}if _fh then _fh.write(${content}); _fh.close() end`;
  });

  luaGenerator.addGenerator('fs_delete', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return `${gen.getIndent()}fs.delete(${path})`;
  });

  luaGenerator.addGenerator('fs_makeDir', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return `${gen.getIndent()}fs.makeDir(${path})`;
  });

  luaGenerator.addGenerator('fs_move', (block, gen) => {
    const from = gen.valueToCode(block, 'FROM', Order.NONE);
    const to = gen.valueToCode(block, 'TO', Order.NONE);
    return `${gen.getIndent()}fs.move(${from}, ${to})`;
  });

  luaGenerator.addGenerator('fs_copy', (block, gen) => {
    const from = gen.valueToCode(block, 'FROM', Order.NONE);
    const to = gen.valueToCode(block, 'TO', Order.NONE);
    return `${gen.getIndent()}fs.copy(${from}, ${to})`;
  });

  luaGenerator.addGenerator('fs_readFile', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return [`(function() local f = fs.open(${path}, "r"); if f then local d = f.readAll(); f.close(); return d end; return "" end)()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('fs_exists', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return [`fs.exists(${path})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('fs_isDir', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return [`fs.isDir(${path})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('fs_list', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return [`fs.list(${path})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('fs_getSize', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return [`fs.getSize(${path})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('fs_getFreeSpace', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return [`fs.getFreeSpace(${path})`, Order.ATOMIC];
  });

  // =================================================================
  // 6. HTTP API
  // =================================================================

  luaGenerator.addGenerator('http_postRequest', (block, gen) => {
    const url = gen.valueToCode(block, 'URL', Order.NONE);
    const body = gen.valueToCode(block, 'BODY', Order.NONE);
    return `${gen.getIndent()}http.post(${url}, ${body})`;
  });

  luaGenerator.addGenerator('http_get', (block, gen) => {
    const url = gen.valueToCode(block, 'URL', Order.NONE);
    return [`(function() local r = http.get(${url}); if r then local d = r.readAll(); r.close(); return d end; return nil end)()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('http_checkURL', (block, gen) => {
    const url = gen.valueToCode(block, 'URL', Order.NONE);
    return [`http.checkURL(${url})`, Order.ATOMIC];
  });

  // =================================================================
  // 7. PERIPHERAL API
  // =================================================================

  luaGenerator.addGenerator('peripheral_call', (block, gen) => {
    const side = block.getFieldValue('SIDE');
    const method = block.getFieldValue('METHOD');
    const args = gen.valueToCode(block, 'ARGS', Order.NONE);
    if (args && args !== 'nil') {
      return `${gen.getIndent()}peripheral.call("${side}", "${method}", ${args})`;
    }
    return `${gen.getIndent()}peripheral.call("${side}", "${method}")`;
  });

  luaGenerator.addGenerator('peripheral_wrap', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`peripheral.wrap("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('peripheral_find', (block) => {
    const type = block.getFieldValue('TYPE');
    return [`peripheral.find("${type}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('peripheral_getType', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`peripheral.getType("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('peripheral_isPresent', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`peripheral.isPresent("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('peripheral_getMethods', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`peripheral.getMethods("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('peripheral_getNames', () => {
    return [`peripheral.getNames()`, Order.ATOMIC];
  });

  // =================================================================
  // 8. TURTLE API
  // =================================================================

  // --- Movement statement blocks (no inputs) ---
  const turtleSimpleMoves = [
    'forward', 'back', 'up', 'down', 'turnLeft', 'turnRight',
    'dig', 'digUp', 'digDown', 'place', 'placeUp', 'placeDown',
    'attack', 'attackUp', 'attackDown',
    'refuel', 'equipLeft', 'equipRight',
  ];
  for (const move of turtleSimpleMoves) {
    luaGenerator.addGenerator(`turtle_${move}`, (_block, gen) => {
      return `${gen.getIndent()}turtle.${move}()`;
    });
  }

  // --- Drop statements (COUNT field) ---
  luaGenerator.addGenerator('turtle_drop', (block, gen) => {
    const count = block.getFieldValue('COUNT');
    return `${gen.getIndent()}turtle.drop(${count})`;
  });

  luaGenerator.addGenerator('turtle_dropUp', (block, gen) => {
    const count = block.getFieldValue('COUNT');
    return `${gen.getIndent()}turtle.dropUp(${count})`;
  });

  luaGenerator.addGenerator('turtle_dropDown', (block, gen) => {
    const count = block.getFieldValue('COUNT');
    return `${gen.getIndent()}turtle.dropDown(${count})`;
  });

  // --- Suck statements (COUNT field) ---
  luaGenerator.addGenerator('turtle_suck', (block, gen) => {
    const count = block.getFieldValue('COUNT');
    return `${gen.getIndent()}turtle.suck(${count})`;
  });

  luaGenerator.addGenerator('turtle_suckUp', (block, gen) => {
    const count = block.getFieldValue('COUNT');
    return `${gen.getIndent()}turtle.suckUp(${count})`;
  });

  luaGenerator.addGenerator('turtle_suckDown', (block, gen) => {
    const count = block.getFieldValue('COUNT');
    return `${gen.getIndent()}turtle.suckDown(${count})`;
  });

  // --- Other turtle statements ---
  luaGenerator.addGenerator('turtle_select', (block, gen) => {
    const slot = block.getFieldValue('SLOT');
    return `${gen.getIndent()}turtle.select(${slot})`;
  });

  luaGenerator.addGenerator('turtle_craft', (block, gen) => {
    const limit = block.getFieldValue('LIMIT');
    return `${gen.getIndent()}turtle.craft(${limit})`;
  });

  luaGenerator.addGenerator('turtle_transferTo', (block, gen) => {
    const slot = block.getFieldValue('SLOT');
    const count = block.getFieldValue('COUNT');
    return `${gen.getIndent()}turtle.transferTo(${slot}, ${count})`;
  });

  // --- Turtle value blocks (no inputs) ---

  luaGenerator.addGenerator('turtle_detect', () => {
    return [`turtle.detect()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_detectUp', () => {
    return [`turtle.detectUp()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_detectDown', () => {
    return [`turtle.detectDown()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_compare', () => {
    return [`turtle.compare()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_compareUp', () => {
    return [`turtle.compareUp()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_compareDown', () => {
    return [`turtle.compareDown()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_inspect', () => {
    return [`({turtle.inspect()})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_inspectUp', () => {
    return [`({turtle.inspectUp()})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_inspectDown', () => {
    return [`({turtle.inspectDown()})`, Order.ATOMIC];
  });

  // --- Turtle value blocks (with SLOT field) ---

  luaGenerator.addGenerator('turtle_getItemCount', (block) => {
    const slot = block.getFieldValue('SLOT');
    return [`turtle.getItemCount(${slot})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_getItemSpace', (block) => {
    const slot = block.getFieldValue('SLOT');
    return [`turtle.getItemSpace(${slot})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_getItemDetail', (block) => {
    const slot = block.getFieldValue('SLOT');
    return [`turtle.getItemDetail(${slot})`, Order.ATOMIC];
  });

  // --- Turtle value blocks (no inputs) ---

  luaGenerator.addGenerator('turtle_getFuelLevel', () => {
    return [`turtle.getFuelLevel()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_getFuelLimit', () => {
    return [`turtle.getFuelLimit()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('turtle_getSelectedSlot', () => {
    return [`turtle.getSelectedSlot()`, Order.ATOMIC];
  });

  // =================================================================
  // 9. OS API
  // =================================================================

  luaGenerator.addGenerator('os_sleep', (block, gen) => {
    const secs = gen.valueToCode(block, 'SECS', Order.NONE);
    return `${gen.getIndent()}os.sleep(${secs})`;
  });

  luaGenerator.addGenerator('os_shutdown', (_block, gen) => {
    return `${gen.getIndent()}os.shutdown()`;
  });

  luaGenerator.addGenerator('os_reboot', (_block, gen) => {
    return `${gen.getIndent()}os.reboot()`;
  });

  luaGenerator.addGenerator('os_queueEvent', (block, gen) => {
    const name = block.getFieldValue('NAME');
    const data = gen.valueToCode(block, 'DATA', Order.NONE);
    return `${gen.getIndent()}os.queueEvent("${name}", ${data})`;
  });

  luaGenerator.addGenerator('os_setComputerLabel', (block, gen) => {
    const label = gen.valueToCode(block, 'LABEL', Order.NONE);
    return `${gen.getIndent()}os.setComputerLabel(${label})`;
  });

  luaGenerator.addGenerator('os_cancelTimer', (block, gen) => {
    const id = gen.valueToCode(block, 'ID', Order.NONE);
    return `${gen.getIndent()}os.cancelTimer(${id})`;
  });

  luaGenerator.addGenerator('os_cancelAlarm', (block, gen) => {
    const id = gen.valueToCode(block, 'ID', Order.NONE);
    return `${gen.getIndent()}os.cancelAlarm(${id})`;
  });

  luaGenerator.addGenerator('os_startTimer', (block, gen) => {
    const secs = gen.valueToCode(block, 'SECS', Order.NONE);
    return [`os.startTimer(${secs})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('os_setAlarm', (block, gen) => {
    const time = gen.valueToCode(block, 'TIME', Order.NONE);
    return [`os.setAlarm(${time})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('os_time', () => {
    return [`os.time()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('os_day', () => {
    return [`os.day()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('os_epoch', () => {
    return [`os.epoch()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('os_clock', () => {
    return [`os.clock()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('os_getComputerID', () => {
    return [`os.getComputerID()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('os_getComputerLabel', () => {
    return [`os.getComputerLabel()`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('os_version', () => {
    return [`os.version()`, Order.ATOMIC];
  });

  // =================================================================
  // 10. REDNET API
  // =================================================================

  luaGenerator.addGenerator('rednet_open', (block, gen) => {
    const side = block.getFieldValue('SIDE');
    return `${gen.getIndent()}rednet.open("${side}")`;
  });

  luaGenerator.addGenerator('rednet_close', (block, gen) => {
    const side = block.getFieldValue('SIDE');
    return `${gen.getIndent()}rednet.close("${side}")`;
  });

  luaGenerator.addGenerator('rednet_send', (block, gen) => {
    const id = gen.valueToCode(block, 'ID', Order.NONE);
    const message = gen.valueToCode(block, 'MESSAGE', Order.NONE);
    const protocol = block.getFieldValue('PROTOCOL');
    if (protocol) {
      return `${gen.getIndent()}rednet.send(${id}, ${message}, "${protocol}")`;
    }
    return `${gen.getIndent()}rednet.send(${id}, ${message})`;
  });

  luaGenerator.addGenerator('rednet_broadcast', (block, gen) => {
    const message = gen.valueToCode(block, 'MESSAGE', Order.NONE);
    const protocol = block.getFieldValue('PROTOCOL');
    if (protocol) {
      return `${gen.getIndent()}rednet.broadcast(${message}, "${protocol}")`;
    }
    return `${gen.getIndent()}rednet.broadcast(${message})`;
  });

  luaGenerator.addGenerator('rednet_host', (block, gen) => {
    const protocol = block.getFieldValue('PROTOCOL');
    const hostname = block.getFieldValue('HOSTNAME');
    return `${gen.getIndent()}rednet.host("${protocol}", "${hostname}")`;
  });

  luaGenerator.addGenerator('rednet_unhost', (block, gen) => {
    const protocol = block.getFieldValue('PROTOCOL');
    return `${gen.getIndent()}rednet.unhost("${protocol}")`;
  });

  luaGenerator.addGenerator('rednet_receive', (block) => {
    const timeout = block.getFieldValue('TIMEOUT');
    return [`({rednet.receive(${timeout})})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('rednet_lookup', (block) => {
    const protocol = block.getFieldValue('PROTOCOL');
    const hostname = block.getFieldValue('HOSTNAME');
    if (hostname) {
      return [`rednet.lookup("${protocol}", "${hostname}")`, Order.ATOMIC];
    }
    return [`rednet.lookup("${protocol}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('rednet_isOpen', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`rednet.isOpen("${side}")`, Order.ATOMIC];
  });

  // =================================================================
  // 11. TEXTUTILS API
  // =================================================================

  luaGenerator.addGenerator('textutils_slowPrint', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    const rate = gen.valueToCode(block, 'RATE', Order.NONE);
    return `${gen.getIndent()}textutils.slowPrint(${text}, ${rate})`;
  });

  luaGenerator.addGenerator('textutils_slowWrite', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    const rate = gen.valueToCode(block, 'RATE', Order.NONE);
    return `${gen.getIndent()}textutils.slowWrite(${text}, ${rate})`;
  });

  luaGenerator.addGenerator('textutils_serialize', (block, gen) => {
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    return [`textutils.serialize(${value})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('textutils_unserialize', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    return [`textutils.unserialize(${text})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('textutils_serializeJSON', (block, gen) => {
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    return [`textutils.serializeJSON(${value})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('textutils_unserializeJSON', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    return [`textutils.unserializeJSON(${text})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('textutils_urlEncode', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    return [`textutils.urlEncode(${text})`, Order.ATOMIC];
  });

  // =================================================================
  // 12. PAINTUTILS API
  // =================================================================

  luaGenerator.addGenerator('paint_drawPixel', (block, gen) => {
    const x = gen.valueToCode(block, 'X', Order.NONE);
    const y = gen.valueToCode(block, 'Y', Order.NONE);
    const color = block.getFieldValue('COLOR');
    return `${gen.getIndent()}paintutils.drawPixel(${x}, ${y}, ${color})`;
  });

  luaGenerator.addGenerator('paint_drawLine', (block, gen) => {
    const x1 = gen.valueToCode(block, 'X1', Order.NONE);
    const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
    const x2 = gen.valueToCode(block, 'X2', Order.NONE);
    const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
    const color = block.getFieldValue('COLOR');
    return `${gen.getIndent()}paintutils.drawLine(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
  });

  luaGenerator.addGenerator('paint_drawBox', (block, gen) => {
    const x1 = gen.valueToCode(block, 'X1', Order.NONE);
    const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
    const x2 = gen.valueToCode(block, 'X2', Order.NONE);
    const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
    const color = block.getFieldValue('COLOR');
    return `${gen.getIndent()}paintutils.drawBox(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
  });

  luaGenerator.addGenerator('paint_drawFilledBox', (block, gen) => {
    const x1 = gen.valueToCode(block, 'X1', Order.NONE);
    const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
    const x2 = gen.valueToCode(block, 'X2', Order.NONE);
    const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
    const color = block.getFieldValue('COLOR');
    return `${gen.getIndent()}paintutils.drawFilledBox(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
  });

  luaGenerator.addGenerator('paint_drawImage', (block, gen) => {
    const image = gen.valueToCode(block, 'IMAGE', Order.NONE);
    const x = gen.valueToCode(block, 'X', Order.NONE);
    const y = gen.valueToCode(block, 'Y', Order.NONE);
    return `${gen.getIndent()}paintutils.drawImage(${image}, ${x}, ${y})`;
  });

  luaGenerator.addGenerator('paint_loadImage', (block, gen) => {
    const path = gen.valueToCode(block, 'PATH', Order.NONE);
    return [`paintutils.loadImage(${path})`, Order.ATOMIC];
  });

  // =================================================================
  // 13. WINDOW API
  // =================================================================

  luaGenerator.addGenerator('window_create', (block, gen) => {
    const x = gen.valueToCode(block, 'X', Order.NONE);
    const y = gen.valueToCode(block, 'Y', Order.NONE);
    const w = gen.valueToCode(block, 'W', Order.NONE);
    const h = gen.valueToCode(block, 'H', Order.NONE);
    return [`window.create(term.current(), ${x}, ${y}, ${w}, ${h})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('window_setVisible', (block, gen) => {
    const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
    const bool = gen.valueToCode(block, 'BOOL', Order.NONE);
    return `${gen.getIndent()}${win}.setVisible(${bool})`;
  });

  luaGenerator.addGenerator('window_reposition', (block, gen) => {
    const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
    const x = gen.valueToCode(block, 'X', Order.NONE);
    const y = gen.valueToCode(block, 'Y', Order.NONE);
    const w = gen.valueToCode(block, 'W', Order.NONE);
    const h = gen.valueToCode(block, 'H', Order.NONE);
    return `${gen.getIndent()}${win}.reposition(${x}, ${y}, ${w}, ${h})`;
  });

  luaGenerator.addGenerator('window_redraw', (block, gen) => {
    const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
    return `${gen.getIndent()}${win}.redraw()`;
  });

  luaGenerator.addGenerator('window_getWidth', (block, gen) => {
    const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
    return [`({${win}.getSize()})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('window_getHeight', (block, gen) => {
    const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
    return [`select(2, ${win}.getSize())`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('window_getPositionX', (block, gen) => {
    const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
    return [`({${win}.getPosition()})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('window_getPositionY', (block, gen) => {
    const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
    return [`select(2, ${win}.getPosition())`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('window_isVisible', (block, gen) => {
    const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
    return [`${win}.isVisible()`, Order.ATOMIC];
  });

  // =================================================================
  // 14. SETTINGS API
  // =================================================================

  luaGenerator.addGenerator('settings_set', (block, gen) => {
    const name = block.getFieldValue('NAME');
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    return `${gen.getIndent()}settings.set("${name}", ${value})`;
  });

  luaGenerator.addGenerator('settings_unset', (block, gen) => {
    const name = block.getFieldValue('NAME');
    return `${gen.getIndent()}settings.unset("${name}")`;
  });

  luaGenerator.addGenerator('settings_save', (block, gen) => {
    const path = block.getFieldValue('PATH');
    return `${gen.getIndent()}settings.save("${path}")`;
  });

  luaGenerator.addGenerator('settings_load', (block, gen) => {
    const path = block.getFieldValue('PATH');
    return `${gen.getIndent()}settings.load("${path}")`;
  });

  luaGenerator.addGenerator('settings_get', (block, gen) => {
    const name = block.getFieldValue('NAME');
    const def = gen.valueToCode(block, 'DEFAULT', Order.NONE);
    return [`settings.get("${name}", ${def})`, Order.ATOMIC];
  });

  // =================================================================
  // 15. GPS API
  // =================================================================

  luaGenerator.addGenerator('gps_locate', (block) => {
    const timeout = block.getFieldValue('TIMEOUT');
    return [`(function() local x,y,z = gps.locate(${timeout}); return {x=x,y=y,z=z} end)()`, Order.ATOMIC];
  });

  // =================================================================
  // 16. DISK API
  // =================================================================

  luaGenerator.addGenerator('disk_eject', (block, gen) => {
    const side = block.getFieldValue('SIDE');
    return `${gen.getIndent()}disk.eject("${side}")`;
  });

  luaGenerator.addGenerator('disk_setLabel', (block, gen) => {
    const side = block.getFieldValue('SIDE');
    const label = gen.valueToCode(block, 'LABEL', Order.NONE);
    return `${gen.getIndent()}disk.setLabel("${side}", ${label})`;
  });

  luaGenerator.addGenerator('disk_isPresent', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`disk.isPresent("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('disk_hasData', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`disk.hasData("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('disk_hasAudio', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`disk.hasAudio("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('disk_getLabel', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`disk.getLabel("${side}")`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('disk_getMountPath', (block) => {
    const side = block.getFieldValue('SIDE');
    return [`disk.getMountPath("${side}")`, Order.ATOMIC];
  });

  // =================================================================
  // 17. UTILITY
  // =================================================================

  luaGenerator.addGenerator('term_print', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    return `${gen.getIndent()}print(${text})`;
  });

  luaGenerator.addGenerator('term_redirect', (block, gen) => {
    const dest = gen.valueToCode(block, 'TYPE', Order.NONE);
    return `${gen.getIndent()}term.redirect(${dest})`;
  });

  luaGenerator.addGenerator('sleep_secs', (block, gen) => {
    const secs = gen.valueToCode(block, 'SECS', Order.NONE);
    return `${gen.getIndent()}sleep(${secs})`;
  });

  luaGenerator.addGenerator('pcall_wrap', (block, gen) => {
    gen.indent();
    const doBody = gen.statementToCode(block, 'DO');
    gen.deindent();
    gen.indent();
    const catchBody = gen.statementToCode(block, 'CATCH');
    gen.deindent();
    return `${gen.getIndent()}local _ok, _err = pcall(function()\n${doBody}\n${gen.getIndent()}end)\n${gen.getIndent()}if not _ok then\n${catchBody}\n${gen.getIndent()}end`;
  });

  luaGenerator.addGenerator('tonumber_val', (block, gen) => {
    const text = gen.valueToCode(block, 'TEXT', Order.NONE);
    return [`tonumber(${text})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('tostring_val', (block, gen) => {
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    return [`tostring(${value})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('type_of', (block, gen) => {
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    return [`type(${value})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('term_read', () => {
    return [`read()`, Order.ATOMIC];
  });

  // =================================================================
  // Built-in Blockly blocks: Logic
  // =================================================================

  luaGenerator.addGenerator('logic_boolean', (block) => {
    return [block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false', Order.ATOMIC];
  });

  luaGenerator.addGenerator('logic_negate', (block, gen) => {
    const val = gen.valueToCode(block, 'BOOL', Order.HIGH);
    return [`not ${val}`, Order.HIGH];
  });

  luaGenerator.addGenerator('logic_operation', (block, gen) => {
    const op = block.getFieldValue('OP') === 'AND' ? 'and' : 'or';
    const order = op === 'and' ? Order.AND : Order.OR;
    const a = gen.valueToCode(block, 'A', order);
    const b = gen.valueToCode(block, 'B', order);
    return [`${a} ${op} ${b}`, order];
  });

  luaGenerator.addGenerator('logic_compare', (block, gen) => {
    const ops: Record<string, string> = { EQ: '==', NEQ: '~=', LT: '<', LTE: '<=', GT: '>', GTE: '>=' };
    const op = ops[block.getFieldValue('OP')] || '==';
    const a = gen.valueToCode(block, 'A', Order.RELATIONAL);
    const b = gen.valueToCode(block, 'B', Order.RELATIONAL);
    return [`${a} ${op} ${b}`, Order.RELATIONAL];
  });

  // =================================================================
  // Built-in Blockly blocks: Math
  // =================================================================

  luaGenerator.addGenerator('math_number', (block) => {
    return [String(block.getFieldValue('NUM')), Order.ATOMIC];
  });

  luaGenerator.addGenerator('math_arithmetic', (block, gen) => {
    const ops: Record<string, [string, number]> = {
      ADD: ['+', Order.ADD], MINUS: ['-', Order.ADD],
      MULTIPLY: ['*', Order.MULTIPLY], DIVIDE: ['/', Order.MULTIPLY],
      POWER: ['^', Order.EXPONENT], MODULO: ['%', Order.MULTIPLY],
    };
    const [op, order] = ops[block.getFieldValue('OP')] || ['+', Order.ADD];
    const a = gen.valueToCode(block, 'A', order);
    const b = gen.valueToCode(block, 'B', order);
    return [`${a} ${op} ${b}`, order];
  });

  luaGenerator.addGenerator('math_single', (block, gen) => {
    const opMap: Record<string, string> = {
      ROOT: 'math.sqrt', ABS: 'math.abs', NEG: '-',
      LN: 'math.log', LOG10: 'math.log10',
      EXP: 'math.exp', POW10: '10^',
    };
    const op = block.getFieldValue('OP');
    const val = gen.valueToCode(block, 'NUM', Order.HIGH);
    if (op === 'NEG') return [`-${val}`, Order.HIGH];
    return [`${opMap[op] || 'math.abs'}(${val})`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('math_random_int', (block, gen) => {
    const a = gen.valueToCode(block, 'FROM', Order.NONE);
    const b = gen.valueToCode(block, 'TO', Order.NONE);
    return [`math.random(${a}, ${b})`, Order.ATOMIC];
  });

  // =================================================================
  // Built-in Blockly blocks: Text
  // =================================================================

  luaGenerator.addGenerator('text', (block) => {
    const val = (block.getFieldValue('TEXT') || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return [`"${val}"`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('text_join', (block, gen) => {
    const count = (block as any).itemCount_ || 2;
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      parts.push(gen.valueToCode(block, `ADD${i}`, Order.CONCAT));
    }
    return [parts.join(' .. ') || '""', Order.CONCAT];
  });

  luaGenerator.addGenerator('text_length', (block, gen) => {
    const text = gen.valueToCode(block, 'VALUE', Order.HIGH);
    return [`#${text}`, Order.HIGH];
  });

  // =================================================================
  // Built-in Blockly blocks: Variables
  // =================================================================

  luaGenerator.addGenerator('variables_get', (block) => {
    const name = block.getFieldValue('VAR') || 'x';
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
    return [safeName, Order.ATOMIC];
  });

  luaGenerator.addGenerator('variables_set', (block, gen) => {
    const name = block.getFieldValue('VAR') || 'x';
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
    const val = gen.valueToCode(block, 'VALUE', Order.NONE);
    return `${gen.getIndent()}${safeName} = ${val}`;
  });

  luaGenerator.addGenerator('math_change', (block, gen) => {
    const name = block.getFieldValue('VAR') || 'x';
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
    const val = gen.valueToCode(block, 'DELTA', Order.ADD);
    return `${gen.getIndent()}${safeName} = ${safeName} + ${val}`;
  });

  // =================================================================
  // Built-in Blockly blocks: Loops
  // =================================================================

  luaGenerator.addGenerator('controls_repeat_ext', (block, gen) => {
    const times = gen.valueToCode(block, 'TIMES', Order.NONE);
    gen.indent();
    const body = gen.statementToCode(block, 'DO');
    gen.deindent();
    return `${gen.getIndent()}for _i = 1, ${times} do\n${body}\n${gen.getIndent()}end`;
  });

  luaGenerator.addGenerator('controls_whileUntil', (block, gen) => {
    const mode = block.getFieldValue('MODE');
    let cond = gen.valueToCode(block, 'BOOL', Order.NONE);
    if (mode === 'UNTIL') cond = `not (${cond})`;
    gen.indent();
    const body = gen.statementToCode(block, 'DO');
    gen.deindent();
    return `${gen.getIndent()}while ${cond} do\n${body}\n${gen.getIndent()}end`;
  });

  luaGenerator.addGenerator('controls_for', (block, gen) => {
    const varName = (block.getFieldValue('VAR') || 'i').replace(/[^a-zA-Z0-9_]/g, '_');
    const from = gen.valueToCode(block, 'FROM', Order.NONE);
    const to = gen.valueToCode(block, 'TO', Order.NONE);
    const by = gen.valueToCode(block, 'BY', Order.NONE);
    gen.indent();
    const body = gen.statementToCode(block, 'DO');
    gen.deindent();
    return `${gen.getIndent()}for ${varName} = ${from}, ${to}, ${by} do\n${body}\n${gen.getIndent()}end`;
  });

  luaGenerator.addGenerator('controls_forEach', (block, gen) => {
    const varName = (block.getFieldValue('VAR') || 'item').replace(/[^a-zA-Z0-9_]/g, '_');
    const list = gen.valueToCode(block, 'LIST', Order.NONE);
    gen.indent();
    const body = gen.statementToCode(block, 'DO');
    gen.deindent();
    return `${gen.getIndent()}for _, ${varName} in ipairs(${list}) do\n${body}\n${gen.getIndent()}end`;
  });

  luaGenerator.addGenerator('controls_flow_statements', (block, gen) => {
    const flow = block.getFieldValue('FLOW');
    return `${gen.getIndent()}${flow === 'BREAK' ? 'break' : 'return'}`;
  });

  // =================================================================
  // Built-in Blockly blocks: Conditionals
  // =================================================================

  luaGenerator.addGenerator('controls_if', (block, gen) => {
    let code = '';
    let n = 0;
    while (block.getInput(`IF${n}`)) {
      const cond = gen.valueToCode(block, `IF${n}`, Order.NONE);
      gen.indent();
      const body = gen.statementToCode(block, `DO${n}`);
      gen.deindent();
      const keyword = n === 0 ? 'if' : 'elseif';
      code += `${gen.getIndent()}${keyword} ${cond} then\n${body}\n`;
      n++;
    }
    if (block.getInput('ELSE')) {
      gen.indent();
      const elseBody = gen.statementToCode(block, 'ELSE');
      gen.deindent();
      code += `${gen.getIndent()}else\n${elseBody}\n`;
    }
    code += `${gen.getIndent()}end`;
    return code;
  });

  // =================================================================
  // Built-in Blockly blocks: Lists
  // =================================================================

  luaGenerator.addGenerator('lists_create_with', (block, gen) => {
    const count = (block as any).itemCount_ || 0;
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      items.push(gen.valueToCode(block, `ADD${i}`, Order.NONE));
    }
    return [`{${items.join(', ')}}`, Order.ATOMIC];
  });

  luaGenerator.addGenerator('lists_length', (block, gen) => {
    const list = gen.valueToCode(block, 'VALUE', Order.HIGH);
    return [`#${list}`, Order.HIGH];
  });

  luaGenerator.addGenerator('lists_getIndex', (block, gen) => {
    const list = gen.valueToCode(block, 'VALUE', Order.ATOMIC);
    const index = gen.valueToCode(block, 'AT', Order.NONE);
    return [`${list}[${index}]`, Order.ATOMIC];
  });

  // =================================================================
  // Built-in Blockly blocks: Procedures
  // =================================================================

  luaGenerator.addGenerator('procedures_defnoreturn', (block, gen) => {
    const name = (block.getFieldValue('NAME') || 'myFunc').replace(/[^a-zA-Z0-9_]/g, '_');
    const args = ((block as any).arguments_ || [])
      .map((a: string) => a.replace(/[^a-zA-Z0-9_]/g, '_'));
    const paramList = args.join(', ');
    gen.indent();
    const body = gen.statementToCode(block, 'STACK');
    gen.deindent();
    return `${gen.getIndent()}local function ${name}(${paramList})\n${body}\n${gen.getIndent()}end`;
  });

  luaGenerator.addGenerator('procedures_defreturn', (block, gen) => {
    const name = (block.getFieldValue('NAME') || 'myFunc').replace(/[^a-zA-Z0-9_]/g, '_');
    const args = ((block as any).arguments_ || [])
      .map((a: string) => a.replace(/[^a-zA-Z0-9_]/g, '_'));
    const paramList = args.join(', ');
    gen.indent();
    const body = gen.statementToCode(block, 'STACK');
    const ret = gen.valueToCode(block, 'RETURN', Order.NONE);
    gen.deindent();
    return `${gen.getIndent()}local function ${name}(${paramList})\n${body}\n${gen.getIndent()}  return ${ret}\n${gen.getIndent()}end`;
  });

  luaGenerator.addGenerator('procedures_callnoreturn', (block, gen) => {
    const name = (block.getFieldValue('PROCNAME') || block.getFieldValue('NAME') || 'myFunc').replace(/[^a-zA-Z0-9_]/g, '_');
    const args: string[] = [];
    for (let i = 0; block.getInput('ARG' + i); i++) {
      args.push(gen.valueToCode(block, 'ARG' + i, Order.NONE));
    }
    return `${name}(${args.join(', ')})`;
  });

  luaGenerator.addGenerator('procedures_callreturn', (block, gen) => {
    const name = (block.getFieldValue('PROCNAME') || block.getFieldValue('NAME') || 'myFunc').replace(/[^a-zA-Z0-9_]/g, '_');
    const args: string[] = [];
    for (let i = 0; block.getInput('ARG' + i); i++) {
      args.push(gen.valueToCode(block, 'ARG' + i, Order.NONE));
    }
    return [`${name}(${args.join(', ')})`, Order.ATOMIC];
  });

  // =================================================================
  // Lexical Variables plugin blocks
  // =================================================================

  // Helper: strip prefix from lexical variable names (e.g. "global myVar" -> "myVar")
  function stripVarPrefix(raw: string): string {
    // The plugin prefixes names like "global varName" or "input paramName"
    const prefixes = ['global ', 'input ', 'local ', 'counter ', 'item '];
    for (const p of prefixes) {
      if (raw.startsWith(p)) return raw.substring(p.length);
    }
    return raw;
  }
  function sanitizeVar(raw: string): string {
    return stripVarPrefix(raw).replace(/[^a-zA-Z0-9_]/g, '_');
  }

  luaGenerator.addGenerator('global_declaration', (block, gen) => {
    const name = sanitizeVar(block.getFieldValue('NAME') || 'myVar');
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    return `${name} = ${value}`;
  });

  luaGenerator.addGenerator('lexical_variable_get', (block) => {
    const name = sanitizeVar(block.getFieldValue('VAR') || 'x');
    return [name, Order.ATOMIC];
  });

  luaGenerator.addGenerator('lexical_variable_set', (block, gen) => {
    const name = sanitizeVar(block.getFieldValue('VAR') || 'x');
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    return `${name} = ${value}`;
  });

  luaGenerator.addGenerator('local_declaration_statement', (block, gen) => {
    const lines: string[] = [];
    for (let i = 0; block.getInput('DECL' + i); i++) {
      const varName = sanitizeVar(block.getFieldValue('VAR' + i) || `var${i}`);
      const value = gen.valueToCode(block, 'DECL' + i, Order.NONE);
      lines.push(`${gen.getIndent()}local ${varName} = ${value}`);
    }
    gen.indent();
    const body = gen.statementToCode(block, 'STACK');
    gen.deindent();
    return lines.join('\n') + '\n' + body;
  });

  luaGenerator.addGenerator('local_declaration_expression', (block, gen) => {
    const decls: string[] = [];
    for (let i = 0; block.getInput('DECL' + i); i++) {
      const varName = sanitizeVar(block.getFieldValue('VAR' + i) || `var${i}`);
      const value = gen.valueToCode(block, 'DECL' + i, Order.NONE);
      decls.push(`local ${varName} = ${value}`);
    }
    const returnVal = gen.valueToCode(block, 'RETURN', Order.NONE);
    // Expression blocks need to return a value; wrap locals + return in a do-end
    const code = `(function()\n  ${decls.join('\n  ')}\n  return ${returnVal}\nend)()`;
    return [code, Order.ATOMIC];
  });

  luaGenerator.addGenerator('simple_local_declaration_statement', (block, gen) => {
    const varName = sanitizeVar(block.getFieldValue('VAR') || 'x');
    const value = gen.valueToCode(block, 'DECL', Order.NONE);
    gen.indent();
    const body = gen.statementToCode(block, 'DO');
    gen.deindent();
    return `${gen.getIndent()}local ${varName} = ${value}\n${body}`;
  });

  luaGenerator.addGenerator('controls_do_then_return', (block, gen) => {
    gen.indent();
    const stm = gen.statementToCode(block, 'STM');
    gen.deindent();
    const value = gen.valueToCode(block, 'VALUE', Order.NONE);
    const code = `(function()\n${stm}\n  return ${value}\nend)()`;
    return [code, Order.ATOMIC];
  });
}
