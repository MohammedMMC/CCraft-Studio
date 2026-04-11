import { GeneratorFunc, Order } from "../../luaGenerator";

export const peripheralBlocksGenerators: Record<string, GeneratorFunc> = {
    'peripheral_call': (block, gen) => {
        const side = block.getFieldValue('SIDE');
        const method = block.getFieldValue('METHOD');
        const args = gen.valueToCode(block, 'ARGS', Order.NONE);
        if (args && args !== 'nil') {
            return `${gen.getIndent()}peripheral.call("${side}", "${method}", ${args})`;
        }
        return `${gen.getIndent()}peripheral.call("${side}", "${method}")`;
    },
    'peripheral_wrap': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`peripheral.wrap("${side}")`, Order.ATOMIC];
    },
    'peripheral_find': (block) => {
        const type = block.getFieldValue('TYPE');
        return [`peripheral.find("${type}")`, Order.ATOMIC];
    },
    'peripheral_getType': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`peripheral.getType("${side}")`, Order.ATOMIC];
    },
    'peripheral_isPresent': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`peripheral.isPresent("${side}")`, Order.ATOMIC];
    },
    'peripheral_getMethods': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`peripheral.getMethods("${side}")`, Order.ATOMIC];
    },
    'peripheral_getNames': () => {
        return [`peripheral.getNames()`, Order.ATOMIC];
    }
};