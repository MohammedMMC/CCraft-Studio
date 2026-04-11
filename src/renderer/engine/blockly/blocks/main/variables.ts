import { GeneratorFunc, Order } from "../../luaGenerator";

export const variablesBlocksGenerators: Record<string, GeneratorFunc> = {
    'variables_get': (block, gen) => {
        const name = block.getFieldValue('VAR') || 'x';
        const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
        return [safeName, Order.ATOMIC];
    },
    'variables_set': (block, gen) => {
        const name = block.getFieldValue('VAR') || 'x';
        const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
        const val = gen.valueToCode(block, 'VALUE', Order.NONE);
        return `${gen.getIndent()}${safeName} = ${val}`;
    }
}