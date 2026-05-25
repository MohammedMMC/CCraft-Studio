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
                    .appendField("peripheral id for")
                    .appendField(new Blockly.FieldDropdown(Object.entries(PERIPHERAL_NAMES)), 'PERIPHERAL_NAME');
                this.setOutput(true, "String");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the ID of the specified peripheral.");
            },
        },
        generator: (block, gen) => {
            const peripheralName = block.getFieldValue("PERIPHERAL_NAME");
            return [`"${peripheralName}"`, Order.ATOMIC];
        }
    },
    'mekanism_redstoneModes': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("redstone modes")
                    .appendField(new Blockly.FieldDropdown([
                        ["DISABLED", "DISABLED"],
                        ["HIGH", "HIGH"],
                        ["LOW", "LOW"],
                        ["PULSE", "PULSE"],
                    ]), 'OPTION');
                this.setOutput(true, "String");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the redstone control options.");
            },
        },
        generator: (block, gen) => {
            const option = block.getFieldValue("OPTION");
            return [`"${option}"`, Order.ATOMIC];
        }
    },
    'mekanism_gmm_getComparatorLevel': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get comparator level");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the comparator level.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getComparatorLevel()`, Order.ATOMIC];
        }
    },
    'mekanism_gmm_getDirection': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get direction");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the direction.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDirection()`, Order.ATOMIC];
        }
    },
    'mekanism_gmm_getEnergy': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get energy");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the energy.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getEnergy()`, Order.ATOMIC];
        }
    },
    'mekanism_gmm_getEnergyFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get energy filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the energy filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getEnergyFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_gmm_getEnergyNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get energy needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the energy needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getEnergyNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_gmm_getMaxEnergy': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get max energy");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the max energy.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getMaxEnergy()`, Order.ATOMIC];
        }
    },
    'mekanism_gmm_getRedstoneMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get redstone mode");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the redstone mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getRedstoneMode()`, Order.ATOMIC];
        }
    },
    'mekanism_gmm_setRedstoneMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set redstone mode");
                this.appendValueInput("MODE").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the redstone mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const mode = gen.valueToCode(block, "MODE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setRedstoneMode(${mode})`;
        }
    },
};