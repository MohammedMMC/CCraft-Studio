import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const settingsBlocks: Blocks = {
    'settings_set': {
        block: {
            init() {
                this.appendValueInput('VALUE')
                    .appendField('set setting')
                    .appendField(new Blockly.FieldTextInput('settingName'), 'NAME')
                    .appendField('to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('settings_blocks');
                this.setInputsInline(true);
                this.setTooltip('Set a setting to a value');
            },
        },
        generator: (block, gen) => {
            const name = block.getFieldValue('NAME');
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}settings.set("${name}", ${value})`;
        }
    },
    'settings_unset': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('remove setting')
                    .appendField(new Blockly.FieldTextInput('settingName'), 'NAME');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('settings_blocks');
                this.setTooltip('Remove a setting');
            },
        },
        generator: (block, gen) => {
            const name = block.getFieldValue('NAME');
            return `${gen.getIndent()}settings.unset("${name}")`;
        }
    },
    'settings_save': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('save settings to')
                    .appendField(new Blockly.FieldTextInput('.settings'), 'PATH');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('settings_blocks');
                this.setTooltip('Save all settings to a file');
            },
        },
        generator: (block, gen) => {
            const path = block.getFieldValue('PATH');
            return `${gen.getIndent()}settings.save("${path}")`;
        }
    },
    'settings_load': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('load settings from')
                    .appendField(new Blockly.FieldTextInput('.settings'), 'PATH');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('settings_blocks');
                this.setTooltip('Load settings from a file');
            },
        },
        generator: (block, gen) => {
            const path = block.getFieldValue('PATH');
            return `${gen.getIndent()}settings.load("${path}")`;
        }
    },
    'settings_get': {
        block: {
            init() {
                this.appendValueInput('DEFAULT')
                    .appendField('get setting')
                    .appendField(new Blockly.FieldTextInput('settingName'), 'NAME')
                    .appendField('default');
                this.setOutput(true, null);
                this.setStyle('settings_blocks');
                this.setInputsInline(true);
                this.setTooltip('Get a setting value, or a default if not set');
            },
        },
        generator: (block, gen) => {
            const name = block.getFieldValue('NAME');
            const def = gen.valueToCode(block, 'DEFAULT', Order.NONE);
            return [`settings.get("${name}", ${def})`, Order.ATOMIC];
        }
    }
};