import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

const PLUGIN_ID = "create-mod";

const EVENTS = [
    "overstressed", "stress_change", "speed_change"
];

export const createmodBlocks: Blocks = {
    'createmod_events': {
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
    'createmod_gearshift_rotate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("rotate gearshift");
                this.appendValueInput("ANGLE").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("angle");
                this.appendValueInput("SPEED").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("speed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Rotates connected components by a set angle.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const angle = gen.valueToCode(block, "ANGLE", Order.ATOMIC);
            const speed = gen.valueToCode(block, "SPEED", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.rotate(${angle}, ${speed})`;
        }
    },
    'createmod_gearshift_move': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("move gearshift");
                this.appendValueInput("DISTANCE").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("distance");
                this.appendValueInput("SPEED").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("speed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Rotates connected components to move connected piston, pulley or gantry contractions by a set distance.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const distance = gen.valueToCode(block, "DISTANCE", Order.ATOMIC);
            const speed = gen.valueToCode(block, "SPEED", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.move(${distance}, ${speed})`;
        }
    },
    'createmod_isRunning': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is running");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks if the sequenced gearshift is currently spinning.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isRunning()`, Order.ATOMIC];
        }
    },
    'createmod_setTargetSpeed': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set target speed");
                this.appendValueInput("SPEED").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("speed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the rotation speed controller's target speed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const speed = gen.valueToCode(block, "SPEED", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setTargetSpeed(${speed})`;
        }
    },
    'createmod_getTargetSpeed': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get target speed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the rotation speed controller's current target speed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTargetSpeed()`, Order.ATOMIC];
        }
    },
    'createmod_setGeneratedSpeed': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set generated speed");
                this.appendValueInput("SPEED").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("speed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the creative motor's generated speed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const speed = gen.valueToCode(block, "SPEED", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setGeneratedSpeed(${speed})`;
        }
    },
    'createmod_getGeneratedSpeed': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get generated speed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the creative motor's current generated speed.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getGeneratedSpeed()`, Order.ATOMIC];
        }
    },
    'createmod_getSpeed': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get speed");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the current rotation speed of the attached components.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSpeed()`, Order.ATOMIC];
        }
    },
    'createmod_getStress': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get stress level");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the connected network's current stress level.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getStress()`, Order.ATOMIC];
        }
    },
    'createmod_getStressCapacity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get stress capacity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the connected network's total stress capacity.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getStressCapacity()`, Order.ATOMIC];
        }
    },
};