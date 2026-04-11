import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const settingsBlocks: Block = {
    'settings_set': {
        block: {},
        generator: (block, gen) => {
            const name = block.getFieldValue('NAME');
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}settings.set("${name}", ${value})`;
        }
    },
    'settings_unset': {
        block: {},
        generator: (block, gen) => {
            const name = block.getFieldValue('NAME');
            return `${gen.getIndent()}settings.unset("${name}")`;
        }
    },
    'settings_save': {
        block: {},
        generator: (block, gen) => {
            const path = block.getFieldValue('PATH');
            return `${gen.getIndent()}settings.save("${path}")`;
        }
    },
    'settings_load': {
        block: {},
        generator: (block, gen) => {
            const path = block.getFieldValue('PATH');
            return `${gen.getIndent()}settings.load("${path}")`;
        }
    },
    'settings_get': {
        block: {},
        generator: (block, gen) => {
            const name = block.getFieldValue('NAME');
            const def = gen.valueToCode(block, 'DEFAULT', Order.NONE);
            return [`settings.get("${name}", ${def})`, Order.ATOMIC];
        }
    }
};