import * as Blockly from 'blockly';
import { eventsBlocksGenerators } from './blocks/custom/events';
import { uiActionsBlocksGenerators } from './blocks/custom/uiActions';
import { terminalBlocksGenerators } from './blocks/custom/terminal';
import { redstoneBlocksGenerators } from './blocks/custom/redstone';
import { filesBlocksGenerators } from './blocks/custom/files';
import { httpBlocksGenerators } from './blocks/custom/http';
import { peripheralBlocksGenerators } from './blocks/custom/peripheral';
import { turtleBlocksGenerators } from './blocks/custom/turtle';
import { systemBlocksGenerators } from './blocks/custom/system';
import { rednetBlocksGenerators } from './blocks/custom/rednet';
import { textUtilsBlocksGenerators } from './blocks/custom/textUtils';
import { paintUtilsBlocksGenerators } from './blocks/custom/paintUtils';
import { windowBlocksGenerators } from './blocks/custom/window';
import { settingsBlocksGenerators } from './blocks/custom/settings';
import { gpsBlocksGenerators } from './blocks/custom/gps';
import { diskBlocksGenerators } from './blocks/custom/disk';
import { utilityBlocksGenerators } from './blocks/custom/utility';
import { logicBlocksGenerators } from './blocks/main/logic';
import { mathBlocksGenerators } from './blocks/main/math';
import { textBlocksGenerators } from './blocks/main/text';
import { colorsBlocksGenerators } from './blocks/main/colors';
import { variablesBlocksGenerators } from './blocks/main/variables';
import { controlBlocksGenerators } from './blocks/main/control';
import { listsBlocksGenerators } from './blocks/main/lists';
import { functionsBlocksGenerators } from './blocks/main/functions';
import { pluginsBlocksGenerators } from './blocks/main/plugins';

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

export type GeneratorFunc = (block: Blockly.Block, generator: LuaGen) => string | [string, number];

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

export function registerAllGenerators() {
  registerGenerators(eventsBlocksGenerators);
  registerGenerators(uiActionsBlocksGenerators);
  registerGenerators(terminalBlocksGenerators);
  registerGenerators(redstoneBlocksGenerators);
  registerGenerators(filesBlocksGenerators);
  registerGenerators(httpBlocksGenerators);
  registerGenerators(peripheralBlocksGenerators);
  registerGenerators(turtleBlocksGenerators);
  registerGenerators(systemBlocksGenerators);
  registerGenerators(rednetBlocksGenerators);
  registerGenerators(textUtilsBlocksGenerators);
  registerGenerators(paintUtilsBlocksGenerators);
  registerGenerators(windowBlocksGenerators);
  registerGenerators(settingsBlocksGenerators);
  registerGenerators(gpsBlocksGenerators);
  registerGenerators(diskBlocksGenerators);
  registerGenerators(utilityBlocksGenerators);

  registerGenerators(logicBlocksGenerators);
  registerGenerators(mathBlocksGenerators);
  registerGenerators(textBlocksGenerators);
  registerGenerators(colorsBlocksGenerators);
  registerGenerators(variablesBlocksGenerators);
  registerGenerators(controlBlocksGenerators);
  registerGenerators(listsBlocksGenerators);
  registerGenerators(functionsBlocksGenerators);
  registerGenerators(pluginsBlocksGenerators);
}

function registerGenerators(generators: Record<string, GeneratorFunc>) {
  for (const key in generators) {
    luaGenerator.addGenerator(key, generators[key]);
  }
}