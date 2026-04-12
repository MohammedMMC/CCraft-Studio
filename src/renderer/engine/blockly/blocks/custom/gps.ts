import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const gpsBlocks: Block = {
    'gps_locate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('GPS locate');
                this.appendDummyInput()
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('timeout')
                    .appendField(new Blockly.FieldNumber(2, 0), 'TIMEOUT');
                this.setOutput(true, null);
                this.setStyle('gps_blocks');
                this.setTooltip('Locate the computer using GPS. Returns x, y, z coordinates as a table.');
            },
        },
        generator: (block, gen) => {
            const timeout = block.getFieldValue('TIMEOUT');
            return [`(function() local x,y,z = gps.locate(${timeout}); return {x=x,y=y,z=z} end)()`, Order.ATOMIC];
        }
    }
};