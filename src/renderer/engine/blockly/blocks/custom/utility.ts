import { GeneratorFunc, Order } from "../../luaGenerator";

export const utilityBlocksGenerators: Record<string, GeneratorFunc> = {
    'term_print': (block, gen) => {
        const text = gen.valueToCode(block, 'TEXT', Order.NONE);
        return `${gen.getIndent()}print(${text})`;
    },
    'term_redirect': (block, gen) => {
        const dest = gen.valueToCode(block, 'TYPE', Order.NONE);
        return `${gen.getIndent()}term.redirect(${dest})`;
    },
    'sleep_secs': (block, gen) => {
        const secs = gen.valueToCode(block, 'SECS', Order.NONE);
        return `${gen.getIndent()}sleep(${secs})`;
    },
    'pcall_wrap': (block, gen) => {
        gen.indent();
        const doBody = gen.statementToCode(block, 'DO');
        gen.deindent();
        gen.indent();
        const catchBody = gen.statementToCode(block, 'CATCH');
        gen.deindent();
        return `${gen.getIndent()}local _ok, _err = pcall(function()\n${doBody}\n${gen.getIndent()}end)\n${gen.getIndent()}if not _ok then\n${catchBody}\n${gen.getIndent()}end`;
    },
    'tonumber_val': (block, gen) => {
        const text = gen.valueToCode(block, 'TEXT', Order.NONE);
        return [`tonumber(${text})`, Order.ATOMIC];
    },
    'tostring_val': (block, gen) => {
        const value = gen.valueToCode(block, 'VALUE', Order.NONE);
        return [`tostring(${value})`, Order.ATOMIC];
    },
    'type_of': (block, gen) => {
        const value = gen.valueToCode(block, 'VALUE', Order.NONE);
        return [`type(${value})`, Order.ATOMIC];
    },
    'term_read': (block, gen) => {
        return [`read()`, Order.ATOMIC];
    }
};