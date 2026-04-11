import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const diskBlocks: Block = {
    'disk_eject': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return `${gen.getIndent()}disk.eject("${side}")`;
        }
    },
    'disk_setLabel': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const label = gen.valueToCode(block, 'LABEL', Order.NONE);
            return `${gen.getIndent()}disk.setLabel("${side}", ${label})`;
        }
    },
    'disk_isPresent': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.isPresent("${side}")`, Order.ATOMIC];
        }
    },
    'disk_hasData': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.hasData("${side}")`, Order.ATOMIC];
        }
    },
    'disk_hasAudio': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.hasAudio("${side}")`, Order.ATOMIC];
        }
    },
    'disk_getLabel': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.getLabel("${side}")`, Order.ATOMIC];
        }
    },
    'disk_getMountPath': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.getMountPath("${side}")`, Order.ATOMIC];
        }
    }
};