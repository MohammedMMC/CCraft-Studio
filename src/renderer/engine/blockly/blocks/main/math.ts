import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const mathBlocks: Block = {
    'math_number': {
        generator: (block, gen) => {
            return [String(block.getFieldValue('NUM')), Order.ATOMIC];
        }
    },
    'math_arithmetic': {
        generator: (block, gen) => {
            const ops: Record<string, [string, number]> = {
                ADD: ['+', Order.ADD], MINUS: ['-', Order.ADD],
                MULTIPLY: ['*', Order.MULTIPLY], DIVIDE: ['/', Order.MULTIPLY],
                POWER: ['^', Order.EXPONENT], MODULO: ['%', Order.MULTIPLY],
            };
            const [op, order] = ops[block.getFieldValue('OP')] || ['+', Order.ADD];
            const a = gen.valueToCode(block, 'A', order);
            const b = gen.valueToCode(block, 'B', order);
            return [`${a} ${op} ${b}`, order];
        }
    },
    'math_single': {
        generator: (block, gen) => {
            const opMap: Record<string, string> = {
                ROOT: 'math.sqrt', ABS: 'math.abs', NEG: '-',
                LN: 'math.log', LOG10: 'math.log10',
                EXP: 'math.exp', POW10: '10^',
            };
            const op = block.getFieldValue('OP');
            const val = gen.valueToCode(block, 'NUM', Order.HIGH);
            if (op === 'NEG') return [`-${val}`, Order.HIGH];
            return [`${opMap[op] || 'math.abs'}(${val})`, Order.ATOMIC];
        }
    },
    'math_random_int': {
        generator: (block, gen) => {
            const a = gen.valueToCode(block, 'FROM', Order.NONE);
            const b = gen.valueToCode(block, 'TO', Order.NONE);
            return [`math.random(${a}, ${b})`, Order.ATOMIC];
        }
    }
};