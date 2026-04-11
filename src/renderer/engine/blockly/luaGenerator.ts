import * as Blockly from 'blockly';

// Lua order of operations
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