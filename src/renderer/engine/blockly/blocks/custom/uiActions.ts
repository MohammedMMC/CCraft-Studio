import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const uiActionsBlocks: Block = {
    'ui_set_prop': {
        block: {},
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            const prop = block.getFieldValue('PROP');
            const color = block.getFieldValue('COLOR');
            return `${gen.getIndent()}getElement("${el}").${prop} = ${color}\n${gen.getIndent()}drawCurrentScreen()`;
        }
    },
    'ui_navigate': {
        block: {},
        generator: (block, gen) => {
            const screen = (block.getFieldValue('SCREEN') || '').replace(/[^a-zA-Z0-9_]/g, '_');
            return `${gen.getIndent()}navigate("${screen}")`;
        }
    },
    'ui_set_progress': {
        block: {},
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            const val = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}getElement("${el}").value = ${val}\n${gen.getIndent()}drawCurrentScreen()`;
        }
    },
    'ui_get_prop': {
        block: {},
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            return [`getElement("${el}").text`, Order.ATOMIC];
        }
    },
    'ui_get_value': {
        block: {},
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            return [`getElement("${el}").value`, Order.ATOMIC];
        }
    }
};