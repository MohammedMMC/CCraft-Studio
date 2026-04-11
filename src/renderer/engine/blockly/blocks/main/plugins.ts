import { GeneratorFunc, Order } from "../../luaGenerator";

export const pluginsBlocksGenerators: Record<string, GeneratorFunc> = {
    'global_declaration': (block, gen) => {
        const name = sanitizeVar(block.getFieldValue('NAME') || 'myVar');
        const value = gen.valueToCode(block, 'VALUE', Order.NONE);
        return `${name} = ${value}`;
    },
    'lexical_variable_get': (block, gen) => {
        const name = sanitizeVar(block.getFieldValue('VAR') || 'x');
        return [name, Order.ATOMIC];
    },
    'lexical_variable_set': (block, gen) => {
        const name = sanitizeVar(block.getFieldValue('VAR') || 'x');
        const value = gen.valueToCode(block, 'VALUE', Order.NONE);
        return `${name} = ${value}`;
    },
    'local_declaration_statement': (block, gen) => {
        const lines: string[] = [];
        for (let i = 0; block.getInput('DECL' + i); i++) {
            const varName = sanitizeVar(block.getFieldValue('VAR' + i) || `var${i}`);
            const value = gen.valueToCode(block, 'DECL' + i, Order.NONE);
            lines.push(`${gen.getIndent()}local ${varName} = ${value}`);
        }
        gen.indent();
        const body = gen.statementToCode(block, 'STACK');
        gen.deindent();
        return lines.join('\n') + '\n' + body;
    },
    'local_declaration_expression': (block, gen) => {
        const decls: string[] = [];
        for (let i = 0; block.getInput('DECL' + i); i++) {
            const varName = sanitizeVar(block.getFieldValue('VAR' + i) || `var${i}`);
            const value = gen.valueToCode(block, 'DECL' + i, Order.NONE);
            decls.push(`local ${varName} = ${value}`);
        }
        const returnVal = gen.valueToCode(block, 'RETURN', Order.NONE);
        // Expression blocks need to return a value; wrap locals + return in a do-end
        const code = `(function()\n  ${decls.join('\n  ')}\n  return ${returnVal}\nend)()`;
        return [code, Order.ATOMIC];
    },
    'simple_local_declaration_statement': (block, gen) => {
        const varName = sanitizeVar(block.getFieldValue('VAR') || 'x');
        const value = gen.valueToCode(block, 'DECL', Order.NONE);
        gen.indent();
        const body = gen.statementToCode(block, 'DO');
        gen.deindent();
        return `${gen.getIndent()}local ${varName} = ${value}\n${body}`;
    },
    'controls_do_then_return': (block, gen) => {
        gen.indent();
        const stm = gen.statementToCode(block, 'STM');
        gen.deindent();
        const value = gen.valueToCode(block, 'VALUE', Order.NONE);
        const code = `(function()\n${stm}\n  return ${value}\nend)()`;
        return [code, Order.ATOMIC];
    }
}

function stripVarPrefix(raw: string): string {
    const prefixes = ['global ', 'input ', 'local ', 'counter ', 'item '];
    for (const p of prefixes) {
        if (raw.startsWith(p)) return raw.substring(p.length);
    }
    return raw;
}
function sanitizeVar(raw: string): string {
    return stripVarPrefix(raw).replace(/[^a-zA-Z0-9_]/g, '_');
}