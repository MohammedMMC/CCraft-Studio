import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const textBlocks: Block = {
    'text': {
        block: {},
        generator: (block, gen) => {
            const val = (block.getFieldValue('TEXT') || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            return [`"${val}"`, Order.ATOMIC];
        }
    },
    'text_join': {
        block: {},
        generator: (block, gen) => {
            const count = (block as any).itemCount_ || 2;
            const parts: string[] = [];
            for (let i = 0; i < count; i++) {
                parts.push(gen.valueToCode(block, `ADD${i}`, Order.CONCAT));
            }
            return [parts.join(' .. ') || '""', Order.CONCAT];
        }
    },
    'text_length': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'VALUE', Order.HIGH);
            return [`#${text}`, Order.HIGH];
        }
    }
};