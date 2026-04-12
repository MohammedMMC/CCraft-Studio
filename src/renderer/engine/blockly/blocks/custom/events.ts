import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { GeneratorFunc } from "../../luaGenerator";
import { ELEMENTS } from '../../ccBlocks';

export const eventsBlocks: Block = {
    'event_screen_load': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when this screen loads');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when this screen is first displayed (runs once)');
                this.setDeletable(true);
            },
        },
        generator: (block, gen) => {
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:screen_load]\n${body}\n-- [/EVENT:screen_load]`;
        }
    },
    'event_screen_update': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when this screen updates');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when this screen is updated');
            },
        },
        generator: (block, gen) => {
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:screen_update]\n${body}\n-- [/EVENT:screen_update]`;
        }
    },
    'event_button_click': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when button')
                    .appendField(new Blockly.FieldDropdown(ELEMENTS('button')), 'BUTTON')
                    .appendField('is clicked');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when a button element is clicked');
            },
        },
        generator: (block, gen) => {
            const btn = block.getFieldValue('BUTTON');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:button_click:${btn}]\n${body}\n-- [/EVENT:button_click:${btn}]`;
        }
    },
    'event_button_focus': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when button')
                    .appendField(new Blockly.FieldDropdown(ELEMENTS('button')), 'BUTTON')
                    .appendField('is focused');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs while a button is held down (focused)');
            },
        },
        generator: (block, gen) => {
            const btn = block.getFieldValue('BUTTON');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:button_focus:${btn}]\n${body}\n-- [/EVENT:button_focus:${btn}]`;
        }
    },
    'event_button_release': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when button')
                    .appendField(new Blockly.FieldDropdown(ELEMENTS('button')), 'BUTTON')
                    .appendField('is released');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when a button is released after being clicked');
            },
        },
        generator: (block, gen) => {
            const btn = block.getFieldValue('BUTTON');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:button_release:${btn}]\n${body}\n-- [/EVENT:button_release:${btn}]`;
        }
    },
    'event_key_press': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when key')
                    .appendField(new Blockly.FieldDropdown([
                        ['any', 'any'], ['enter', 'enter'], ['space', 'space'],
                        ['up', 'up'], ['down', 'down'], ['left', 'left'], ['right', 'right'],
                        ['backspace', 'backspace'], ['tab', 'tab'],
                        ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'],
                        ['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'],
                        ['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'],
                        ['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'],
                        ['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'],
                        ['z', 'z'],
                        ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                        ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['0', '0'],
                    ]), 'KEY')
                    .appendField('is pressed');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when a keyboard key is pressed');
            },
        },
        generator: (block, gen) => {
            const key = block.getFieldValue('KEY');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:key_press:${key}]\n${body}\n-- [/EVENT:key_press:${key}]`;
        }
    },
    'event_timer': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('Every')
                    .appendField(new Blockly.FieldNumber(1, 0.05), 'INTERVAL')
                    .appendField('seconds');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs repeatedly at a timed interval');
            },
        },
        generator: (block, gen) => {
            const interval = block.getFieldValue('INTERVAL');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:timer:${interval}]\n${body}\n-- [/EVENT:timer:${interval}]`;
        }
    },
    'event_redstone': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when redstone input changes');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when any redstone signal changes');
            },
        },
        generator: (block, gen) => {
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:redstone]\n${body}\n-- [/EVENT:redstone]`;
        }
    },
    'event_modem_message': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when modem receives message');
                this.appendDummyInput()
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('channel')
                    .appendField(new Blockly.FieldNumber(1, 0, 65535), 'CHANNEL');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when a modem message is received on the specified channel');
            },
        },
        generator: (block, gen) => {
            const ch = block.getFieldValue('CHANNEL');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:modem_message:${ch}]\n${body}\n-- [/EVENT:modem_message:${ch}]`;
        }
    },
    'event_any': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when any event occurs');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when any OS event occurs. Use os.pullEvent() inside to get event details.');
            },
        },
        generator: (block, gen) => {
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:any]\n${body}\n-- [/EVENT:any]`;
        }
    }
};