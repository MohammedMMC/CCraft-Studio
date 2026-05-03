import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const terminalBlocks: Block = {
    'term_write': {
        block: {
            init() {
                this.appendValueInput('TEXT')
                    .appendField('write');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Write text at the current cursor position');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return `${gen.getIndent()}term.write(${text})`;
        }
    },
    'term_print': {
        block: {
            init() {
                this.appendValueInput('TEXT')
                    .appendField('print');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Print a value to the terminal with a newline');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return `${gen.getIndent()}term.print(${text})`;
        }
    },
    'term_redirect': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL')
                    .appendField('redirect');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Redirects terminal output (ex: monitor)');
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.NONE);
            return `${gen.getIndent()}term.redirect(peripheral.find(${peripheral}))`;
        }
    },
    'term_read': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('read user input');
                this.setOutput(true, 'String');
                this.setStyle('terminal_blocks');
                this.setTooltip('Read a line of text input from the user');
            },
        },
        generator: (block, gen) => {
            return [`term.read()`, Order.ATOMIC];
        }
    },
    'term_clear': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('clear');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Clear the entire terminal');
            },
        },
        generator: (block, gen) => {
            return `${gen.getIndent()}term.clear()`;
        }
    },
    'term_clearLine': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('clear line');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Clear the current line');
            },
        },
        generator: (block, gen) => {
            return `${gen.getIndent()}term.clearLine()`;
        }
    },
    'term_setCursorPos': {
        block: {
            init() {
                this.appendValueInput('X').setCheck('Number')
                    .appendField('set cursor to x');
                this.appendValueInput('Y').setCheck('Number')
                    .appendField('y');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setInputsInline(true);
                this.setTooltip('Set the cursor position');
            },
        },
        generator: (block, gen) => {
            const x = gen.valueToCode(block, 'X', Order.NONE);
            const y = gen.valueToCode(block, 'Y', Order.NONE);
            return `${gen.getIndent()}term.setCursorPos(${x}, ${y})`;
        }
    },
    'term_setCursorBlink': {
        block: {
            init() {
                this.appendValueInput('BOOL').setCheck('Boolean')
                    .appendField('set cursor blink');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Enable or disable cursor blinking');
            },
        },
        generator: (block, gen) => {
            const blink = gen.valueToCode(block, 'BOOL', Order.NONE);
            return `${gen.getIndent()}term.setCursorBlink(${blink})`;
        }
    },
    'term_setTextColor': {
        block: {
            init() {
                this.appendValueInput('COLOR').setCheck('Color')
                    .appendField('set text color');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Set the terminal text color');
            },
        },
        generator: (block, gen) => {
            const color = gen.valueToCode(block, 'COLOR', Order.NONE);
            return `${gen.getIndent()}term.setTextColor(${color})`;
        }
    },
    'term_setBgColor': {
        block: {
            init() {
                this.appendValueInput('COLOR').setCheck('Color')
                    .appendField('set background color');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Set the terminal background color');
            },
        },
        generator: (block, gen) => {
            const color = gen.valueToCode(block, 'COLOR', Order.NONE);
            return `${gen.getIndent()}term.setBackgroundColor(${color})`;
        }
    },
    'term_getBgColor': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('background color');
                this.setOutput(true, 'Number');
                this.setStyle('terminal_blocks');
                this.setTooltip('Get the current terminal background color');
            },
        },
        generator: (block, gen) => {
            return [`term.getBackgroundColor()`, Order.ATOMIC];
        }
    },
    'term_scroll': {
        block: {
            init() {
                this.appendValueInput('NUMBER').setCheck('Number')
                    .appendField('scroll by');
                this.appendDummyInput()
                    .appendField('lines');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setTooltip('Scroll the terminal by N lines');
            },
        },
        generator: (block, gen) => {
            const n = gen.valueToCode(block, 'N', Order.NONE);
            return `${gen.getIndent()}term.scroll(${n})`;
        }
    },
    'term_blit': {
        block: {
            init() {
                this.appendValueInput('TEXT').setCheck('String')
                    .appendField('blit text');
                this.appendValueInput('FG').setCheck('Color')
                    .appendField('fg');
                this.appendValueInput('BG').setCheck('Color')
                    .appendField('bg');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('terminal_blocks');
                this.setInputsInline(true);
                this.setTooltip('Write text with per-character foreground and background colors');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            const fg = gen.valueToCode(block, 'FG', Order.NONE);
            const bg = gen.valueToCode(block, 'BG', Order.NONE);
            return `${gen.getIndent()}term.blit(${text}, ${fg}, ${bg})`;
        }
    },
    'term_getWidth': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('terminal width');
                this.setOutput(true, 'Number');
                this.setStyle('terminal_blocks');
                this.setTooltip('Get the width of the terminal in characters');
            },
        },
        generator: (block, gen) => {
            return [`({term.getSize()})`, Order.ATOMIC];
        }
    },
    'term_getHeight': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('terminal height');
                this.setOutput(true, 'Number');
                this.setStyle('terminal_blocks');
                this.setTooltip('Get the height of the terminal in characters');
            },
        },
        generator: (block, gen) => {
            return [`select(2, term.getSize())`, Order.ATOMIC];
        }
    },
    'term_getCursorX': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('cursor x');
                this.setOutput(true, 'Number');
                this.setStyle('terminal_blocks');
                this.setTooltip('Get the x position of the cursor');
            },
        },
        generator: (block, gen) => {
            return [`({term.getCursorPos()})`, Order.ATOMIC];
        }
    },
    'term_getCursorY': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('cursor y');
                this.setOutput(true, 'Number');
                this.setStyle('terminal_blocks');
                this.setTooltip('Get the y position of the cursor');
            },
        },
        generator: (block, gen) => {
            return [`select(2, term.getCursorPos())`, Order.ATOMIC];
        }
    },
    'term_getTextColor': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('text color');
                this.setOutput(true, 'Number');
                this.setStyle('terminal_blocks');
                this.setTooltip('Get the current terminal text color');
            },
        },
        generator: (block, gen) => {
            return [`term.getTextColor()`, Order.ATOMIC];
        }
    },
    'term_isColor': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('terminal supports color?');
                this.setOutput(true, 'Boolean');
                this.setStyle('terminal_blocks');
                this.setTooltip('Check if the terminal supports color');
            },
        },
        generator: (block, gen) => {
            return [`term.isColor()`, Order.ATOMIC];
        }
    }
};