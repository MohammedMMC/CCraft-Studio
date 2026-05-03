import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";
import { ALIGNS, SIDES, TEXT_ALIGNS } from '../../ccBlocks';

export const utilityBlocks: Block = {
    'helpers_onoff': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown([
                        ['on', 'true'], ['off', 'false'],
                    ]), 'BOOL');
                this.setOutput(true, 'Boolean');
                this.setStyle('logic_blocks');
                this.setTooltip(Blockly.Msg['LOGIC_BOOLEAN_TOOLTIP']);
            },
        },
        generator: (block, gen) => {
            const bool = block.getFieldValue('BOOL');
            return [bool, Order.ATOMIC];
        }
    },
    'helpers_sides': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('side')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setOutput(true, 'Side');
                this.setStyle('text_blocks');
                this.setTooltip('Select side field');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [side, Order.ATOMIC];
        }
    },
    'helpers_units': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('unit')
                    .appendField(new Blockly.FieldDropdown([
                        ['px', 'px'], ['%', '%'], ['full', 'fill'],
                    ]), 'SIZE_UNIT');
                this.setOutput(true, 'SizeUnit');
                this.setStyle('text_blocks');
                this.setTooltip('Select size unit field');
            },
        },
        generator: (block, gen) => {
            const sizeUnit = block.getFieldValue('SIZE_UNIT');
            return [sizeUnit, Order.ATOMIC];
        }
    },
    'helpers_display': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('display')
                    .appendField(new Blockly.FieldDropdown([
                        ['flex', 'flex'], ['grid', 'grid'],
                    ]), 'DISPLAY');
                this.setOutput(true, 'Display');
                this.setStyle('text_blocks');
                this.setTooltip('Select display type field');
            },
        },
        generator: (block, gen) => {
            const display = block.getFieldValue('DISPLAY');
            return [display, Order.ATOMIC];
        }
    },
    'helpers_flexDirection': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('flex direction')
                    .appendField(new Blockly.FieldDropdown([
                        ['row', 'row'], ['column', 'column'],
                    ]), 'FLEX_DIRECTION');
                this.setOutput(true, 'FlexDirection');
                this.setStyle('text_blocks');
                this.setTooltip('Select flex direction field');
            },
        },
        generator: (block, gen) => {
            const flexDirection = block.getFieldValue('FLEX_DIRECTION');
            return [flexDirection, Order.ATOMIC];
        }
    },
    'helpers_orientation': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('orientation')
                    .appendField(new Blockly.FieldDropdown([
                        ['Horizontal LTR', 'hltr'], ['Horizontal RTL', 'hrtl'], ['Vertical TTB', 'vttb'], ['Vertical BTT', 'vbtt'],
                    ]), 'ORIENTATION');
                this.setOutput(true, 'Orientation');
                this.setStyle('text_blocks');
                this.setTooltip('Select orientation field');
            },
        },
        generator: (block, gen) => {
            const orientation = block.getFieldValue('ORIENTATION');
            return [orientation, Order.ATOMIC];
        }
    },
    'helpers_align': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('align')
                    .appendField(new Blockly.FieldDropdown([...new Map([...ALIGNS, ...TEXT_ALIGNS])]), 'ALIGN');
                this.setOutput(true, 'Align');
                this.setStyle('text_blocks');
                this.setTooltip('Select align field');
            },
            onchange(event) {
                if (![Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE].includes(event.type as any)) return;
                if ((event as any).reason && (event as any).reason[0] !== "connect") return;

                const propField = this.getParent()?.getField('PROP')?.getValue();
                const alignField = this.getField('ALIGN') as Blockly.FieldDropdown | null;

                if (!propField || !alignField) return;

                const currentOption = alignField.getValue();
                const oldOptions = alignField.getOptions();
                let newOptions: [string, string][] | null = null;

                if (propField === 'alignItems') {
                    newOptions = ALIGNS.filter(([_, v]) => v !== 'space-between');
                } else if (propField === 'justifyContent') {
                    newOptions = ALIGNS;
                } else if (propField === 'textAlign') {
                    newOptions = TEXT_ALIGNS;
                }

                if (!newOptions) return;

                if (!(oldOptions.length === newOptions.length
                    && oldOptions.every((item, index) =>
                        item[0] === newOptions[index][0] && item[1] === newOptions[index][1]
                    )
                )) alignField.setOptions(newOptions);

                if (typeof currentOption === 'string' && newOptions.flat().includes(currentOption) && !(alignField.getValue() === currentOption)) {
                    alignField.setValue(currentOption);
                }
            }
        },
        generator: (block, gen) => {
            const align = block.getFieldValue('ALIGN');
            return [align, Order.ATOMIC];
        }
    },
    'pcall_wrap': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('try');
                this.appendStatementInput('DO')
                    .setCheck(null);
                this.appendDummyInput()
                    .appendField('on error');
                this.appendStatementInput('CATCH')
                    .setCheck(null);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('utility_blocks');
                this.setTooltip('Try running code and catch any errors');
            },
        },
        generator: (block, gen) => {
            gen.indent();
            const doBody = gen.statementToCode(block, 'DO');
            gen.deindent();
            gen.indent();
            const catchBody = gen.statementToCode(block, 'CATCH');
            gen.deindent();
            return `${gen.getIndent()}local _ok, _err = pcall(function()\n${doBody}\n${gen.getIndent()}end)\n${gen.getIndent()}if not _ok then\n${catchBody}\n${gen.getIndent()}end`;
        }
    },
    'tonumber_val': {
        block: {
            init() {
                this.appendValueInput('TEXT').setCheck('String')
                    .appendField('text to number');
                this.setOutput(true, 'Number');
                this.setStyle('utility_blocks');
                this.setTooltip('Convert a text string to a number');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return [`tonumber(${text})`, Order.ATOMIC];
        }
    },
    'tostring_val': {
        block: {
            init() {
                this.appendValueInput('VALUE')
                    .appendField('to text');
                this.setOutput(true, 'String');
                this.setStyle('utility_blocks');
                this.setTooltip('Convert any value to a text string');
            },
        },
        generator: (block, gen) => {
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return [`tostring(${value})`, Order.ATOMIC];
        }
    },
    'type_of': {
        block: {
            init() {
                this.appendValueInput('VALUE')
                    .appendField('type of');
                this.setOutput(true, 'String');
                this.setStyle('utility_blocks');
                this.setTooltip('Get the type of a value (string, number, boolean, table, nil)');
            },
        },
        generator: (block, gen) => {
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return [`type(${value})`, Order.ATOMIC];
        }
    },
};