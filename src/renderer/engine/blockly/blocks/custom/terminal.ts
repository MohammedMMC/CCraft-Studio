import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const terminalBlocks: Block = {
    'term_write': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return `${gen.getIndent()}term.write(${text})`;
        }
    },
    'term_clear': {
        block: {},
        generator: (block, gen) => {
            return `${gen.getIndent()}term.clear()`;
        }
    },
    'term_clearLine': {
        block: {},
        generator: (block, gen) => {
            return `${gen.getIndent()}term.clearLine()`;
        }
    },
    'term_setCursorPos': {
        block: {},
        generator: (block, gen) => {
            const x = gen.valueToCode(block, 'X', Order.NONE);
            const y = gen.valueToCode(block, 'Y', Order.NONE);
            return `${gen.getIndent()}term.setCursorPos(${x}, ${y})`;
        }
    },
    'term_setCursorBlink': {
        block: {},
        generator: (block, gen) => {
            const blink = gen.valueToCode(block, 'BOOL', Order.NONE);
            return `${gen.getIndent()}term.setCursorBlink(${blink})`;
        }
    },
    'term_setTextColor': {
        block: {},
        generator: (block, gen) => {
            const color = block.getFieldValue('COLOR');
            return `${gen.getIndent()}term.setTextColor(${color})`;
        }
    },
    'term_setBgColor': {
        block: {},
        generator: (block, gen) => {
            const color = block.getFieldValue('COLOR');
            return `${gen.getIndent()}term.setBackgroundColor(${color})`;
        }
    },
    'term_scroll': {
        block: {},
        generator: (block, gen) => {
            const n = gen.valueToCode(block, 'N', Order.NONE);
            return `${gen.getIndent()}term.scroll(${n})`;
        }
    },
    'term_blit': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            const fg = gen.valueToCode(block, 'FG', Order.NONE);
            const bg = gen.valueToCode(block, 'BG', Order.NONE);
            return `${gen.getIndent()}term.blit(${text}, ${fg}, ${bg})`;
        }
    },
    'term_getWidth': {
        block: {},
        generator: (block, gen) => {
            return [`({term.getSize()})`, Order.ATOMIC];
        }
    },
    'term_getHeight': {
        block: {},
        generator: (block, gen) => {
            return [`select(2, term.getSize())`, Order.ATOMIC];
        }
    },
    'term_getCursorX': {
        block: {},
        generator: (block, gen) => {
            return [`({term.getCursorPos()})`, Order.ATOMIC];
        }
    },
    'term_getCursorY': {
        block: {},
        generator: (block, gen) => {
            return [`select(2, term.getCursorPos())`, Order.ATOMIC];
        }
    },
    'term_getTextColor': {
        block: {},
        generator: (block, gen) => {
            return [`term.getTextColor()`, Order.ATOMIC];
        }
    },
    'term_getBgColor': {
        block: {},
        generator: (block, gen) => {
            return [`term.getBackgroundColor()`, Order.ATOMIC];
        }
    },
    'term_isColor': {
        block: {},
        generator: (block, gen) => {
            return [`term.isColor()`, Order.ATOMIC];
        }
    }
};