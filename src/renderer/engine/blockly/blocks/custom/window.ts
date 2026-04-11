import { GeneratorFunc, Order } from "../../luaGenerator";

export const windowBlocksGenerators: Record<string, GeneratorFunc> = {
    'window_create': (block, gen) => {
        const x = gen.valueToCode(block, 'X', Order.NONE);
        const y = gen.valueToCode(block, 'Y', Order.NONE);
        const w = gen.valueToCode(block, 'W', Order.NONE);
        const h = gen.valueToCode(block, 'H', Order.NONE);
        return [`window.create(term.current(), ${x}, ${y}, ${w}, ${h})`, Order.ATOMIC];
    },
    'window_setVisible': (block, gen) => {
        const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
        const bool = gen.valueToCode(block, 'BOOL', Order.NONE);
        return `${gen.getIndent()}${win}.setVisible(${bool})`;
    },
    'window_reposition': (block, gen) => {
        const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
        const x = gen.valueToCode(block, 'X', Order.NONE);
        const y = gen.valueToCode(block, 'Y', Order.NONE);
        const w = gen.valueToCode(block, 'W', Order.NONE);
        const h = gen.valueToCode(block, 'H', Order.NONE);
        return `${gen.getIndent()}${win}.reposition(${x}, ${y}, ${w}, ${h})`;
    },
    'window_redraw': (block, gen) => {
        const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
        return `${gen.getIndent()}${win}.redraw()`;
    },
    'window_getWidth': (block, gen) => {
        const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
        return [`({${win}.getSize()})`, Order.ATOMIC];
    },
    'window_getHeight': (block, gen) => {
        const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
        return [`select(2, ${win}.getSize())`, Order.ATOMIC];
    },
    'window_getPositionX': (block, gen) => {
        const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
        return [`({${win}.getPosition()})`, Order.ATOMIC];
    },
    'window_getPositionY': (block, gen) => {
        const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
        return [`select(2, ${win}.getPosition())`, Order.ATOMIC];
    },
    'window_isVisible': (block, gen) => {
        const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
        return [`${win}.isVisible()`, Order.ATOMIC];
    }
};