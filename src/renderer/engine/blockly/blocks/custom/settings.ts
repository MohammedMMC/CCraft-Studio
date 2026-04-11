import { GeneratorFunc, Order } from "../../luaGenerator";

export const settingsBlocksGenerators: Record<string, GeneratorFunc> = {
    'settings_set': (block, gen) => {
        const name = block.getFieldValue('NAME');
        const value = gen.valueToCode(block, 'VALUE', Order.NONE);
        return `${gen.getIndent()}settings.set("${name}", ${value})`;
    },
    'settings_unset': (block, gen) => {
        const name = block.getFieldValue('NAME');
        return `${gen.getIndent()}settings.unset("${name}")`;
    },
    'settings_save': (block, gen) => {
        const path = block.getFieldValue('PATH');
        return `${gen.getIndent()}settings.save("${path}")`;
    },
    'settings_load': (block, gen) => {
        const path = block.getFieldValue('PATH');
        return `${gen.getIndent()}settings.load("${path}")`;
    },
    'settings_get': (block, gen) => {
        const name = block.getFieldValue('NAME');
        const def = gen.valueToCode(block, 'DEFAULT', Order.NONE);
        return [`settings.get("${name}", ${def})`, Order.ATOMIC];
    }
};