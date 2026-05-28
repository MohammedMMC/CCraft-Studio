import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { ALL_ELEMENT_PROPS, ELEMENT_COLOR_PROPS, ELEMENT_PROPS, ELEMENTS, SCREENS, getBlocklyActiveScreen, valueToType } from "../../ccBlocks";
import { Order } from "../../luaGenerator";
import { UI_ELEMENT_COLORS_NAMES, UI_ELEMENT_PROPS_NAMES, UIElement } from '@/models/UIElement';

export const uiActionsBlocks: Blocks = {
    'ui_screen_select': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(SCREENS), 'SCREEN');
                this.setOutput(true, "Screen");
                this.setStyle('ui_blocks');
                this.setTooltip('Select a screen');
            },
        },
        generator: (block, gen) => {
            const screen = block.getFieldValue('SCREEN');
            return [`getScreen("${screen}")`, Order.ATOMIC];
        }
    },
    'ui_set_prop': {
        block: {
            init() {
                this.appendValueInput('VALUE')
                    .appendField('set')
                    .appendField(new Blockly.FieldDropdown(ELEMENTS), 'ELEMENT')
                    .appendField('.')
                    .appendField(new Blockly.FieldDropdown(function (this: Blockly.FieldDropdown) {
                        const elementName = this.getSourceBlock()?.getFieldValue('ELEMENT') || ELEMENTS()[0][0];
                        return elementName !== "(no elements)"
                            ? [...ELEMENT_PROPS(elementName), ...ELEMENT_COLOR_PROPS(elementName)]
                            : [['(no element)', '']];
                    }), 'PROP')
                    .appendField('to');

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('ui_blocks');
                this.setTooltip(`Set the ${UI_ELEMENT_PROPS_NAMES[this.getFieldValue('PROP') as keyof typeof UI_ELEMENT_PROPS_NAMES] || (UI_ELEMENT_COLORS_NAMES[this.getFieldValue('PROP') as keyof typeof UI_ELEMENT_COLORS_NAMES] + " Color")} property of "${this.getFieldValue('ELEMENT')}"`);
            },
            onchange(event) {
                if (event.type !== Blockly.Events.BLOCK_CHANGE) return;
                const propField = this.getField('PROP') as Blockly.FieldDropdown | null;
                const input = this.getInput('VALUE');
                const prop = propField?.getValue();
                const elementName = this.getFieldValue('ELEMENT');
                if (!input || !prop || !elementName) return;

                // Update PROP dropdown options
                const propOptions = propField?.getOptions() || [];
                propField?.setValue(propOptions.flat().includes(prop) ? prop : propOptions[0][1]);

                // Update Check
                const screen = getBlocklyActiveScreen();
                const element = screen?.uiElements.find(el => el.name === elementName);
                const propValue = element?.[prop as keyof UIElement];
                if (!element || typeof propValue === 'undefined') return;

                this.setTooltip(`Set the ${UI_ELEMENT_PROPS_NAMES[prop as keyof typeof UI_ELEMENT_PROPS_NAMES] || (UI_ELEMENT_COLORS_NAMES[prop as keyof typeof UI_ELEMENT_COLORS_NAMES] + " Color")} property of "${elementName}"`);
                input.setCheck(valueToType(propValue));
            }
        },
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            const prop = block.getFieldValue('PROP');
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);

            return `${gen.getIndent()}screen:childSetProp("${el}", "${prop}", ${value})`;
        }
    },
    'ui_get_prop': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('get')
                    .appendField(new Blockly.FieldDropdown(ELEMENTS), 'ELEMENT')
                    .appendField('.')
                    .appendField(new Blockly.FieldDropdown(function (this: Blockly.FieldDropdown) {
                        const elementName = this.getSourceBlock()?.getFieldValue('ELEMENT') || ELEMENTS()[0][0];
                        return elementName !== "(no elements)"
                            ? [...ELEMENT_PROPS(elementName), ...ELEMENT_COLOR_PROPS(elementName)]
                            : [['(no element)', '']];
                    }), 'PROP');
                this.setOutput(true, null);
                this.setStyle('ui_blocks');
                this.setTooltip(`Get the ${UI_ELEMENT_PROPS_NAMES[this.getFieldValue('PROP') as keyof typeof UI_ELEMENT_PROPS_NAMES] || (UI_ELEMENT_COLORS_NAMES[this.getFieldValue('PROP') as keyof typeof UI_ELEMENT_COLORS_NAMES] + " Color")} property of "${this.getFieldValue('ELEMENT')}"`);
            },
            onchange(event) {
                if (event.type !== Blockly.Events.BLOCK_CHANGE) return;
                const propField = this.getField('PROP') as Blockly.FieldDropdown | null;
                const prop = propField?.getValue();
                const elementName = this.getFieldValue('ELEMENT');
                if (!prop || !elementName) return;

                // Update PROP dropdown options
                const propOptions = propField?.getOptions() || [];
                propField?.setValue(propOptions.flat().includes(prop) ? prop : propOptions[0][1]);

                // Update Check
                const screen = getBlocklyActiveScreen();
                const element = screen?.uiElements.find(el => el.name === elementName);
                const propValue = element?.[prop as keyof UIElement];
                if (!element || typeof propValue === 'undefined') return;

                this.setTooltip(`Get the ${UI_ELEMENT_PROPS_NAMES[prop as keyof typeof UI_ELEMENT_PROPS_NAMES] || (UI_ELEMENT_COLORS_NAMES[prop as keyof typeof UI_ELEMENT_COLORS_NAMES] + " Color")} property of "${elementName}"`);
                this.setOutput(true, valueToType(propValue));
            }
        },
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            const prop = block.getFieldValue('PROP');
            return [`screen:getChild("${el}").${prop}`, Order.ATOMIC];
        }
    },
    'ui_set_prop_byname': {
        block: {
            init() {
                this.appendValueInput('ELEMENT').setCheck("String")
                    .appendField('set');
                this.appendValueInput('VALUE').setCheck(null)
                    .appendField('.')
                    .appendField(new Blockly.FieldDropdown(ALL_ELEMENT_PROPS), 'PROP')
                    .appendField('to');

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setInputsInline(true);
                this.setStyle('ui_blocks');
                this.setTooltip(`Set the element property using element name`);
            },
        },
        generator: (block, gen) => {
            const el = gen.valueToCode(block, 'ELEMENT', Order.NONE);
            const prop = block.getFieldValue('PROP');
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);

            return `${gen.getIndent()}screen:childSetProp(${el}, "${prop}", ${value})`;
        }
    },
    'ui_get_prop_byname': {
        block: {
            init() {
                this.appendValueInput('ELEMENT').setCheck("String")
                    .appendField('get')
                this.appendDummyInput()
                    .appendField('.')
                    .appendField(new Blockly.FieldDropdown(ALL_ELEMENT_PROPS), 'PROP');
                this.setOutput(true, null);
                this.setInputsInline(true);
                this.setStyle('ui_blocks');
                this.setTooltip(`Get the element property using element name`);
            },
        },
        generator: (block, gen) => {
            const el = gen.valueToCode(block, 'ELEMENT', Order.NONE);
            const prop = block.getFieldValue('PROP');
            return [`screen:getChild(${el}).${prop}`, Order.ATOMIC];
        }
    },
    'ui_navigate': {
        block: {
            init(this: Blockly.Block) {
                this.appendValueInput('SCREEN').setCheck('Screen')
                    .appendField('navigate to screen');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('ui_blocks');
                this.setTooltip('Navigate to a different screen');
            },
        },
        generator: (block, gen) => {
            const screen = (block.getFieldValue('SCREEN') || '').replace(/[^a-zA-Z0-9_]/g, '_');
            return `${gen.getIndent()}navigate("${screen}")`;
        }
    }
}; 