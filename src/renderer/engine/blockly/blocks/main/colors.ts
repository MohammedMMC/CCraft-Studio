import { GeneratorFunc, Order } from "../../luaGenerator";

export const colorsBlocksGenerators: Record<string, GeneratorFunc> = {
    'color_picker': (block, gen) => {
        return [block.getFieldValue('COLOR') || 'white', Order.ATOMIC];
    }
}