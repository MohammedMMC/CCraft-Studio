import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const httpBlocks: Block = {
    'http_postRequest': {
        block: {
            init() {
                this.appendValueInput('URL').setCheck('String')
                    .appendField('HTTP POST to');
                this.appendValueInput('BODY').setCheck('String')
                    .appendField('body');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('http_blocks');
                this.setInputsInline(true);
                this.setTooltip('Send an HTTP POST request with a body');
            },
        },
        generator: (block, gen) => {
            const url = gen.valueToCode(block, 'URL', Order.NONE);
            const body = gen.valueToCode(block, 'BODY', Order.NONE);
            return `${gen.getIndent()}http.post(${url}, ${body})`;
        }
    },
    'http_get': {
        block: {
            init() {
                this.appendValueInput('URL').setCheck('String')
                    .appendField('HTTP GET');
                this.setOutput(true, 'String');
                this.setStyle('http_blocks');
                this.setTooltip('Send an HTTP GET request and return the response body');
            },
        },
        generator: (block, gen) => {
            const url = gen.valueToCode(block, 'URL', Order.NONE);
            return [`(function() local r = http.get(${url}); if r then local d = r.readAll(); r.close(); return d end; return nil end)()`, Order.ATOMIC];
        }
    },
    'http_checkURL': {
        block: {
            init() {
                this.appendValueInput('URL').setCheck('String')
                    .appendField('URL');
                this.appendDummyInput()
                    .appendField('is reachable?');
                this.setOutput(true, 'Boolean');
                this.setStyle('http_blocks');
                this.setInputsInline(true);
                this.setTooltip('Check if a URL is reachable and allowed');
            },
        },
        generator: (block, gen) => {
            const url = gen.valueToCode(block, 'URL', Order.NONE);
            return [`http.checkURL(${url})`, Order.ATOMIC];
        }
    }
};