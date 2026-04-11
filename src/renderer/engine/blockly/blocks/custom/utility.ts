import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const utilityBlocks: Block = {
    'term_print': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return `${gen.getIndent()}print(${text})`;
        }
    },
    'term_redirect': {
        block: {},
        generator: (block, gen) => {
            const dest = gen.valueToCode(block, 'TYPE', Order.NONE);
            return `${gen.getIndent()}term.redirect(${dest})`;
        }
    },
    'sleep_secs': {
        block: {},
        generator: (block, gen) => {
            const secs = gen.valueToCode(block, 'SECS', Order.NONE);
            return `${gen.getIndent()}sleep(${secs})`;
        }
    },
    'pcall_wrap': {
        block: {},
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
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return [`tonumber(${text})`, Order.ATOMIC];
        }
    },
    'tostring_val': {
        block: {},
        generator: (block, gen) => {
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return [`tostring(${value})`, Order.ATOMIC];
        }
    },
    'type_of': {
        block: {},
        generator: (block, gen) => {
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return [`type(${value})`, Order.ATOMIC];
        }
    },
    'term_read': {
        block: {},
        generator: (block, gen) => {
            return [`read()`, Order.ATOMIC];
        }
    }
};