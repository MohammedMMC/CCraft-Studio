import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const textBlocks: Block = {
    'text': {
        generator: (block, gen) => {
            const val = (block.getFieldValue('TEXT') || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            return [`"${val}"`, Order.ATOMIC];
        }
    },
    'text_join': {
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
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'VALUE', Order.HIGH);
            return [`#${text}`, Order.HIGH];
        }
    }
};