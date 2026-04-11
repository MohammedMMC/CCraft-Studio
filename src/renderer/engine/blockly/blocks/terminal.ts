import { GeneratorFunc, Order } from "../luaGenerator";

export const terminalBlocksGenerators: Record<string, GeneratorFunc> = {
    'term_write': (block, gen) => {
        const text = gen.valueToCode(block, 'TEXT', Order.NONE);
        return `${gen.getIndent()}term.write(${text})`;
    },
    'term_clear': (_block, gen) => {
        return `${gen.getIndent()}term.clear()`;
    },
    'term_clearLine': (_block, gen) => {
        return `${gen.getIndent()}term.clearLine()`;
    },
    'term_setCursorPos': (block, gen) => {
        const x = gen.valueToCode(block, 'X', Order.NONE);
        const y = gen.valueToCode(block, 'Y', Order.NONE);
        return `${gen.getIndent()}term.setCursorPos(${x}, ${y})`;
    },
    'term_setCursorBlink': (block, gen) => {
        const blink = gen.valueToCode(block, 'BOOL', Order.NONE);
        return `${gen.getIndent()}term.setCursorBlink(${blink})`;
    },
    'term_setTextColor': (block, gen) => {
        const color = block.getFieldValue('COLOR');
        return `${gen.getIndent()}term.setTextColor(${color})`;
    },
    'term_setBgColor': (block, gen) => {
        const color = block.getFieldValue('COLOR');
        return `${gen.getIndent()}term.setBackgroundColor(${color})`;
    },
    'term_scroll': (block, gen) => {
        const n = gen.valueToCode(block, 'N', Order.NONE);
        return `${gen.getIndent()}term.scroll(${n})`;
    },
    'term_blit': (block, gen) => {
        const text = gen.valueToCode(block, 'TEXT', Order.NONE);
        const fg = gen.valueToCode(block, 'FG', Order.NONE);
        const bg = gen.valueToCode(block, 'BG', Order.NONE);
        return `${gen.getIndent()}term.blit(${text}, ${fg}, ${bg})`;
    },
    'term_getWidth': () => {
        return [`({term.getSize()})`, Order.ATOMIC];
    },
    'term_getHeight': () => {
        return [`select(2, term.getSize())`, Order.ATOMIC];
    },
    'term_getCursorX': () => {
        return [`({term.getCursorPos()})`, Order.ATOMIC];
    },
    'term_getCursorY': () => {
        return [`select(2, term.getCursorPos())`, Order.ATOMIC];
    },
    'term_getTextColor': () => {
        return [`term.getTextColor()`, Order.ATOMIC];
    },
    'term_getBgColor': () => {
        return [`term.getBackgroundColor()`, Order.ATOMIC];
    },
    'term_isColor': () => {
        return [`term.isColor()`, Order.ATOMIC];
    }
};