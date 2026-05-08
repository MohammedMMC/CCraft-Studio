import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

const PLUGIN_ID = "create-mod";

const EVENTS = [
    "overstressed", "stress_change", "speed_change",
    "train_passing", "train_passed", "train_signal_state_change",
    "train_imminent", "train_arrival", "train_departure",
    "package_sent", "package_received",
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
    'createmod_logistics_getAddress': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get logistics configuration");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the logistics address.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getAddress()`, Order.ATOMIC];
        }
    },
    'createmod_logistics_setAddress': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set logistics address");
                this.appendValueInput("ADDRESS").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("address");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the logistics address.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const address = gen.valueToCode(block, "ADDRESS", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setAddress(${address})`;
        }
    },
    'createmod_logistics_getConfiguration': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get logistics configuration");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the logistics configuration.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getConfiguration()`, Order.ATOMIC];
        }
    },
    'createmod_logistics_setConfiguration': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set logistics configuration");
                this.appendValueInput("CONFIG").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("configuration");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the logistics configuration to either \"send_receive\" or \"send\"");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const config = gen.valueToCode(block, "CONFIG", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setConfiguration(${config})`;
        }
    },
    'createmod_logistics_getItemDetail': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get item details");
                this.appendValueInput("SLOT").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("slot");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, ["LOGISTICS_ITEM_DETAIL", "Null"]);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Get detailed information about an item in the connected inventory. Note: (Throws error If the slot is out of range.)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const slot = gen.valueToCode(block, "SLOT", Order.ATOMIC);
            return [`${peripheral}.getItemDetail(${slot})`, Order.ATOMIC];
        }
    },
    'createmod_logistics_getItemDataFromDetails': {
        block: {
            init() {
                this.appendValueInput("DETAILS").setCheck("LOGISTICS_ITEM_DETAIL")
                    .appendField("get")
                    .appendField(new Blockly.FieldDropdown([["name", "name:String"], ["display name", "displayName:String"], ["count", "count:Number"], ["max count", "maxCount:Number"]]), "DATA")
                    .appendField("from details");
                this.setOutput(true, ["String", "Number", "Null"]);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Get specific data of an item details.");
            },
            onchange(event) {
                if (event.type !== Blockly.Events.BLOCK_CHANGE) return;
                const dataField = this.getField('DATA') as Blockly.FieldDropdown | null;
                const currentData = dataField?.getValue();
                if (typeof currentData !== 'string') return;

                const [prop, type] = currentData.split(':');
                this.setOutput(true, type);
            }
        },
        generator: (block, gen) => {
            const details = gen.valueToCode(block, "DETAILS", Order.ATOMIC);
            const data = block.getFieldValue("DATA");
            const [dataProp, dataType] = data.split(':');
            return [`${details}.${dataProp}()`, Order.ATOMIC];
        }
    },
    'createmod_logistics_makePackage': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("make package");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Activates the packager like if it was powered by redstone.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.makePackage()`, Order.ATOMIC];
        }
    },
    'createmod_train_assemble': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("assemble train");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Assembles the station's currently present train. Note: (Throws error If the station is not connected to a track or fails to assemble)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.assemble()`;
        }
    },
    'createmod_train_disassemble': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("disassemble train");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Disassembles the station's currently present train. Note: (Throws error If the station is not connected to a track or fails to disassemble)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.disassemble()`;
        }
    },
    'createmod_train_setAssemblyMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set train in assembly mode");
                this.appendValueInput("MODE").setCheck("Boolean")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("mode");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the station's assembly mode. Note: (Throws error If the station is not connected to a track or assembly mode fails to set)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const mode = gen.valueToCode(block, "MODE", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setAssemblyMode(${mode})`;
        }
    },
    'createmod_train_isInAssemblyMode': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is train in assembly mode");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks whether the station is in assembly mode.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isInAssemblyMode()`, Order.ATOMIC];
        }
    },
    'createmod_train_getStationName': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get station name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the station's current name. Note: (Throws error If the station is not connected to a track)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getStationName()`, Order.ATOMIC];
        }
    },
    'createmod_train_setStationName': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set station name");
                this.appendValueInput("NEW_NAME").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("new name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the station's name. Note: (Throws error If the station is not connected to a track or name fails to set)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const newName = gen.valueToCode(block, "NEW_NAME", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setStationName(${newName})`;
        }
    },
    'createmod_train_isTrainPresent': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is train present");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks whether a train is currently present at the station. Note: (Throws error If the station is not connected to a track)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isTrainPresent()`, Order.ATOMIC];
        }
    },
    'createmod_train_isTrainImminent': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is train imminent");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks whether a train is imminently arriving at the station. Note: (Throws error If the station is not connected to a track)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isTrainImminent()`, Order.ATOMIC];
        }
    },
    'createmod_train_isTrainEnroute': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is train enroute");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks whether a train is enroute and navigating to the station. Note: (Throws error If the station is not connected to a track)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isTrainEnroute()`, Order.ATOMIC];
        }
    },
    'createmod_train_getTrainName': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get train name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the currently present train's name. Note: (Throws error If the station is not connected to a track or train not found)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTrainName()`, Order.ATOMIC];
        }
    },
    'createmod_train_setTrainName': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set train name");
                this.appendValueInput("NAME").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("new name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the currently present train's name. Note: (Throws error If the station is not connected to a track or train not found)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const name = gen.valueToCode(block, "NAME", Order.ATOMIC);
            return [`${peripheral}.setTrainName(${name})`, Order.ATOMIC];
        }
    },
    'createmod_train_canTrainReach': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("can train reach station");
                this.appendValueInput("DESTINATION").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("destination name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Tests if a route to a station name is possible from this station. Note: (Throws error If the station is not connected to a track)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const destination = gen.valueToCode(block, "DESTINATION", Order.ATOMIC);
            return [`${peripheral}.canTrainReach(${destination})[0]`, Order.ATOMIC];
        }
    },
    'createmod_train_distanceTo': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get distance between stations");
                this.appendValueInput("DESTINATION").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("destination name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, ["Number", "Null"]);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Measures the distance between a station name and this station. Note: (Throws error If the station is not connected to a track)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const destination = gen.valueToCode(block, "DESTINATION", Order.ATOMIC);
            return [`${peripheral}.distanceTo(${destination})[0]`, Order.ATOMIC];
        }
    },
    'createmod_train_getState': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get signal state");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the train signal's currently displayed signal, as how the trains see it. Note: (returns either \"RED\", \"GREEN\" or \"YELLOW\")");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getState()`, Order.ATOMIC];
        }
    },
    'createmod_train_isForcedRed': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is signal forced red");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks if the signal is forced red by the computer.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isForcedRed()`, Order.ATOMIC];
        }
    },
    'createmod_train_setForcedRed': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set signal forced red");
                this.appendValueInput("FORCED").setCheck("Boolean")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("forced");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Forces the signal to be red regardless of redstone and free space ahead. Note: (Goes back to default behaviour when losing connection with the computer.)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const forced = gen.valueToCode(block, "FORCED", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setForcedRed(${forced})`;
        }
    },
    'createmod_train_getSignalType': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get signal type");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the train signal's signal type. Note: (returns either \"ENTRY_SIGNAL\" or \"CROSS_SIGNAL\")");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSignalType()`, Order.ATOMIC];
        }
    },
    'createmod_train_cycleSignalType': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("cycle signal type");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Cycles through the train signal's signal types.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.cycleSignalType()`;
        }
    },
    'createmod_train_listBlockingTrainNames': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("list blocking train names");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Array");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Lists the names of trains on the track.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.listBlockingTrainNames()`, Order.ATOMIC];
        }
    },
    'createmod_train_isTrainPassing': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is train passing");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks if a train is currently within the train observer's range.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isTrainPassing()`, Order.ATOMIC];
        }
    },
    'createmod_train_getPassingTrainName': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get passing train name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the name of a train within the train observer's range.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getPassingTrainName()`, Order.ATOMIC];
        }
    },
    'createmod_nixie_setText': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set nixie tube's text");
                this.appendValueInput("TEXT").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("text");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the text on the nixie tubes.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const text = gen.valueToCode(block, "TEXT", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setText(${text})`;
        }
    },
    'createmod_nixie_setTextColor': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set nixie tube's color");
                this.appendValueInput("COLOR").setCheck(["Color", "String"])
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("color");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the nixie tube's color.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const color = gen.valueToCode(block, "COLOR", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setTextColor("${color.replace("colors.", "").replace(/"/g, '')}")`;
        }
    },
    'createmod_display_setCursorPos': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set display cursor position");
                this.appendValueInput("XPOS").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("x");
                this.appendValueInput("YPOS").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("y");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the cursor position. Can be outside the bounds of the connected display.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const x = gen.valueToCode(block, "XPOS", Order.ATOMIC);
            const y = gen.valueToCode(block, "YPOS", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setCursorPos(${x}, ${y})`;
        }
    },
    'createmod_display_getCursorPos': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get display cursor position");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Array");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the current cursor position. Note: (Returns list with two numbers: x, y)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.getCursorPos()`;
        }
    },
    'createmod_display_getSize': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get display size");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Array");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Gets the size of the connected display target. Note: (Returns list with two numbers: width, height)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.getSize()`;
        }
    },
    'createmod_display_isColor': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is color display");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks whether the connected display target supports color.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.isColor()`;
        }
    },
    'createmod_display_write': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("write to display");
                this.appendValueInput("TEXT").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("text");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Writes text to the display.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const text = gen.valueToCode(block, "TEXT", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.write(${text})`;
        }
    },
    'createmod_display_clearLine': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("clear line display");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Clears the line at the current cursor position.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.clearLine()`;
        }
    },
    'createmod_display_clear': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("clear display");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Clears the whole display.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.clear()`;
        }
    },
    'createmod_display_update': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("update display");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Pushes any changes to the connected display target.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.update()`;
        }
    },
    'createmod_isExtended': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is sticker extended");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks if the sticker is extended.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.isExtended()`;
        }
    },
    'createmod_isAttachedToBlock': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is sticker attached to block");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Checks if the sticker is sticking to a block.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.isAttachedToBlock()`;
        }
    },
    'createmod_extend': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("extend sticker");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Extends the sticker.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.extend()`;
        }
    },
    'createmod_retract': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("retract sticker");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Retracts the sticker.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.retract()`;
        }
    },
    'createmod_toggle': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("toggle sticker");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Toggles between the sticker being retracted and extended, regardless of it's previous state");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.toggle()`;
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