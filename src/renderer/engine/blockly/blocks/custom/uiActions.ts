import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { ELEMENT_COLOR_PROPS, ELEMENT_PROPS, ELEMENTS, SCREENS, valueToType } from "../../ccBlocks";
import { Order } from "../../luaGenerator";
import { UI_ELEMENT_COLORS_NAMES, UI_ELEMENT_PROPS_NAMES, UIElement } from '@/models/UIElement';
import { useProjectStore } from '@/stores/projectStore';

export const uiActionsBlocks: Block = {
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
            return '';
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
                const store = useProjectStore.getState();
                const screen = store.getActiveScreen();
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
            const color = block.getFieldValue('COLOR');
            return `${gen.getIndent()}getElement("${el}").${prop} = ${color}\n${gen.getIndent()}drawCurrentScreen()`;
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
                const store = useProjectStore.getState();
                const screen = store.getActiveScreen();
                const element = screen?.uiElements.find(el => el.name === elementName);
                const propValue = element?.[prop as keyof UIElement];
                if (!element || typeof propValue === 'undefined') return;

                this.setTooltip(`Get the ${UI_ELEMENT_PROPS_NAMES[prop as keyof typeof UI_ELEMENT_PROPS_NAMES] || (UI_ELEMENT_COLORS_NAMES[prop as keyof typeof UI_ELEMENT_COLORS_NAMES] + " Color")} property of "${elementName}"`);
                this.setOutput(true, valueToType(propValue));
            }
        },
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            return [`getElement("${el}").text`, Order.ATOMIC];
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
    },
    'ui_set_progress': {
        block: {
            init(this: Blockly.Block) {
                this.appendValueInput('VALUE').setCheck('Number')
                    .appendField('set')
                    .appendField(new Blockly.FieldTextInput('progressbar1'), 'ELEMENT')
                    .appendField('progress to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('ui_blocks');
                this.setInputsInline(true);
                this.setTooltip('Set the progress value of a progress bar element');
            },
        },
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            const val = gen.valueToCode(block, 'VALUE', Order.NONE);
            return `${gen.getIndent()}getElement("${el}").value = ${val}\n${gen.getIndent()}drawCurrentScreen()`;
        }
    },
    'ui_get_value': {
        block: {
            init(this: Blockly.Block) {
                this.appendDummyInput()
                    .appendField('get')
                    .appendField(new Blockly.FieldTextInput('element1'), 'ELEMENT')
                    .appendField('value');
                this.setOutput(true, null);
                this.setStyle('ui_blocks');
                this.setTooltip('Get the current value of a UI element');
            },
        },
        generator: (block, gen) => {
            const el = block.getFieldValue('ELEMENT');
            return [`getElement("${el}").value`, Order.ATOMIC];
        }
    }
};