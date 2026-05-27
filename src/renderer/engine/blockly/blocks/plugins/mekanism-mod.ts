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
    // 'mekanism_events': {
    //     block: {
    //         init() {
    //             this.appendValueInput("PERIPHERAL").setCheck("String")
    //                 .appendField('when')
    //                 .appendField(new Blockly.FieldDropdown(function (this: Blockly.FieldDropdown) {
    //                     return EVENTS.map(ev => [ev.replace(/_/g, ' '), ev]);
    //                 }), 'EVENT')
    //             this.appendStatementInput('DO')
    //                 .appendField("do");
    //             this.setStyle('events_blocks');
    //             this.setTooltip(`Runs when the specified event occurs.`);
    //         },
    //         onchange(event) {
    //             if (event.type !== Blockly.Events.BLOCK_CHANGE) return;
    //             const eventField = this.getField('EVENT') as Blockly.FieldDropdown | null;
    //             const currentEventName = eventField?.getValue();
    //             if (typeof currentEventName !== 'string') return;

    //             // Update EVENT dropdown options
    //             const propOptions = eventField?.getOptions() || [];
    //             eventField?.setValue(propOptions.flat().includes(currentEventName) ? currentEventName : propOptions[0][1]);
    //         },
    //     },
    //     generator: (block, gen) => {
    //         const eventName = block.getFieldValue('EVENT');
    //         const body = gen.statementToCode(block, 'DO');
    //         const peripheral = gen.valueToCode(block, 'PERIPHERAL', Order.ATOMIC);
    //         return `${gen.getIndent()}screen.events["${peripheral}_${eventName}"] = function()\n${body}\nend`;
    //     }
    // },
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
                        ["HIGH", "HIGH"],
                        ["LOW", "LOW"],
                        ["PULSE", "PULSE"],
                        ["DISABLED", "DISABLED"],
                    ]), 'OPTION');
                this.setOutput(true, "String");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the redstone control mode name.");
            },
        },
        generator: (block, gen) => {
            const option = block.getFieldValue("OPTION");
            return [`"${option}"`, Order.ATOMIC];
        }
    },
    'mekanism_redstoneStatuses': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("redstone statuses")
                    .appendField(new Blockly.FieldDropdown([
                        ["IDLE", "IDLE"],
                        ["OUTPUTTING", "OUTPUTTING"],
                        ["POWERED", "POWERED"],
                    ]), 'OPTION');
                this.setOutput(true, "String");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the redstone status name.");
            },
        },
        generator: (block, gen) => {
            const option = block.getFieldValue("OPTION");
            return [`"${option}"`, Order.ATOMIC];
        }
    },
    'mekanism_firla_modes': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("fission reactor logic modes")
                    .appendField(new Blockly.FieldDropdown([
                        ["ACTIVATION", "ACTIVATION"],
                        ["CRITICAL_WASTE_LEVEL", "CRITICAL_WASTE_LEVEL"],
                        ["DAMAGED", "DAMAGED"],
                        ["DEPLETED", "DEPLETED"],
                        ["TEMPERATURE", "TEMPERATURE"],
                        ["DISABLED", "DISABLED"],
                    ]), 'OPTION');
                this.setOutput(true, "String");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the fission reactor logic options.");
            },
        },
        generator: (block, gen) => {
            const option = block.getFieldValue("OPTION");
            return [`"${option}"`, Order.ATOMIC];
        }
    },
    'mekanism_furla_modes': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("fusion reactor logic modes")
                    .appendField(new Blockly.FieldDropdown([
                        ["READY", "READY"],
                        ["CAPACITY", "CAPACITY"],
                        ["DEPLETED", "DEPLETED"],
                        ["DISABLED", "DISABLED"],
                    ]), 'OPTION');
                this.setOutput(true, "String");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the fusion reactor logic options.");
            },
        },
        generator: (block, gen) => {
            const option = block.getFieldValue("OPTION");
            return [`"${option}"`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_modes': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("boiler modes")
                    .appendField(new Blockly.FieldDropdown([
                        ["INPUT", "INPUT"],
                        ["OUTPUT_COOLANT", "OUTPUT_COOLANT"],
                        ["OUTPUT_STEAM", "OUTPUT_STEAM"],
                    ]), 'OPTION');
                this.setOutput(true, "String");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the boiler mode options.");
            },
        },
        generator: (block, gen) => {
            const option = block.getFieldValue("OPTION");
            return [`"${option}"`, Order.ATOMIC];
        }
    },
    'mekanism_dtce_modes': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("dynamic tank container edit modes")
                    .appendField(new Blockly.FieldDropdown([
                        ["BOTH", "BOTH"],
                        ["EMPTY", "EMPTY"],
                        ["FILL", "FILL"],
                    ]), 'OPTION');
                this.setOutput(true, "String");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the dynamic tank container edit options.");
            },
        },
        generator: (block, gen) => {
            const option = block.getFieldValue("OPTION");
            return [`"${option}"`, Order.ATOMIC];
        }
    },
    'mekanism_im_modes': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("induction matrix modes")
                    .appendField(new Blockly.FieldDropdown([
                        ["OUTPUT", "true"],
                        ["INPUT", "false"],
                    ]), 'OPTION');
                this.setOutput(true, "Boolean");
                this.setStyle("utility_blocks");
                this.setTooltip("Gives the induction matrix modes.");
            },
        },
        generator: (block, gen) => {
            const option = block.getFieldValue("OPTION");
            return [`${option}`, Order.ATOMIC];
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
    'mekanism_mbm_isFormed': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is formed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks if the multiblock is formed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isFormed()`, Order.ATOMIC];
        }
    },
    'mekanism_mbm_getHeight': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get height");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the height of the multiblock.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeight()`, Order.ATOMIC];
        }
    },
    'mekanism_mbm_getLength': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get length");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the length of the multiblock.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getLength()`, Order.ATOMIC];
        }
    },
    'mekanism_mbm_getWidth': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get width");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the width of the multiblock.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWidth()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_activate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("activate fission reactor");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Activates the fission reactor. Note: (Must be disabled, and if meltdowns are disabled must not have been force disabled)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.activate()`;
        }
    },
    'mekanism_fir_scram': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("scram fission reactor");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Scrams the fission reactor. Note: (Must be enabled)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.scram()`;
        }
    },
    'mekanism_fir_getStatus': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor status");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor status.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getStatus()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getTemperature': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor temperature");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor temperature.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTemperature()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_isForceDisabled': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is fission reactor force disabled");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks if the fission reactor is force disabled.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isForceDisabled()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getBurnRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor burn rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor burn rate. Note: (Gives the configured burn rate)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getBurnRate()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_setBurnRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set fission reactor burn rate");
                this.appendValueInput("RATE").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the fission reactor burn rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const rate = gen.valueToCode(block, "RATE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setBurnRate(${rate})`;
        }
    },
    'mekanism_fir_getActualBurnRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor actual burn rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor actual burn rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getActualBurnRate()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getBoilEfficiency': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor boil efficiency");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor boil efficiency.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getBoilEfficiency()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getCoolantCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor coolant capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor coolant capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getCoolantCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getCoolantFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor coolant filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor coolant filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getCoolantFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getCoolantNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor coolant needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor coolant needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getCoolantNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getDamagePercent': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor damage percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor damage percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDamagePercent()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getEnvironmentalLoss': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor environmental loss");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor environmental loss.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getEnvironmentalLoss()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getFuelAssemblies': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor fuel assemblies");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor fuel assemblies.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getFuelAssemblies()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getFuelCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor fuel capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor fuel capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getFuelCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getFuelFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor fuel filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor fuel filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getFuelFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getFuelNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor fuel needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor fuel needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getFuelNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getFuelSurfaceArea': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor fuel surface area");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor fuel surface area.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getFuelSurfaceArea()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getHeatCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor heat capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor heat capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeatCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getHeatedCoolantCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor heated coolant capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor heated coolant capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeatedCoolantCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getHeatedCoolantFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor heated coolant filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor heated coolant filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeatedCoolantFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getHeatedCoolantNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor heated coolant needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor heated coolant needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeatedCoolantNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getHeatingRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor heating rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor heating rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeatingRate()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getMaxBurnRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor max burn rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor max burn rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getMaxBurnRate()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getWasteCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor waste capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor waste capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWasteCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getWasteFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor waste filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor waste filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWasteFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fir_getWasteNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor waste needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor waste needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWasteNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_firla_getLogicMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor logic mode");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor logic adapter mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getLogicMode()`, Order.ATOMIC];
        }
    },
    'mekanism_firla_setLogicMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set fission reactor logic mode");
                this.appendValueInput("MODE").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the fission reactor logic adapter mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const mode = gen.valueToCode(block, "MODE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setLogicMode(${mode})`;
        }
    },
    'mekanism_firla_getRedstoneLogicStatus': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fission reactor redstone logic status");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fission reactor redstone logic adapter status.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getRedstoneLogicStatus()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getCaseTemperature': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor case temperature");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor case temperature.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getCaseTemperature()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getDTFuelCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor DT fuel capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor DT fuel capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDTFuelCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getDTFuelFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor DT fuel filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor DT fuel filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDTFuelFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getDTFuelNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor DT fuel needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor DT fuel needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDTFuelNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getDeuteriumCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor deuterium capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor deuterium capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDeuteriumCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getDeuteriumFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor deuterium filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor deuterium filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDeuteriumFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getDeuteriumNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor deuterium needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor deuterium needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDeuteriumNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getEnvironmentalLoss': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor environmental loss");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor environmental loss.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getEnvironmentalLoss()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getIgnitionTemperature': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor")
                    .appendField(new Blockly.FieldDropdown([
                        ["Water", "WATER"],
                        ["Air", "AIR"]
                    ]), "COOLING_TYPE")
                    .appendField("cooled ignition temperature");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor ignition temperature.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const coolingType = block.getFieldValue("COOLING_TYPE");
            return [`${peripheral}.getIgnitionTemperature(${coolingType == "WATER" ? "true" : "false"})`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getInjectionRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor injection rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor injection rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getInjectionRate()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getMaxCasingTemperature': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor")
                    .appendField(new Blockly.FieldDropdown([
                        ["Water", "WATER"],
                        ["Air", "AIR"]
                    ]), "COOLING_TYPE")
                    .appendField("cooled max casing temperature");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor max casing temperature.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const coolingType = block.getFieldValue("COOLING_TYPE");
            return [`${peripheral}.getMaxCasingTemperature(${coolingType == "WATER" ? "true" : "false"})`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getMaxPlasmaTemperature': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor")
                    .appendField(new Blockly.FieldDropdown([
                        ["Water", "WATER"],
                        ["Air", "AIR"]
                    ]), "COOLING_TYPE")
                    .appendField("cooled max plasma temperature");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor max plasma temperature.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const coolingType = block.getFieldValue("COOLING_TYPE");
            return [`${peripheral}.getMaxPlasmaTemperature(${coolingType == "WATER" ? "true" : "false"})`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getMinInjectionRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor")
                    .appendField(new Blockly.FieldDropdown([
                        ["Water", "WATER"],
                        ["Air", "AIR"]
                    ]), "COOLING_TYPE")
                    .appendField("cooled min injection rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor min injection rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const coolingType = block.getFieldValue("COOLING_TYPE");
            return [`${peripheral}.getMinInjectionRate(${coolingType == "WATER" ? "true" : "false"})`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getPassiveGeneration': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor")
                    .appendField(new Blockly.FieldDropdown([
                        ["Water", "WATER"],
                        ["Air", "AIR"]
                    ]), "COOLING_TYPE")
                    .appendField("cooled passive generation");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor passive generation.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const coolingType = block.getFieldValue("COOLING_TYPE");
            return [`${peripheral}.getPassiveGeneration(${coolingType == "WATER" ? "true" : "false"})`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getPlasmaTemperature': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor plasma temperature");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor plasma temperature.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getPlasmaTemperature()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getProductionRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor production rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor production rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getProductionRate()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getSteamCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor steam capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor steam capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSteamCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getSteamFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor steam filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor steam filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSteamFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getSteamNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor steam needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor steam needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSteamNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getTransferLoss': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor transfer loss");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor transfer loss.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTransferLoss()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getTritiumCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor tritium capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor tritium capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTritiumCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getTritiumFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor tritium filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor tritium filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTritiumFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getTritiumNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor tritium needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor tritium needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTritiumNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getWaterCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor water capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor water capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWaterCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getWaterFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor water filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor water filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWaterFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_getWaterNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor water needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor water needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWaterNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_isIgnited': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor ignition status");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor ignition status.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isIgnited()`, Order.ATOMIC];
        }
    },
    'mekanism_fur_setInjectionRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set fusion reactor injection rate");
                this.appendValueInput("RATE").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the fusion reactor injection rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const rate = gen.valueToCode(block, "RATE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setInjectionRate(${rate})`;
        }
    },
    'mekanism_furla_getLogicMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor logic mode");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor logic adapter mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getLogicMode()`, Order.ATOMIC];
        }
    },
    'mekanism_furla_setLogicMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set fusion reactor logic mode");
                this.appendValueInput("MODE").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the fusion reactor logic adapter mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const mode = gen.valueToCode(block, "MODE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setLogicMode(${mode})`;
        }
    },
    'mekanism_furla_isActiveCooledLogic': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get fusion reactor active cooled logic status");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the fusion reactor active cooled logic status.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isActiveCooledLogic()`, Order.ATOMIC];
        }
    },
    'mekanism_furla_setActiveCooledLogic': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set fusion reactor active cooled logic status");
                this.appendValueInput("ACTIVE").setCheck("Boolean")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the fusion reactor active cooled logic status.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const active = gen.valueToCode(block, "ACTIVE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setActiveCooledLogic(${active})`;
        }
    },
    'mekanism_boiler_getBoilCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler boil capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler boil capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getBoilCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getBoilRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler boil rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler boil rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getBoilRate()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getCooledCoolantCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler cooled coolant capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler cooled coolant capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getCooledCoolantCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getCooledCoolantFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler cooled coolant filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler cooled coolant filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getCooledCoolantFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getCooledCoolantNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler cooled coolant needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler cooled coolant needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getCooledCoolantNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getEnvironmentalLoss': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler environmental loss");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler environmental loss.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getEnvironmentalLoss()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getHeatedCoolantCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler heated coolant capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler heated coolant capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeatedCoolantCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getHeatedCoolantFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler heated coolant filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler heated coolant filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeatedCoolantFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getHeatedCoolantNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler heated coolant needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler heated coolant needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getHeatedCoolantNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getMaxBoilRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler max boil rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler max boil rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getMaxBoilRate()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getSteamCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler steam capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler steam capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSteamCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getSteamFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler steam filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler steam filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSteamFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getSteamNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler steam needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler steam needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSteamNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getSuperheaters': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler superheaters");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler superheaters.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSuperheaters()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getTemperature': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler temperature");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler temperature.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTemperature()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getWaterCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler water capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler water capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWaterCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getWaterFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler water filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler water filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWaterFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getWaterNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler water needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler water needed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getWaterNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_getMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get boiler mode");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the boiler mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getMode()`, Order.ATOMIC];
        }
    },
    'mekanism_boiler_setMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set boiler mode");
                this.appendValueInput("MODE").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the boiler mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const mode = gen.valueToCode(block, "MODE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setMode(${mode})`;
        }
    },
    'mekanism_im_getInstalledCells': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get installed cells");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the number of installed cells.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getInstalledCells()`, Order.ATOMIC];
        }
    },
    'mekanism_im_getInstalledProviders': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get installed providers");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the number of installed providers.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getInstalledProviders()`, Order.ATOMIC];
        }
    },
    'mekanism_im_getLastInput': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get last input");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the last input amount.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getLastInput()`, Order.ATOMIC];
        }
    },
    'mekanism_im_getLastOutput': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get last output");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the last output amount.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getLastOutput()`, Order.ATOMIC];
        }
    },
    'mekanism_im_getTransferCap': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get transfer capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the transfer capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTransferCap()`, Order.ATOMIC];
        }
    },
    'mekanism_im_getMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get induction matrix mode");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the induction matrix mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getMode()`, Order.ATOMIC];
        }
    },
    'mekanism_im_setMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set induction matrix mode");
                this.appendValueInput("MODE").setCheck("Boolean")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the induction matrix mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const mode = gen.valueToCode(block, "MODE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setMode(${mode})`;
        }
    },
    'mekanism_dt_getChemicalTankCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get chemical tank capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the chemical tank capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getChemicalTankCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_dt_getFilledPercentage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get filled percentage");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the filled percentage.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getFilledPercentage()`, Order.ATOMIC];
        }
    },
    'mekanism_dt_getTankCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get tank capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the tank capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTankCapacity()`, Order.ATOMIC];
        }
    },
    'mekanism_dt_getNeeded': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get needed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the needed amount.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getNeeded()`, Order.ATOMIC];
        }
    },
    'mekanism_dt_getContainerEditMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get container edit mode");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the container edit mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getContainerEditMode()`, Order.ATOMIC];
        }
    },
    'mekanism_dt_setContainerEditMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set container edit mode");
                this.appendValueInput("MODE").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the container edit mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const mode = gen.valueToCode(block, "MODE", Order.ATOMIC);
            return [`${peripheral}.setContainerEditMode(${mode})`, Order.ATOMIC];
        }
    },
};