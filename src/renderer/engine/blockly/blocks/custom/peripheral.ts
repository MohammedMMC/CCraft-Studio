import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const peripheralBlocks: Block = {
    'peripheral_call': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck('String')
                    .appendField('call')
                    .appendField(new Blockly.FieldTextInput('methodName'), 'METHOD').setCheck('String')
                    .appendField('on');
                this.appendValueInput('ARGS').setCheck(null)
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('args');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('peripheral_blocks');
                this.setTooltip('Call a method on a peripheral with arguments');
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.NONE);
            const method = gen.valueToCode(block, 'METHOD', Order.NONE);
            const args = gen.valueToCode(block, 'ARGS', Order.NONE);
            if (args && args !== 'nil') {
                return `${gen.getIndent()}peripheral.call(${peripheral}, ${method}, ${args})`;
            }
            return `${gen.getIndent()}peripheral.call(${peripheral}, ${method})`;
        }
    },
    'peripheral_wrap': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck('String')
                    .appendField('wrap peripheral');
                this.setOutput(true, ["Array", "Null"]);
                this.setStyle('peripheral_blocks');
                this.setTooltip('Get a table containing all functions available on a peripheral.');
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.NONE);
            return [`peripheral.wrap(${peripheral})`, Order.ATOMIC];
        }
    },
    'peripheral_find': {
        block: {
            init() {
                this.appendValueInput('TYPE').setCheck('String')
                    .appendField('find peripheral');
                this.setOutput(true, "Array");
                this.setStyle('peripheral_blocks');
                this.setTooltip('Find all peripherals of a specific type');
            },
        },
        generator: (block, gen) => {
            const type = gen.valueToCode(block, 'TYPE', Order.NONE);
            return [`peripheral.find(${type})`, Order.ATOMIC];
        }
    },
    'peripheral_getType': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck(["String", "Array"])
                    .appendField('type of peripheral');
                this.setOutput(true, ['String', 'Null']);
                this.setStyle('peripheral_blocks');
                this.setTooltip('Get the type name of the peripheral');
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.NONE);
            
            return [`peripheral.getType(${peripheral})`, Order.ATOMIC];
        }
    },
    'peripheral_hasType': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck(["String", "Array"])
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
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.NONE);
            const type = gen.valueToCode(block, 'TYPE', Order.NONE);
            return [`peripheral.hasType(${peripheral}, ${type})`, Order.ATOMIC];
        }
    },
    'peripheral_getName': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck("Array")
                    .appendField('name of peripheral');
                this.setOutput(true, 'String');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Get the name of the peripheral');
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.NONE);
            return [`peripheral.getName(${peripheral})`, Order.ATOMIC];
        }
    },
    'peripheral_isPresent': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck("String")
                    .appendField('peripheral exists?')
                this.setOutput(true, 'Boolean');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Determines if a peripheral is present with the given name');
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.NONE);
            return [`peripheral.isPresent(${peripheral})`, Order.ATOMIC];
        }
    },
    'peripheral_getMethods': {
        block: {
            init() {
                this.appendValueInput('PERIPHERAL').setCheck("Array")
                    .appendField('methods of');
                this.setOutput(true, 'Array');
                this.setStyle('peripheral_blocks');
                this.setTooltip('Get a list of methods available on a peripheral');
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.NONE);
            return [`peripheral.getMethods(${peripheral})`, Order.ATOMIC];
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