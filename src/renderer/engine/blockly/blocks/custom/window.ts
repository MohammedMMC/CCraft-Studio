import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const windowBlocks: Block = {
    'window_create': {
        block: {},
        generator: (block, gen) => {
            const x = gen.valueToCode(block, 'X', Order.NONE);
            const y = gen.valueToCode(block, 'Y', Order.NONE);
            const w = gen.valueToCode(block, 'W', Order.NONE);
            const h = gen.valueToCode(block, 'H', Order.NONE);
            return [`window.create(term.current(), ${x}, ${y}, ${w}, ${h})`, Order.ATOMIC];
        }
    },
    'window_setVisible': {
        block: {},
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            const bool = gen.valueToCode(block, 'BOOL', Order.NONE);
            return `${gen.getIndent()}${win}.setVisible(${bool})`;
        }
    },
    'window_reposition': {
        block: {},
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            const x = gen.valueToCode(block, 'X', Order.NONE);
            const y = gen.valueToCode(block, 'Y', Order.NONE);
            const w = gen.valueToCode(block, 'W', Order.NONE);
            const h = gen.valueToCode(block, 'H', Order.NONE);
            return `${gen.getIndent()}${win}.reposition(${x}, ${y}, ${w}, ${h})`;
        }
    },
    'window_redraw': {
        block: {},
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return `${gen.getIndent()}${win}.redraw()`;
        }
    },
    'window_getWidth': {
        block: {},
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`({${win}.getSize()})`, Order.ATOMIC];
        }
    },
    'window_getHeight': {
        block: {},
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`select(2, ${win}.getSize())`, Order.ATOMIC];
        }
    },
    'window_getPositionX': {
        block: {},
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`({${win}.getPosition()})`, Order.ATOMIC];
        }
    },
    'window_getPositionY': {
        block: {},
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`select(2, ${win}.getPosition())`, Order.ATOMIC];
        }
    },
    'window_isVisible': {
        block: {},
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`${win}.isVisible()`, Order.ATOMIC];
        }
    }
};