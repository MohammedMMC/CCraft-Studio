import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const systemBlocks: Block = {
    'os_sleep': {
        block: {
            init() {
                this.appendValueInput('SECS').setCheck('Number')
                    .appendField('sleep');
                this.appendDummyInput()
                    .appendField('seconds');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('os_blocks');
                this.setInputsInline(true);
                this.setTooltip('Pause execution for a number of seconds');
            },
        },
        generator: (block, gen) => {
            const secs = gen.valueToCode(block, 'SECS', Order.NONE);
            return `${gen.getIndent()}os.sleep(${secs})`;
        }
    },
    'sleep_secs': {
        block: {
            init() {
                this.appendValueInput('SECS').setCheck('Number')
                    .appendField('wait');
                this.appendDummyInput()
                    .appendField('seconds');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('os_blocks');
                this.setInputsInline(true);
                this.setTooltip('Pause execution for a number of seconds');
            },
        },
        generator: (block, gen) => {
            return '';
        }
    },
    'os_shutdown': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('shutdown computer');
                this.setPreviousStatement(true, null);
                this.setStyle('os_blocks');
                this.setTooltip('Shut down the computer');
            },
        },
        generator: (block, gen) => {
            return `${gen.getIndent()}os.shutdown()`;
        }
    },
    'os_reboot': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('reboot computer');
                this.setPreviousStatement(true, null);
                this.setStyle('os_blocks');
                this.setTooltip('Reboot the computer');
            },
        },
        generator: (block, gen) => {
            return `${gen.getIndent()}os.reboot()`;
        }
    },
    'os_queueEvent': {
        block: {
            init() {
                this.appendValueInput('DATA')
                    .appendField('queue event')
                    .appendField(new Blockly.FieldTextInput('myEvent'), 'NAME')
                    .appendField('with');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('os_blocks');
                this.setInputsInline(true);
                this.setTooltip('Queue a custom event with optional data');
            },
        },
        generator: (block, gen) => {
            const name = block.getFieldValue('NAME');
            const data = gen.valueToCode(block, 'DATA', Order.NONE);
            return `${gen.getIndent()}os.queueEvent("${name}", ${data})`;
        }
    },
    'os_setComputerLabel': {
        block: {
            init() {
                this.appendValueInput('LABEL').setCheck('String')
                    .appendField('set computer label to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('os_blocks');
                this.setInputsInline(true);
                this.setTooltip('Set the label of the computer');
            },
        },
        generator: (block, gen) => {
            const label = gen.valueToCode(block, 'LABEL', Order.NONE);
            return `${gen.getIndent()}os.setComputerLabel(${label})`;
        }
    },
    'os_cancelTimer': {
        block: {
            init() {
                this.appendValueInput('SECS').setCheck('Number')
                    .appendField('start timer');
                this.appendDummyInput()
                    .appendField('seconds');
                this.setOutput(true, 'Number');
                this.setStyle('os_blocks');
                this.setInputsInline(true);
                this.setTooltip('Start a timer that fires after the specified seconds. Returns timer ID.');
            },
        },
        generator: (block, gen) => {
            const id = gen.valueToCode(block, 'ID', Order.NONE);
            return `${gen.getIndent()}os.cancelTimer(${id})`;
        }
    },
    'os_cancelAlarm': {
        block: {
            init() {
                this.appendValueInput('ID').setCheck('Number')
                    .appendField('cancel alarm');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('os_blocks');
                this.setInputsInline(true);
                this.setTooltip('Cancel a previously set alarm by ID');
            },
        },
        generator: (block, gen) => {
            const id = gen.valueToCode(block, 'ID', Order.NONE);
            return `${gen.getIndent()}os.cancelAlarm(${id})`;
        }
    },
    'os_startTimer': {
        block: {
            init() {
                this.appendValueInput('ID').setCheck('Number')
                    .appendField('cancel timer');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('os_blocks');
                this.setInputsInline(true);
                this.setTooltip('Cancel a previously started timer by ID');
            },
        },
        generator: (block, gen) => {
            const secs = gen.valueToCode(block, 'SECS', Order.NONE);
            return [`os.startTimer(${secs})`, Order.ATOMIC];
        }
    },
    'os_setAlarm': {
        block: {
            init() {
                this.appendValueInput('TIME').setCheck('Number')
                    .appendField('set alarm at');
                this.setOutput(true, 'Number');
                this.setStyle('os_blocks');
                this.setInputsInline(true);
                this.setTooltip('Set an alarm at a specific in-game time (0-24). Returns alarm ID.');
            },
        },
        generator: (block, gen) => {
            const time = gen.valueToCode(block, 'TIME', Order.NONE);
            return [`os.setAlarm(${time})`, Order.ATOMIC];
        }
    },
    'os_time': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('current time');
                this.setOutput(true, 'Number');
                this.setStyle('os_blocks');
                this.setTooltip('Get the current in-game time');
            },
        },
        generator: (block, gen) => {
            return [`os.time()`, Order.ATOMIC];
        }
    },
    'os_day': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('current day');
                this.setOutput(true, 'Number');
                this.setStyle('os_blocks');
                this.setTooltip('Get the current in-game day');
            },
        },
        generator: (block, gen) => {
            return [`os.day()`, Order.ATOMIC];
        }
    },
    'os_epoch': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('epoch time');
                this.setOutput(true, 'Number');
                this.setStyle('os_blocks');
                this.setTooltip('Get the current epoch time in milliseconds');
            },
        },
        generator: (block, gen) => {
            return [`os.epoch()`, Order.ATOMIC];
        }
    },
    'os_clock': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('CPU clock');
                this.setOutput(true, 'Number');
                this.setStyle('os_blocks');
                this.setTooltip('Get the amount of CPU time the computer has used');
            },
        },
        generator: (block, gen) => {
            return [`os.clock()`, Order.ATOMIC];
        }
    },
    'os_getComputerID': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('computer ID');
                this.setOutput(true, 'Number');
                this.setStyle('os_blocks');
                this.setTooltip('Get the unique ID of this computer');
            },
        },
        generator: (block, gen) => {
            return [`os.getComputerID()`, Order.ATOMIC];
        }
    },
    'os_getComputerLabel': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('computer label');
                this.setOutput(true, 'String');
                this.setStyle('os_blocks');
                this.setTooltip('Get the label of this computer');
            },
        },
        generator: (block, gen) => {
            return [`os.getComputerLabel()`, Order.ATOMIC];
        }
    },
    'os_version': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('OS version');
                this.setOutput(true, 'String');
                this.setStyle('os_blocks');
                this.setTooltip('Get the CraftOS version string');
            },
        },
        generator: (block, gen) => {
            return [`os.version()`, Order.ATOMIC];
        }
    }
};