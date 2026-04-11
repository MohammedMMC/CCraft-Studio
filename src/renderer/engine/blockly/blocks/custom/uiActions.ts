import { GeneratorFunc, Order } from "../../luaGenerator";

export const uiActionsBlocksGenerators: Record<string, GeneratorFunc> = {
    'ui_set_prop': (block, gen) => {
        const el = block.getFieldValue('ELEMENT');
        const prop = block.getFieldValue('PROP');
        const color = block.getFieldValue('COLOR');
        return `${gen.getIndent()}getElement("${el}").${prop} = ${color}\n${gen.getIndent()}drawCurrentScreen()`;
    },
    'ui_navigate': (block, gen) => {
        const screen = (block.getFieldValue('SCREEN') || '').replace(/[^a-zA-Z0-9_]/g, '_');
        return `${gen.getIndent()}navigate("${screen}")`;
    },
    'ui_set_progress': (block, gen) => {
        const el = block.getFieldValue('ELEMENT');
        const val = gen.valueToCode(block, 'VALUE', Order.NONE);
        return `${gen.getIndent()}getElement("${el}").value = ${val}\n${gen.getIndent()}drawCurrentScreen()`;
    },
    'ui_get_prop': (block) => {
        const el = block.getFieldValue('ELEMENT');
        return [`getElement("${el}").text`, Order.ATOMIC];
    },
    'ui_get_value': (block) => {
        const el = block.getFieldValue('ELEMENT');
        return [`getElement("${el}").value`, Order.ATOMIC];
    }
};