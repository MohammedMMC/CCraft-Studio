import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const paintUtilsBlocks: Block = {
    'paint_drawPixel': {
        block: {
            init() {
                this.appendValueInput('X').setCheck('Number')
                    .appendField('draw pixel at x:');
                this.appendValueInput('Y').setCheck('Number')
                    .appendField('y:');
                this.appendValueInput('COLOR').setCheck('Color')
                    .appendField('color');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('paintutils_blocks');
                this.setInputsInline(true);
                this.setTooltip('Draw a single pixel at the given coordinates');
            },
        },
        generator: (block, gen) => {
            const x = gen.valueToCode(block, 'X', Order.NONE);
            const y = gen.valueToCode(block, 'Y', Order.NONE);
            const color = block.getFieldValue('COLOR');
            return `${gen.getIndent()}paintutils.drawPixel(${x}, ${y}, ${color})`;
        }
    },
    'paint_drawLine': {
        block: {
            init() {
                this.appendValueInput('X1').setCheck('Number')
                    .appendField('draw line from x:');
                this.appendValueInput('Y1').setCheck('Number')
                    .appendField('y:');
                this.appendValueInput('X2').setCheck('Number')
                    .appendField('to x:');
                this.appendValueInput('Y2').setCheck('Number')
                    .appendField('y:');
                this.appendValueInput('COLOR').setCheck('Color')
                    .appendField('color');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('paintutils_blocks');
                this.setInputsInline(true);
                this.setTooltip('Draw a line between two points');
            },
        },
        generator: (block, gen) => {
            const x1 = gen.valueToCode(block, 'X1', Order.NONE);
            const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
            const x2 = gen.valueToCode(block, 'X2', Order.NONE);
            const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
            const color = block.getFieldValue('COLOR');
            return `${gen.getIndent()}paintutils.drawLine(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
        }
    },
    'paint_drawBox': {
        block: {
            init() {
                this.appendValueInput('X1').setCheck('Number')
                    .appendField('draw box from x:');
                this.appendValueInput('Y1').setCheck('Number')
                    .appendField('y:');
                this.appendValueInput('X2').setCheck('Number')
                    .appendField('to x:');
                this.appendValueInput('Y2').setCheck('Number')
                    .appendField('y:');
                this.appendValueInput('COLOR').setCheck('Color')
                    .appendField('color');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('paintutils_blocks');
                this.setInputsInline(true);
                this.setTooltip('Draw a box outline between two corners');
            },
        },
        generator: (block, gen) => {
            const x1 = gen.valueToCode(block, 'X1', Order.NONE);
            const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
            const x2 = gen.valueToCode(block, 'X2', Order.NONE);
            const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
            const color = block.getFieldValue('COLOR');
            return `${gen.getIndent()}paintutils.drawBox(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
        }
    },
    'paint_drawFilledBox': {
        block: {
            init() {
                this.appendValueInput('X1').setCheck('Number')
                    .appendField('draw filled box from x1:');
                this.appendValueInput('Y1').setCheck('Number')
                    .appendField('y1:');
                this.appendValueInput('X2').setCheck('Number')
                    .appendField('to x2:');
                this.appendValueInput('Y2').setCheck('Number')
                    .appendField('y2:');
                this.appendValueInput('COLOR').setCheck('Color')
                    .appendField('color');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('paintutils_blocks');
                this.setInputsInline(true);
                this.setTooltip('Draw a filled box between two corners');
            },
        },
        generator: (block, gen) => {
            const x1 = gen.valueToCode(block, 'X1', Order.NONE);
            const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
            const x2 = gen.valueToCode(block, 'X2', Order.NONE);
            const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
            const color = block.getFieldValue('COLOR');
            return `${gen.getIndent()}paintutils.drawFilledBox(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
        }
    },
    'paint_drawImage': {
        block: {
            init() {
                this.appendValueInput('IMAGE')
                    .appendField('draw image');
                this.appendValueInput('X').setCheck('Number')
                    .appendField('at x:');
                this.appendValueInput('Y').setCheck('Number')
                    .appendField('y:');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('paintutils_blocks');
                this.setInputsInline(true);
                this.setTooltip('Draw a loaded image at the given coordinates');
            },
        },
        generator: (block, gen) => {
            const image = gen.valueToCode(block, 'IMAGE', Order.NONE);
            const x = gen.valueToCode(block, 'X', Order.NONE);
            const y = gen.valueToCode(block, 'Y', Order.NONE);
            return `${gen.getIndent()}paintutils.drawImage(${image}, ${x}, ${y})`;
        }
    },
    'paint_loadImage': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('load image from');
                this.setOutput(true, null);
                this.setStyle('paintutils_blocks');
                this.setTooltip('Load a paint image from a file');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return [`paintutils.loadImage(${path})`, Order.ATOMIC];
        }
    }
};