import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

const PLUGIN_ID = "advancedperipherals-mod";

export const advancedperipheralsBlocks: Blocks = {
    'advancedperipherals_energydetector_getTransferRate': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get transfer rate");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the transfer rate.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTransferRate()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_energydetector_getTransferRateLimit': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get transfer rate limit");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the transfer rate limit.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getTransferRateLimit()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_energydetector_setTransferRateLimit': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("set transfer rate limit");
                this.appendValueInput("LIMIT").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("to");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Sets the transfer rate limit.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const limit = gen.valueToCode(block, "LIMIT", Order.ATOMIC);
            return `${gen.getIndent()}${peripheral}.setTransferRateLimit(${limit})`;
        }
    },
    'advancedperipherals_environmentdetector_getBiome': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get biome name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the current biome name the block is in.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getBiome()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_environmentdetector_getBlockLightLevel': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get block light level");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the block light level (0 to 15) at the detector block");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getBlockLightLevel()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_environmentdetector_getDayLightLevel': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get day light level");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the day light level (0 to 15) at the detector block");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDayLightLevel()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_environmentdetector_getSkyLightLevel': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get sky light level");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the sky light level (0 to 15) at the detector block");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getSkyLightLevel()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_environmentdetector_getDimension': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get dimension name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the name of the current dimension");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDimension()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_environmentdetector_getDimensionProvider': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get dimension provider name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the provider of the dimension");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getDimensionProvider()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_environmentdetector_getMoonId': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get moon id");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the current moon phase's id. Note: (0 = Full moon, 1 = Waning gibbous, 2 = Third quarter, 3 = Waning crescent, 4 = New moon, 5 = Waxing crescent, 6 = First quarter, 7 = Waxing gibbous)");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getMoonId()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_environmentdetector_getMoonName': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get moon name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the current moon phase's name.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getMoonName()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_environmentdetector_getRadiationRaw': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get radiation level");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the current raw radiation level in Sv/h.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getRadiationRaw()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_playerdetector_isPlayerInRange': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is player in range");
                this.appendValueInput("RANGE").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("range");
                this.appendValueInput("USERNAME").setCheck("String")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("username");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns whether a player is in range.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const range = gen.valueToCode(block, "RANGE", Order.ATOMIC);
            const username = gen.valueToCode(block, "USERNAME", Order.ATOMIC);
            return [`${peripheral}.isPlayerInRange(${range}, ${username})`, Order.ATOMIC];
        }
    },
    'advancedperipherals_playerdetector_isPlayersInRange': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is players in range");
                this.appendValueInput("RANGE").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("range");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns whether players are in range.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const range = gen.valueToCode(block, "RANGE", Order.ATOMIC);
            return [`${peripheral}.isPlayersInRange(${range})`, Order.ATOMIC];
        }
    },
    'advancedperipherals_playerdetector_isPlayerInCubic': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is player in cubic");
                this.appendValueInput("WIDTH").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("width");
                this.appendValueInput("HEIGHT").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("height");
                this.appendValueInput("DEPTH").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("depth");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns whether a player is in range.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const width = gen.valueToCode(block, "WIDTH", Order.ATOMIC);
            const height = gen.valueToCode(block, "HEIGHT", Order.ATOMIC);
            const depth = gen.valueToCode(block, "DEPTH", Order.ATOMIC);
            return [`${peripheral}.isPlayerInCubic(${width}, ${height}, ${depth})`, Order.ATOMIC];
        }
    },
    'advancedperipherals_playerdetector_isPlayersInCubic': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is player in cubic");
                this.appendValueInput("WIDTH").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("width");
                this.appendValueInput("HEIGHT").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("height");
                this.appendValueInput("DEPTH").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("depth");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns whether a player is in range.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const width = gen.valueToCode(block, "WIDTH", Order.ATOMIC);
            const height = gen.valueToCode(block, "HEIGHT", Order.ATOMIC);
            const depth = gen.valueToCode(block, "DEPTH", Order.ATOMIC);
            return [`${peripheral}.isPlayersInCubic(${width}, ${height}, ${depth})`, Order.ATOMIC];
        }
    },
    'advancedperipherals_inventorymanager_getOwner': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get owner");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, ["String", "Null"]);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the username of the owner of the memory card.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getOwner()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_inventorymanager_isPlayerEquipped': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is player equipped");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns true if the player is wearing atleast one piece of armor.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isPlayerEquipped()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_inventorymanager_isWearing': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is player wearing armor");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.appendValueInput("SLOT").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("slot");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns true if the player is wearing a armor piece on the given slot. Note: (103(Helmet) - 100(Boots)).");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const slot = gen.valueToCode(block, "SLOT", Order.ATOMIC);
            return [`${peripheral}.isWearing(${slot})`, Order.ATOMIC];
        }
    },
    'advancedperipherals_inventorymanager_getFreeSlot': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get free slot");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the next free slot in the player's inventory. Or -1 if their inventory is full.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getFreeSlot()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_inventorymanager_isSpaceAvailable': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is space available");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Boolean");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns true if space is available in the player's inventory.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isSpaceAvailable()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_inventorymanager_getEmptySpace': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get empty space");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the number of empty slots in the player's inventory.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getEmptySpace()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_blockreader_getBlockName': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get block name");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "String");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the registry name of the block.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getBlockName()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_blockreader_isTileEntity': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("is tile entity");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, ["Boolean", "Null"]);
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns true whether the block is a tile entity or not.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.isTileEntity()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_geoscanner_getMaxFuelLevel': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get max fuel level");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the maximum amount of possible stored fuel.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            return [`${peripheral}.getMaxFuelLevel()`, Order.ATOMIC];
        }
    },
    'advancedperipherals_geoscanner_cost': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField("get scan cost");
                this.appendValueInput("RADIUS").setCheck("Number")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("radius");
                this.appendValueInput("PERIPHERAL").setCheck("Array")
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField("peripheral");
                this.setOutput(true, "Number");
                this.setStyle(`${PLUGIN_ID}_blocks`);
                this.setTooltip("Returns the cost in FE for a scan with the given radius.");
            },
        },
        generator: (block, gen) => {
            const peripheral = gen.valueToCode(block, "PERIPHERAL", Order.ATOMIC);
            const radius = gen.valueToCode(block, "RADIUS", Order.ATOMIC);
            return [`${peripheral}.cost(${radius})`, Order.ATOMIC];
        }
    },
};