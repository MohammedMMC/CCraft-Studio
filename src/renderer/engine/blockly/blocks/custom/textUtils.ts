import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const textUtilsBlocks: Block = {
    'textutils_slowPrint': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            const rate = gen.valueToCode(block, 'RATE', Order.NONE);
            return `${gen.getIndent()}textutils.slowPrint(${text}, ${rate})`;
        }
    },
    'textutils_slowWrite': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            const rate = gen.valueToCode(block, 'RATE', Order.NONE);
            return `${gen.getIndent()}textutils.slowWrite(${text}, ${rate})`;
        }
    },
    'textutils_serialize': {
        block: {},
        generator: (block, gen) => {
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return [`textutils.serialize(${value})`, Order.ATOMIC];
        }
    },
    'textutils_unserialize': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return [`textutils.unserialize(${text})`, Order.ATOMIC];
        }
    },
    'textutils_serializeJSON': {
        block: {},
        generator: (block, gen) => {
            const value = gen.valueToCode(block, 'VALUE', Order.NONE);
            return [`textutils.serializeJSON(${value})`, Order.ATOMIC];
        }
    },
    'textutils_unserializeJSON': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return [`textutils.unserializeJSON(${text})`, Order.ATOMIC];
        }
    },
    'textutils_urlEncode': {
        block: {},
        generator: (block, gen) => {
            const text = gen.valueToCode(block, 'TEXT', Order.NONE);
            return [`textutils.urlEncode(${text})`, Order.ATOMIC];
        }
    }
};