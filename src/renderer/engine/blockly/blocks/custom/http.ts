import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const httpBlocks: Block = {
    'http_postRequest': {
        block: {},
        generator: (block, gen) => {
            const url = gen.valueToCode(block, 'URL', Order.NONE);
            const body = gen.valueToCode(block, 'BODY', Order.NONE);
            return `${gen.getIndent()}http.post(${url}, ${body})`;
        }
    },
    'http_get': {
        block: {},
        generator: (block, gen) => {
            const url = gen.valueToCode(block, 'URL', Order.NONE);
            return [`(function() local r = http.get(${url}); if r then local d = r.readAll(); r.close(); return d end; return nil end)()`, Order.ATOMIC];
        }
    },
    'http_checkURL': {
        block: {},
        generator: (block, gen) => {
            const url = gen.valueToCode(block, 'URL', Order.NONE);
            return [`http.checkURL(${url})`, Order.ATOMIC];
        }
    }
};