import { GeneratorFunc, Order } from "../../luaGenerator";

export const diskBlocksGenerators: Record<string, GeneratorFunc> = {
    'disk_eject': (block, gen) => {
        const side = block.getFieldValue('SIDE');
        return `${gen.getIndent()}disk.eject("${side}")`;
    },
    'disk_setLabel': (block, gen) => {
        const side = block.getFieldValue('SIDE');
        const label = gen.valueToCode(block, 'LABEL', Order.NONE);
        return `${gen.getIndent()}disk.setLabel("${side}", ${label})`;
    },
    'disk_isPresent': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`disk.isPresent("${side}")`, Order.ATOMIC];
    },
    'disk_hasData': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`disk.hasData("${side}")`, Order.ATOMIC];
    },
    'disk_hasAudio': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`disk.hasAudio("${side}")`, Order.ATOMIC];
    },
    'disk_getLabel': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`disk.getLabel("${side}")`, Order.ATOMIC];
    },
    'disk_getMountPath': (block) => {
        const side = block.getFieldValue('SIDE');
        return [`disk.getMountPath("${side}")`, Order.ATOMIC];
    }
};