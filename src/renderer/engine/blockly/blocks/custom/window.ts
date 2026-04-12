import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const windowBlocks: Block = {
    'window_create': {
        block: {
            init() {
                this.appendValueInput('X').setCheck('Number')
                    .appendField('create window at x:');
                this.appendValueInput('Y').setCheck('Number')
                    .appendField('y:');
                this.appendValueInput('W').setCheck('Number')
                    .appendField('w:');
                this.appendValueInput('H').setCheck('Number')
                    .appendField('h:');
                this.setOutput(true, null);
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Create a new window on the current terminal');
            },
        },
        generator: (block, gen) => {
            const x = gen.valueToCode(block, 'X', Order.NONE);
            const y = gen.valueToCode(block, 'Y', Order.NONE);
            const w = gen.valueToCode(block, 'W', Order.NONE);
            const h = gen.valueToCode(block, 'H', Order.NONE);
            return [`window.create(term.current(), ${x}, ${y}, ${w}, ${h})`, Order.ATOMIC];
        }
    },
    'window_setVisible': {
        block: {
            init() {
                this.appendValueInput('WIN')
                    .appendField('set window');
                this.appendValueInput('BOOL').setCheck('Boolean')
                    .appendField('visible');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Show or hide a window');
            },
        },
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            const bool = gen.valueToCode(block, 'BOOL', Order.NONE);
            return `${gen.getIndent()}${win}.setVisible(${bool})`;
        }
    },
    'window_reposition': {
        block: {
            init() {
                this.appendValueInput('WIN')
                    .appendField('move window');
                this.appendValueInput('X').setCheck('Number')
                    .appendField('to x:');
                this.appendValueInput('Y').setCheck('Number')
                    .appendField('y:');
                this.appendValueInput('W').setCheck('Number')
                    .appendField('w:');
                this.appendValueInput('H').setCheck('Number')
                    .appendField('h:');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Reposition and resize a window');
            },
        },
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
        block: {
            init() {
                this.appendValueInput('WIN')
                    .appendField('redraw window');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Redraw a window to the screen');
            },
        },
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return `${gen.getIndent()}${win}.redraw()`;
        }
    },
    'window_getWidth': {
        block: {
            init() {
                this.appendValueInput('WIN')
                    .appendField('window');
                this.appendDummyInput()
                    .appendField('width');
                this.setOutput(true, 'Number');
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Get the width of a window');
            },
        },
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`({${win}.getSize()})`, Order.ATOMIC];
        }
    },
    'window_getHeight': {
        block: {
            init() {
                this.appendValueInput('WIN')
                    .appendField('window');
                this.appendDummyInput()
                    .appendField('height');
                this.setOutput(true, 'Number');
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Get the height of a window');
            },
        },
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`select(2, ${win}.getSize())`, Order.ATOMIC];
        }
    },
    'window_getPositionX': {
        block: {
            init() {
                this.appendValueInput('WIN')
                    .appendField('window');
                this.appendDummyInput()
                    .appendField('x position');
                this.setOutput(true, 'Number');
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Get the x position of a window');
            },
        },
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`({${win}.getPosition()})`, Order.ATOMIC];
        }
    },
    'window_getPositionY': {
        block: {
            init() {
                this.appendValueInput('WIN')
                    .appendField('window');
                this.appendDummyInput()
                    .appendField('y position');
                this.setOutput(true, 'Number');
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Get the y position of a window');
            },
        },
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`select(2, ${win}.getPosition())`, Order.ATOMIC];
        }
    },
    'window_isVisible': {
        block: {
            init() {
                this.appendValueInput('WIN')
                    .appendField('window');
                this.appendDummyInput()
                    .appendField('visible?');
                this.setOutput(true, 'Boolean');
                this.setStyle('window_blocks');
                this.setInputsInline(true);
                this.setTooltip('Check if a window is currently visible');
            },
        },
        generator: (block, gen) => {
            const win = gen.valueToCode(block, 'WIN', Order.ATOMIC);
            return [`${win}.isVisible()`, Order.ATOMIC];
        }
    }
};