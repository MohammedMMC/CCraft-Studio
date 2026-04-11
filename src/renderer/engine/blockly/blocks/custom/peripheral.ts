import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const peripheralBlocks: Block = {
    'peripheral_call': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const method = block.getFieldValue('METHOD');
            const args = gen.valueToCode(block, 'ARGS', Order.NONE);
            if (args && args !== 'nil') {
                return `${gen.getIndent()}peripheral.call("${side}", "${method}", ${args})`;
            }
            return `${gen.getIndent()}peripheral.call("${side}", "${method}")`;
        }
    },
    'peripheral_wrap': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`peripheral.wrap("${side}")`, Order.ATOMIC];
        }
    },
    'peripheral_find': {
        block: {},
        generator: (block, gen) => {
            const type = block.getFieldValue('TYPE');
            return [`peripheral.find("${type}")`, Order.ATOMIC];
        }
    },
    'peripheral_getType': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`peripheral.getType("${side}")`, Order.ATOMIC];
        }
    },
    'peripheral_isPresent': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`peripheral.isPresent("${side}")`, Order.ATOMIC];
        }
    },
    'peripheral_getMethods': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`peripheral.getMethods("${side}")`, Order.ATOMIC];
        }
    },
    'peripheral_getNames': {
        block: {},
        generator: (block, gen) => {
            return [`peripheral.getNames()`, Order.ATOMIC];
        }
    }
};