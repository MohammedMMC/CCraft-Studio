import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { SIDES } from "../../ccBlocks";
import { Order } from "../../luaGenerator";

export const redstoneBlocks: Blocks = {
    'rs_setOutput': {
        block: {
            init() {
                this.appendValueInput('VALUE').setCheck('Boolean')
                    .appendField('set redstone')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('redstone_blocks');
                this.setTooltip('Set digital redstone output on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}redstone.setOutput("${side}", ${value})`;
        }
    },
    'rs_setAnalogOutput': {
        block: {
            init() {
                this.appendValueInput('VALUE').setCheck('Number')
                    .appendField('set redstone')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('strength to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('redstone_blocks');
                this.setTooltip('Set analog redstone output strength (0-15) on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}redstone.setAnalogOutput("${side}", ${value})`;
        }
    },
    'rs_setBundledOutput': {
        block: {
            init() {
                this.appendValueInput('VALUE').setCheck('Number')
                    .appendField('set bundled output')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('redstone_blocks');
                this.setTooltip('Set bundled cable output on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}redstone.setBundledOutput("${side}", ${value})`;
        }
    },
    'rs_getInput': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('get redstone input on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'Boolean');
                this.setStyle('redstone_blocks');
                this.setTooltip('Get digital redstone input on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getInput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getOutput': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('get redstone output on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'Boolean');
                this.setStyle('redstone_blocks');
                this.setTooltip('Get the current digital redstone output on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getOutput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getAnalogInput': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('get redstone strength on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'Number');
                this.setStyle('redstone_blocks');
                this.setTooltip('Get analog redstone input strength (0-15) on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getAnalogInput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getAnalogOutput': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('get redstone output strength on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'Number');
                this.setStyle('redstone_blocks');
                this.setTooltip('Get the current analog redstone output strength on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getAnalogOutput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getBundledOutput': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('get bundled output on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'Number');
                this.setStyle('redstone_blocks');
                this.setTooltip('Get bundled cable output on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getBundledInput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_getBundledInput': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('get bundled input on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'Number');
                this.setStyle('redstone_blocks');
                this.setTooltip('Get bundled cable input on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`redstone.getBundledInput("${side}")`, Order.ATOMIC];
        }
    },
    'rs_testBundledInput': {
        block: {
            init() {
                this.appendValueInput('COLOR').setCheck('Color')
                    .appendField('test bundled')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('has color');
                this.setOutput(true, 'Boolean');
                this.setStyle('redstone_blocks');
                this.setTooltip('Test if a bundled cable input includes a specific color');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const color = gen.valueToCode(block, 'COLOR', Order.NONE);
            
            return [`redstone.testBundledInput("${side}", ${color})`, Order.ATOMIC];
        }
    }
};