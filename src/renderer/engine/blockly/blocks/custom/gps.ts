import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const gpsBlocks: Block = {
    'gps_locate': {
        block: {},
        generator: (block, gen) => {
            const timeout = block.getFieldValue('TIMEOUT');
            return [`(function() local x,y,z = gps.locate(${timeout}); return {x=x,y=y,z=z} end)()`, Order.ATOMIC];
        }
    }
};