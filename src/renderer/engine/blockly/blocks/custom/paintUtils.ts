import { GeneratorFunc, Order } from "../../luaGenerator";

export const paintUtilsBlocksGenerators: Record<string, GeneratorFunc> = {
    'paint_drawPixel': (block, gen) => {
        const x = gen.valueToCode(block, 'X', Order.NONE);
        const y = gen.valueToCode(block, 'Y', Order.NONE);
        const color = block.getFieldValue('COLOR');
        return `${gen.getIndent()}paintutils.drawPixel(${x}, ${y}, ${color})`;
    },
    'paint_drawLine': (block, gen) => {
        const x1 = gen.valueToCode(block, 'X1', Order.NONE);
        const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
        const x2 = gen.valueToCode(block, 'X2', Order.NONE);
        const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
        const color = block.getFieldValue('COLOR');
        return `${gen.getIndent()}paintutils.drawLine(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
    },
    'paint_drawBox': (block, gen) => {
        const x1 = gen.valueToCode(block, 'X1', Order.NONE);
        const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
        const x2 = gen.valueToCode(block, 'X2', Order.NONE);
        const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
        const color = block.getFieldValue('COLOR');
        return `${gen.getIndent()}paintutils.drawBox(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
    },
    'paint_drawFilledBox': (block, gen) => {
        const x1 = gen.valueToCode(block, 'X1', Order.NONE);
        const y1 = gen.valueToCode(block, 'Y1', Order.NONE);
        const x2 = gen.valueToCode(block, 'X2', Order.NONE);
        const y2 = gen.valueToCode(block, 'Y2', Order.NONE);
        const color = block.getFieldValue('COLOR');
        return `${gen.getIndent()}paintutils.drawFilledBox(${x1}, ${y1}, ${x2}, ${y2}, ${color})`;
    },
    'paint_drawImage': (block, gen) => {
        const image = gen.valueToCode(block, 'IMAGE', Order.NONE);
        const x = gen.valueToCode(block, 'X', Order.NONE);
        const y = gen.valueToCode(block, 'Y', Order.NONE);
        return `${gen.getIndent()}paintutils.drawImage(${image}, ${x}, ${y})`;
    },
    'paint_loadImage': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return [`paintutils.loadImage(${path})`, Order.ATOMIC];
    }
};