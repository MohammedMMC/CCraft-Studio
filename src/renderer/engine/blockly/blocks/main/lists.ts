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
            return [`({${items.join(', ')}})`, Order.ATOMIC];
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
            return [`(${list})[${index}]`, Order.ATOMIC];
        }
    },
    'lists_repeat': {
        generator: (block, gen) => {
            const item = gen.valueToCode(block, 'ITEM', Order.NONE);
            const count = gen.valueToCode(block, 'NUM', Order.NONE);
            return [`table.create(${count}, ${item})`, Order.ATOMIC];
        }
    },
    'lists_reverse': {
        generator: (block, gen) => {
            const list = gen.valueToCode(block, 'LIST', Order.ATOMIC);
            return [`list_reverse(${list})`, Order.ATOMIC];
        }
    },
    'lists_isEmpty': {
        generator: (block, gen) => {
            const list = gen.valueToCode(block, 'VALUE', Order.ATOMIC);
            return [`(#(${list}) == 0)`, Order.ATOMIC];
        }
    },
    'lists_setIndex': {
        generator: (block, gen) => {
            const list = gen.valueToCode(block, 'LIST', Order.ATOMIC);
            const index = gen.valueToCode(block, 'AT', Order.NONE);
            const item = gen.valueToCode(block, 'TO', Order.NONE);
            return [`${list}[${index}] = ${item}`, Order.ATOMIC];
        }
    },
    'lists_indexOf': {
        generator: (block, gen) => {
            const mode = block.getFieldValue('END');
            const list = gen.valueToCode(block, 'VALUE', Order.NONE);
            const value = gen.valueToCode(block, 'FIND', Order.NONE);
            return [`list_indexOf(${list}, ${value}, ${mode === "FIRST" ? 0 : 1})`, Order.ATOMIC];
        }
    },
    'lists_getSublist': {
        generator: (block, gen) => {
            const list = gen.valueToCode(block, 'LIST', Order.NONE);
            const AT1 = gen.valueToCode(block, 'AT1', Order.NONE);
            const AT2 = gen.valueToCode(block, 'AT2', Order.NONE);
            const WHERE1 = block.getFieldValue('WHERE1');
            const WHERE2 = block.getFieldValue('WHERE2');
            return [`list_getSubList(${list}, "${WHERE1}", ${AT1}, "${WHERE2}", ${AT2})`, Order.ATOMIC];
        }
    },
    'lists_split': {
        generator: (block, gen) => {
            const mode = block.getFieldValue('MODE');
            const input = gen.valueToCode(block, 'INPUT', Order.NONE);
            const delimiter = gen.valueToCode(block, 'DELIM', Order.NONE);
            return [`list_joinsplit(${input}, "${mode}", ${delimiter})`, Order.ATOMIC];
        }
    },
    'lists_sort': {
        generator: (block, gen) => {
            console.log(block.inputList);
            const type = block.getFieldValue('TYPE');
            const direction = block.getFieldValue('DIRECTION');
            const list = gen.valueToCode(block, 'LIST', Order.NONE);
            return [`list_sort(${list}, "${type}", ${direction})`, Order.ATOMIC];
        }
    },
};
