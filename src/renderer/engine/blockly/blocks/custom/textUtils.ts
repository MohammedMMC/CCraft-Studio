import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const textUtilsBlocks: Blocks = {
    'textutils_slowPrint': {
        block: {
            init() {
                this.appendValueInput('TEXT').setCheck('String')
                    .appendField('slow print');
                this.appendValueInput('RATE').setCheck('Number')
                    .appendField('rate');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('text_blocks');
                this.setInputsInline(true);
                this.setTooltip('Print text character by character at the given rate');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            const rate = gen.valueToCode(block, 'RATE', Order.NONE);
            return `${gen.getIndent()}textutils.slowPrint(${text}, ${rate})`;
        }
    },
    'textutils_slowWrite': {
        block: {
            init() {
                this.appendValueInput('TEXT').setCheck('String')
                    .appendField('slow write');
                this.appendValueInput('RATE').setCheck('Number')
                    .appendField('rate');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('text_blocks');
                this.setInputsInline(true);
                this.setTooltip('Write text character by character at the given rate (no newline)');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            const rate = gen.valueToCode(block, 'RATE', Order.NONE);
            return `${gen.getIndent()}textutils.slowWrite(${text}, ${rate})`;
        }
    },
    'textutils_serialize': {
        block: {
            init() {
                this.appendValueInput('VALUE')
                    .appendField('serialize');
                this.setOutput(true, 'String');
                this.setStyle('text_blocks');
                this.setTooltip('Convert a Lua value to a string representation');
            },
        },
        generator: (block, gen) => {
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return [`textutils.serialize(${value})`, Order.ATOMIC];
        }
    },
    'textutils_unserialize': {
        block: {
            init() {
                this.appendValueInput('TEXT').setCheck('String')
                    .appendField('unserialize');
                this.setOutput(true, null);
                this.setStyle('text_blocks');
                this.setTooltip('Convert a serialized string back to a Lua value');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return [`textutils.unserialize(${text})`, Order.ATOMIC];
        }
    },
    'textutils_serializeJSON': {
        block: {
            init() {
                this.appendValueInput('VALUE')
                    .appendField('to JSON');
                this.setOutput(true, 'String');
                this.setStyle('text_blocks');
                this.setTooltip('Convert a Lua value to a JSON string');
            },
        },
        generator: (block, gen) => {
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return [`textutils.serializeJSON(${value})`, Order.ATOMIC];
        }
    },
    'textutils_unserializeJSON': {
        block: {
            init() {
                this.appendValueInput('TEXT').setCheck('String')
                    .appendField('from JSON');
                this.setOutput(true, null);
                this.setStyle('text_blocks');
                this.setTooltip('Parse a JSON string into a Lua value');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return [`textutils.unserializeJSON(${text})`, Order.ATOMIC];
        }
    },
    'textutils_urlEncode': {
        block: {
            init() {
                this.appendValueInput('TEXT').setCheck('String')
                    .appendField('URL encode');
                this.setOutput(true, 'String');
                this.setStyle('text_blocks');
                this.setTooltip('URL-encode a string for safe use in URLs');
            },
        },
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return [`textutils.urlEncode(${text})`, Order.ATOMIC];
        }
    }
};