import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";
import { SIDES } from '../../ccBlocks';

export const rednetBlocks: Block = {
    'rednet_open': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('open rednet on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('rednet_blocks');
                this.setTooltip('Open a modem on the given side for rednet communication');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return `${gen.getIndent()}rednet.open("${side}")`;
        }
    },
    'rednet_close': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('close rednet on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('rednet_blocks');
                this.setTooltip('Close a modem on the given side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return `${gen.getIndent()}rednet.close("${side}")`;
        }
    },
    'rednet_send': {
        block: {
            init() {
                this.appendValueInput('MESSAGE')
                    .appendField('send');
                this.appendValueInput('ID').setCheck('Number')
                    .appendField('to computer');
                this.appendDummyInput()
                    .appendField('protocol')
                    .appendField(new Blockly.FieldTextInput(''), 'PROTOCOL');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('rednet_blocks');
                this.setInputsInline(true);
                this.setTooltip('Send a message to a specific computer via rednet');
            },
        },
        generator: (block, gen) => {
            const id = gen.valueToCode(block, 'ID', Order.NONE);
            const message = gen.valueToCode(block, 'MESSAGE', Order.NONE);
            const protocol = block.getFieldValue('PROTOCOL');
            if (protocol) {
                return `${gen.getIndent()}rednet.send(${id}, ${message}, "${protocol}")`;
            }
            return `${gen.getIndent()}rednet.send(${id}, ${message})`;
        }
    },
    'rednet_broadcast': {
        block: {
            init() {
                this.appendValueInput('MESSAGE')
                    .appendField('broadcast');
                this.appendDummyInput()
                    .appendField('protocol')
                    .appendField(new Blockly.FieldTextInput(''), 'PROTOCOL');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('rednet_blocks');
                this.setInputsInline(true);
                this.setTooltip('Broadcast a message to all computers on the network');
            },
        },
        generator: (block, gen) => {
            const message = gen.valueToCode(block, 'MESSAGE', Order.NONE);
            const protocol = block.getFieldValue('PROTOCOL');
            if (protocol) {
                return `${gen.getIndent()}rednet.broadcast(${message}, "${protocol}")`;
            }
            return `${gen.getIndent()}rednet.broadcast(${message})`;
        }
    },
    'rednet_host': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('host protocol')
                    .appendField(new Blockly.FieldTextInput('myProtocol'), 'PROTOCOL')
                    .appendField('as')
                    .appendField(new Blockly.FieldTextInput('myHost'), 'HOSTNAME');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('rednet_blocks');
                this.setTooltip('Register this computer as a host for a protocol');
            },
        },
        generator: (block, gen) => {
            const protocol = block.getFieldValue('PROTOCOL');
            const hostname = block.getFieldValue('HOSTNAME');
            return `${gen.getIndent()}rednet.host("${protocol}", "${hostname}")`;
        }
    },
    'rednet_unhost': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('unhost protocol')
                    .appendField(new Blockly.FieldTextInput('myProtocol'), 'PROTOCOL');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('rednet_blocks');
                this.setTooltip('Stop hosting a protocol');
            },
        },
        generator: (block, gen) => {
            const protocol = block.getFieldValue('PROTOCOL');
            return `${gen.getIndent()}rednet.unhost("${protocol}")`;
        }
    },
    'rednet_receive': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('receive message timeout')
                    .appendField(new Blockly.FieldNumber(10, 0), 'TIMEOUT');
                this.setOutput(true, null);
                this.setStyle('rednet_blocks');
                this.setTooltip('Wait for a rednet message with an optional timeout');
            },
        },
        generator: (block, gen) => {
            const timeout = block.getFieldValue('TIMEOUT');
            return [`({rednet.receive(${timeout})})`, Order.ATOMIC];
        }
    },
    'rednet_lookup': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('lookup')
                    .appendField(new Blockly.FieldTextInput('myProtocol'), 'PROTOCOL')
                    .appendField('host')
                    .appendField(new Blockly.FieldTextInput(''), 'HOSTNAME');
                this.setOutput(true, 'Number');
                this.setStyle('rednet_blocks');
                this.setTooltip('Look up computers hosting a specific protocol');
            },
        },
        generator: (block, gen) => {
            const protocol = block.getFieldValue('PROTOCOL');
            const hostname = block.getFieldValue('HOSTNAME');
            if (hostname) {
                return [`rednet.lookup("${protocol}", "${hostname}")`, Order.ATOMIC];
            }
            return [`rednet.lookup("${protocol}")`, Order.ATOMIC];
        }
    },
    'rednet_isOpen': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('rednet open on')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('?');
                this.setOutput(true, 'Boolean');
                this.setStyle('rednet_blocks');
                this.setTooltip('Check if rednet is open on a given side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`rednet.isOpen("${side}")`, Order.ATOMIC];
        }
    }
};