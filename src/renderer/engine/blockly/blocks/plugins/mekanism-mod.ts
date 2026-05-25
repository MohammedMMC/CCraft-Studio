import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

const PLUGIN_ID = "mekanism-mod";

const PERIPHERAL_NAMES = {
    "Energy API": "computerEnergyHelper",
    "Filter API": "computerFilterHelper",
    "Fission Reactor Logic Adapter": "fissionReactorLogicAdapter",
    "Fission Reactor Port": "fissionReactorPort",
    "Fusion Reactor Logic Adapter": "fusionReactorLogicAdapter",
    "Fusion Reactor Port": "fusionReactorPort",
};

const EVENTS = [
    "nil"
];

export const mekanismBlocks: Blocks = {
    'mekanism_events': {
        block: {
            init() {
                this.appendValueInput("PERIPHERAL").setCheck("String")
                    .appendField('when')
                    .appendField(new Blockly.FieldDropdown(function (this: Blockly.FieldDropdown) {
                        return EVENTS.map(ev => [ev.replace(/_/g, ' '), ev]);
                    }), 'EVENT')
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip(`Runs when the specified event occurs.`);
            },
            onchange(event) {
                if (event.type !== Blockly.Events.BLOCK_CHANGE) return;
                const eventField = this.getField('EVENT') as Blockly.FieldDropdown | null;
                const currentEventName = eventField?.getValue();
                if (typeof currentEventName !== 'string') return;

                // Update EVENT dropdown options
                const propOptions = eventField?.getOptions() || [];
                eventField?.setValue(propOptions.flat().includes(currentEventName) ? currentEventName : propOptions[0][1]);
            },
        },
        generator: (block, gen) => {
            const eventName = block.getFieldValue('EVENT');
            const body = gen.statementToCode(block, 'DO');
            const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.ATOMIC);
            return `${gen.getIndent()}screen.events["${peripheral}_${eventName}"] = function()\n${body}\nend`;
        }
    },
    'mekanism_peripheralNames': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get peripheral name");
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(function (this: Blockly.FieldDropdown) {
                        return Object.entries(PERIPHERAL_NAMES).map(([key, value]) => [key, value]);
                    }), 'PERIPHERAL_NAME');
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the name of the specified peripheral.");
            },
        },
        generator: (block, gen) => {
            const peripheralName = block.getFieldValue("PERIPHERAL_NAME");
            return [`("${peripheralName}")`, Order.ATOMIC];
        }
    },
    // 'mekanism_logistics_getConfiguration': {
    //     block: {
    //         init() {
    //             this.appendDummyInput()
    //                 .appendField("get logistics configuration");
    //             this.appendValueInput("PERIPHERAL").setCheck("Array")
    //                 .setAlign(Blockly.inputs.Align.RIGHT)
    //                 .appendField("peripheral");
    //             this.setOutput(true, "String");
    //             this.setStyle(`${PLUGIN_ID}_blocks`);
    //             this.setTooltip("Gets the logistics configuration.");
    //         },
    //     },
    //     generator: (block, gen) => {
    //         const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
    //         return [`${peripheral}.getConfiguration()`, Order.ATOMIC];
    //     }
    // },
};