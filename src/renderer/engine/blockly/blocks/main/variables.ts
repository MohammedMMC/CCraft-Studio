import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const variablesBlocks: Blocks = {
    'variables_get': {
        generator: (block, gen) => {
            const name = block.getFieldValue('VAR') || 'x';
            const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
            return [`variable_${safeName}`, Order.ATOMIC];
        }
    },
    'variables_set': {
        generator: (block, gen) => {
            const name = block.getFieldValue('VAR') || 'x';
            const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
            const val = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}variable_${safeName} = ${val}`;
        }
    }
};