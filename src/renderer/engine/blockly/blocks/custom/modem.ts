import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const modemBlocks: Block = {
    'modem_open': {
        block: {
            init() {
                this.appendValueInput("CHANNEL").setCheck('Number')
                    .appendField('open channel');
                this.appendValueInput('MODEM_PERIPHERAL').setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('modem');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('modem_blocks');
                this.setTooltip('Open a channel on the modem (Note: Throws an error if the channel is out of range or if there are too many open channels)');
            },
        },
        generator: (block, gen) => {
            const channel = gen.valueToCode(block, 'CHANNEL', Order.NONE);
            const modem = gen.valueToCode(block, 'MODEM_PERIPHERAL', Order.NONE);
            return `${gen.getIndent()}${modem}.open(${channel})`;
        }
    },
    'modem_isOpen': {
        block: {
            init() {
                this.appendValueInput("CHANNEL").setCheck('Number')
                    .appendField('open channel');
                this.appendValueInput('MODEM_PERIPHERAL').setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('modem');
                this.setOutput(true, 'Boolean');
                this.setStyle('modem_blocks');
                this.setTooltip('Check if a channel is open on the modem (Note: Throws an error if the channel is out of range)');
            },
        },
        generator: (block, gen) => {
            const channel = gen.valueToCode(block, 'CHANNEL', Order.NONE);
            const modem = gen.valueToCode(block, 'MODEM_PERIPHERAL', Order.NONE);
            return `${modem}.isOpen(${channel})`;
        }
    },
    'modem_close': {
        block: {
            init() {
                this.appendValueInput("CHANNEL").setCheck('Number')
                    .appendField('close channel');
                this.appendValueInput('MODEM_PERIPHERAL').setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('modem');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('modem_blocks');
                this.setTooltip('Close an open channel on the modem (Note: Throws an error if the channel is out of range)');
            },
        },
        generator: (block, gen) => {
            const channel = gen.valueToCode(block, 'CHANNEL', Order.NONE);
            const modem = gen.valueToCode(block, 'MODEM_PERIPHERAL', Order.NONE);
            return `${gen.getIndent()}${modem}.close(${channel})`;
        }
    },
    'modem_closeAll': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('close all channels');
                this.appendValueInput('MODEM_PERIPHERAL').setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('modem');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('modem_blocks');
                this.setTooltip('Close all open channels on the modem');
            },
        },
        generator: (block, gen) => {
            const modem = gen.valueToCode(block, 'MODEM_PERIPHERAL', Order.NONE);
            return `${gen.getIndent()}${modem}.closeAll()`;
        }
    },
    'modem_transmit': {
        block: {
            init() {
                this.appendValueInput("CHANNEL").setCheck('Number')
                    .appendField('transmit on channel');
                this.appendValueInput("REPLY_CHANNEL").setCheck('Number')
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('reply channel');
                this.appendValueInput('PAYLOAD').setCheck(null)
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('payload');
                this.appendValueInput('MODEM_PERIPHERAL').setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('modem');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('modem_blocks');
                this.setTooltip('Sends a modem message on a certain channel (Note: Throws an error if the channel is out of range)');
            },
        },
        generator: (block, gen) => {
            const channel = gen.valueToCode(block, 'CHANNEL', Order.NONE);
            const replyChannel = gen.valueToCode(block, 'REPLY_CHANNEL', Order.NONE);
            const payload = gen.valueToCode(block, 'PAYLOAD', Order.NONE);
            const modem = gen.valueToCode(block, 'MODEM_PERIPHERAL', Order.NONE);
            return `${gen.getIndent()}${modem}.transmit(${channel}, ${replyChannel}, ${payload})`;
        }
    },
    'modem_isWireless': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('is wireless modem?');
                this.appendValueInput('MODEM_PERIPHERAL').setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('modem');
                this.setOutput(true, 'Boolean');
                this.setStyle('modem_blocks');
                this.setTooltip('Check if a channel is open on the modem');
            },
        },
        generator: (block, gen) => {
            const channel = gen.valueToCode(block, 'CHANNEL', Order.NONE);
            const modem = gen.valueToCode(block, 'MODEM_PERIPHERAL', Order.NONE);
            return `${modem}.isOpen(${channel})`;
        }
    },
    'modem_getNamesRemote': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('get remote modem names');
                this.appendValueInput('MODEM_PERIPHERAL').setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('modem');
                this.setOutput(true, 'Array');
                this.setStyle('modem_blocks');
                this.setTooltip('List all remote peripherals on the wired network');
            },
        },
        generator: (block, gen) => {
            const modem = gen.valueToCode(block, 'MODEM_PERIPHERAL', Order.NONE);
            return `${modem}.getNamesRemote()`;
        }
    },
};