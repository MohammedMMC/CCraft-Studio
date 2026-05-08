import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

const PLUGIN_ID = "create-mod";

export const createmodBlocks: Blocks = {
    // 'createmod_event_overstressed': {
    //     block: {
    //         init() {
    //             this.appendDummyInput()
    //                 .appendField('Every')
    //                 .appendField(new Blockly.FieldNumber(1, 0.05), 'INTERVAL')
    //                 .appendField('seconds');
    //             this.appendStatementInput('DO')
    //                 .appendField("do");
    //             this.setStyle('events_blocks');
    //             this.setTooltip('Runs repeatedly at a timed interval');
    //         },
    //     },
    //     generator: (block, gen) => {
    //         const interval = block.getFieldValue('INTERVAL');
    //         const body = gen.statementToCode(block, 'DO');
    //         return `-- [EVENT:timer:${interval}]\n${body}\n-- [/EVENT:timer:${interval}]`;
    //     }
    // },
    'createmod_getStress': {
        block: {
            init() {
                this.appendDummyInput("PERIPHERAL").setCheck("Array")
                    .appendField("get stress level");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the connected network\'s current stress level.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getStress()`, Order.ATOMIC];
        }
    },
};