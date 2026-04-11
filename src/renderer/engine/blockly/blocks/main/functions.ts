import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const functionsBlocks: Block = {
    'procedures_defnoreturn': {
        block: {},
        generator: (block, gen) => {
            const name = (block.getFieldValue('NAME') || 'myFunc').replace(/[^a-zA-Z0-9_]/g, '_');
            const args = ((block as any).arguments_ || [])
                .map((a: string) => a.replace(/[^a-zA-Z0-9_]/g, '_'));
            const paramList = args.join(', ');
            gen.indent();
            const body = gen.statementToCode(block, 'STACK');
            gen.deindent();
            return `${gen.getIndent()}local function ${name}(${paramList})\n${body}\n${gen.getIndent()}end`;
        }
    },
    'procedures_defreturn': {
        block: {},
        generator: (block, gen) => {
            const name = (block.getFieldValue('NAME') || 'myFunc').replace(/[^a-zA-Z0-9_]/g, '_');
            const args = ((block as any).arguments_ || [])
                .map((a: string) => a.replace(/[^a-zA-Z0-9_]/g, '_'));
            const paramList = args.join(', ');
            gen.indent();
            const body = gen.statementToCode(block, 'STACK');
            const ret = gen.valueToCode(block, 'RETURN', Order.NONE);
            gen.deindent();
            return `${gen.getIndent()}local function ${name}(${paramList})\n${body}\n${gen.getIndent()}  return ${ret}\n${gen.getIndent()}end`;
        }
    },
    'procedures_callnoreturn': {
        block: {},
        generator: (block, gen) => {
            const name = (block.getFieldValue('PROCNAME') || block.getFieldValue('NAME') || 'myFunc').replace(/[^a-zA-Z0-9_]/g, '_');
            const args: string[] = [];
            for (let i = 0; block.getInput('ARG' + i); i++) {
                args.push(gen.valueToCode(block, 'ARG' + i, Order.NONE));
            }
            return `${name}(${args.join(', ')})`;
        }
    },
    'procedures_callreturn': {
        block: {},
        generator: (block, gen) => {
            const name = (block.getFieldValue('PROCNAME') || block.getFieldValue('NAME') || 'myFunc').replace(/[^a-zA-Z0-9_]/g, '_');
            const args: string[] = [];
            for (let i = 0; block.getInput('ARG' + i); i++) {
                args.push(gen.valueToCode(block, 'ARG' + i, Order.NONE));
            }
            return [`${name}(${args.join(', ')})`, Order.ATOMIC];
        }
    }
};