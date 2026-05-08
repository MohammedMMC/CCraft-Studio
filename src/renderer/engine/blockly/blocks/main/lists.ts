import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const listsBlocks: Blocks = {
    'lists_create_with': {
        generator: (block, gen) => {
            const count = (block as any).itemCount_ || 0;
            const items: string[] = [];
            for (let i = 0; i < count; i++) {
                items.push(gen.valueToCode(block, `ADD${i}`, Order.NONE));
            }
            return [`{${items.join(', ')}}`, Order.ATOMIC];
        }
    },
    'lists_length': {
        generator: (block, gen) => {
            const list = gen.valueToCode(block, 'VALUE', Order.HIGH);
            return [`#${list}`, Order.HIGH];
        }
    },
    'lists_getIndex': {
        generator: (block, gen) => {
            const list = gen.valueToCode(block, 'VALUE', Order.ATOMIC);
            const index = gen.valueToCode(block, 'AT', Order.NONE);
            return [`${list}[${index}]`, Order.ATOMIC];
        }
    }
};