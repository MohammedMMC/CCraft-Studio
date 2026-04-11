import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const redstoneBlocks: Block = {
    'rs_setOutput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const value = block.getFieldValue('VALUE');
            return `${gen.getIndent()}redstone.setOutput("${side}", ${value})`;
        }
    },
    'rs_setAnalogOutput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const value = block.getFieldValue('VALUE');
            return `${gen.getIndent()}redstone.setAnalogOutput("${side}", ${value})`;
        }
    },
    'rs_setBundledOutput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}redstone.setBundledOutput("${side}", ${value})`;
        }
    },
    'rs_getInput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getInput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getOutput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getOutput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getAnalogInput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getAnalogInput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getAnalogOutput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getAnalogOutput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getBundledInput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getBundledInput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_testBundledInput': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const color = block.getFieldValue('COLOR');
            return [`redstone.testBundledInput("${side}", ${color})`, Order.ATOMIC];
        }
    }
};