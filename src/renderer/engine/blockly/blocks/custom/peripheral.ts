import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";
import { SIDES } from '../../ccBlocks';

export const peripheralBlocks: Block = {
    'peripheral_call': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('call')
                    .appendField(new Blockly.FieldTextInput('methodName'), 'METHOD')
                    .appendField('on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.appendValueInput('ARGS').setCheck(null)
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('peripheral');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('peripheral_blocks');
                this.setTooltip('Call a method on a peripheral with arguments');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const method = block.getFieldValue('METHOD');
            const args = gen.valueToCode(block, 'ARGS', Order.NONE);
            if (args && args !== 'nil') {
                return `${gen.getIndent()}peripheral.call("${side}", "${method}", ${args})`;
            }
            return `${gen.getIndent()}peripheral.call("${side}", "${method}")`;
        }
    },
    'peripheral_wrap': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('wrap peripheral')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, null);
                this.setStyle('peripheral_blocks');
                this.setTooltip('Wrap a peripheral on a side as an object');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`peripheral.wrap("${side}")`, Order.ATOMIC];
        }
    },
    'peripheral_find': {
        block: {
            init() {
                this.appendValueInput('TYPE').setCheck('String')
                    .appendField('find peripheral');
                this.setOutput(true, null);
                this.setStyle('peripheral_blocks');
                this.setTooltip('Find the first connected peripheral of a given type');
            },
        },
        generator: (block, gen) => {
            const type = block.getFieldValue('TYPE');
            return [`peripheral.find("${type}")`, Order.ATOMIC];
        }
    },
    'peripheral_getType': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('type of peripheral')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'String');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Get the type name of the peripheral on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`peripheral.getType("${side}")`, Order.ATOMIC];
        }
    },
    'peripheral_hasType': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck(null)
                    .appendField('peripheral');
                this.appendValueInput('TYPE').setCheck('String')
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('is type');
                this.setOutput(true, 'Boolean');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Check the peripheral type');
            },
        },
        generator: (block, gen) => {
            return '';
        }
    },
    'peripheral_getName': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck(null)
                    .appendField('name of peripheral');
                this.setOutput(true, 'String');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Get the name of the peripheral');
            },
        },
        generator: (block, gen) => {
            return '';
        }
    },
    'peripheral_isPresent': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('peripheral on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('exists?');
                this.setOutput(true, 'Boolean');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Check if a peripheral is connected on a side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`peripheral.isPresent("${side}")`, Order.ATOMIC];
        }
    },
    'peripheral_getMethods': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('methods of')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'Array');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Get a list of methods available on a peripheral');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`peripheral.getMethods("${side}")`, Order.ATOMIC];
        }
    },
    'peripheral_getNames': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('all peripheral names');
                this.setOutput(true, 'Array');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Get the names of all connected peripherals');
            },
        },
        generator: (block, gen) => {
            return [`peripheral.getNames()`, Order.ATOMIC];
        }
    }
};