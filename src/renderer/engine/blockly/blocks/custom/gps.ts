import { GeneratorFunc, Order } from "../../luaGenerator";

export const gpsBlocksGenerators: Record<string, GeneratorFunc> = {
    'gps_locate': (block) => {
        const timeout = block.getFieldValue('TIMEOUT');
        return [`(function() local x,y,z = gps.locate(${timeout}); return {x=x,y=y,z=z} end)()`, Order.ATOMIC];
    }
};