import { GeneratorFunc, Order } from "../../luaGenerator";

export const logicBlocksGenerators: Record<string, GeneratorFunc> = {
    'logic_boolean': (block) => {
        return [block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false', Order.ATOMIC];
    },
    'logic_negate': (block, gen) => {
        const val = gen.valueToCode(block, 'BOOL', Order.HIGH);
        return [`not ${val}`, Order.HIGH];
    },
    'logic_operation': (block, gen) => {
        const op = block.getFieldValue('OP') === 'AND' ? 'and' : 'or';
        const order = op === 'and' ? Order.AND : Order.OR;
        const a = gen.valueToCode(block, 'A', order);
        const b = gen.valueToCode(block, 'B', order);
        return [`${a} ${op} ${b}`, order];
    },
    'logic_compare': (block, gen) => {
        const ops: Record<string, string> = { EQ: '==', NEQ: '~=', LT: '<', LTE: '<=', GT: '>', GTE: '>=' };
        const op = ops[block.getFieldValue('OP')] || '==';
        const a = gen.valueToCode(block, 'A', Order.RELATIONAL);
        const b = gen.valueToCode(block, 'B', Order.RELATIONAL);
        return [`${a} ${op} ${b}`, Order.RELATIONAL];
    }
}