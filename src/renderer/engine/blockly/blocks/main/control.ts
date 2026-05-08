import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const controlBlocks: Blocks = {
    'controls_repeat_ext': {
        generator: (block, gen) => {
            const times = gen.valueToCode(block, 'TIMES', Order.NONE);
            gen.indent();
            const body = gen.statementToCode(block, 'DO');
            gen.deindent();
            return `${gen.getIndent()}for _i = 1, ${times} do\n${body}\n${gen.getIndent()}end`;
        }
    },
    'controls_whileUntil': {
        generator: (block, gen) => {
            const mode = block.getFieldValue('MODE');
            let cond = gen.valueToCode(block, 'BOOL', Order.NONE);
            if (mode === 'UNTIL') cond = `not (${cond})`;
            gen.indent();
            const body = gen.statementToCode(block, 'DO');
            gen.deindent();
            return `${gen.getIndent()}while ${cond} do\n${body}\n${gen.getIndent()}end`;
        }
    },
    'controls_for': {
        generator: (block, gen) => {
            const varName = (block.getFieldValue('VAR') || 'i').replace(/[^a-zA-Z0-9_]/g, '_');
            const from = gen.valueToCode(block, 'FROM', Order.NONE);
            const to = gen.valueToCode(block, 'TO', Order.NONE);
            const by = gen.valueToCode(block, 'BY', Order.NONE);
            gen.indent();
            const body = gen.statementToCode(block, 'DO');
            gen.deindent();
            return `${gen.getIndent()}for ${varName} = ${from}, ${to}, ${by} do\n${body}\n${gen.getIndent()}end`;
        }
    },
    'controls_forEach': {
        generator: (block, gen) => {
            const varName = (block.getFieldValue('VAR') || 'item').replace(/[^a-zA-Z0-9_]/g, '_');
            const list = gen.valueToCode(block, 'LIST', Order.NONE);
            gen.indent();
            const body = gen.statementToCode(block, 'DO');
            gen.deindent();
            return `${gen.getIndent()}for _, ${varName} in ipairs(${list}) do\n${body}\n${gen.getIndent()}end`;
        }
    },
    'controls_flow_statements': {
        generator: (block, gen) => {
            const flow = block.getFieldValue('FLOW');
            return `${gen.getIndent()}${flow === 'BREAK' ? 'break' : 'return'}`;
        }
    },
    'controls_if': {
        generator: (block, gen) => {
            let code = '';
            let n = 0;
            while (block.getInput(`IF${n}`)) {
                const cond = gen.valueToCode(block, `IF${n}`, Order.NONE);
                gen.indent();
                const body = gen.statementToCode(block, `DO${n}`);
                gen.deindent();
                const keyword = n === 0 ? 'if' : 'elseif';
                code += `${gen.getIndent()}${keyword} ${cond} then\n${body}\n`;
                n++;
            }
            if (block.getInput('ELSE')) {
                gen.indent();
                const elseBody = gen.statementToCode(block, 'ELSE');
                gen.deindent();
                code += `${gen.getIndent()}else\n${elseBody}\n`;
            }
            code += `${gen.getIndent()}end`;
            return code;
        }
    }
};