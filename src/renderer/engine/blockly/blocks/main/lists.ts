import { GeneratorFunc, Order } from "../../luaGenerator";

export const listsBlocksGenerators: Record<string, GeneratorFunc> = {
    'lists_create_with': (block, gen) => {
        const count = (block as any).itemCount_ || 0;
        const items: string[] = [];
        for (let i = 0; i < count; i++) {
            items.push(gen.valueToCode(block, `ADD${i}`, Order.NONE));
        }
        return [`{${items.join(', ')}}`, Order.ATOMIC];
    },
    'lists_length': (block, gen) => {
        const list = gen.valueToCode(block, 'VALUE', Order.HIGH);
        return [`#${list}`, Order.HIGH];
    },
    'lists_getIndex': (block, gen) => {
        const list = gen.valueToCode(block, 'VALUE', Order.ATOMIC);
        const index = gen.valueToCode(block, 'AT', Order.NONE);
        return [`${list}[${index}]`, Order.ATOMIC];
    }
}