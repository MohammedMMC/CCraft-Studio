import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

const turtleSimpleMoves = [
    'forward', 'back', 'up', 'down', 'turnLeft', 'turnRight',
    'dig', 'digUp', 'digDown', 'place', 'placeUp', 'placeDown',
    'attack', 'attackUp', 'attackDown',
    'refuel', 'equipLeft', 'equipRight',
];

const dropSuckActions = [
    'drop', 'dropUp', 'dropDown',
    'suck', 'suckUp', 'suckDown'
];

export const turtleBlocks: Blocks = {
    ...Object.fromEntries(turtleSimpleMoves.map(move => [
        `turtle_${move}`,
        {
            block: {
                init() {
                    this.appendDummyInput()
                        .appendField(`turtle ${move.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}`);
                    this.setPreviousStatement(true, null);
                    this.setNextStatement(true, null);
                    this.setStyle('turtle_blocks');
                    this.setTooltip(
                        move.startsWith('attack')
                            ? `Attack an entity ${move.endsWith('Up') ? 'above' : move.endsWith('Down') ? 'below' : 'in front of'} the turtle`
                            : move.startsWith('dig')
                                ? `Dig the block ${move.endsWith('Up') ? 'above' : move.endsWith('Down') ? 'below' : 'in front of'} the turtle`
                                : move.startsWith('equip')
                                    ? `Equip the item in the selected slot to the ${move.endsWith('Left') ? 'left' : 'right'} side of the turtle`
                                    : move.startsWith('place')
                                        ? `Place the item in the selected slot ${move.endsWith('Up') ? 'above' : move.endsWith('Down') ? 'below' : 'in front of'} the turtle`
                                        : move.startsWith('turn')
                                            ? `Turn the turtle ${move.endsWith('Left') ? 'left' : 'right'}`
                                            : move === 'refuel'
                                                ? `Use items in the selected slot as fuel`
                                                : `Move the turtle ${move} one block`);
                },
            },
            generator: (block, gen) => {
                return `${gen.getIndent()}turtle.${move}()`
            }
        }
    ])),
    ...Object.fromEntries(dropSuckActions.map(action => [
        `turtle_${action}`,
        {
            block: {
                init() {
                    this.appendDummyInput()
                        .appendField(action.includes('suck') ? 'suck' : 'drop')
                        .appendField(new Blockly.FieldNumber(64, 1, 64, 1), 'COUNT')
                        .appendField(`items ${action.includes('suck') ? 'from ' : ''}${action.length == 4 ? 'forward' : (action.endsWith('Up') ? 'above' : 'below')}`);
                    this.setPreviousStatement(true, null);
                    this.setNextStatement(true, null);
                    this.setStyle('turtle_blocks');
                    this.setTooltip(
                        action.includes('suck')
                            ? `Suck items from ${action.length == 4 ? 'front' : (action.endsWith('Up') ? 'above' : 'below')} the turtle`
                            : `Drop items from the selected slot in ${action.length == 4 ? 'front' : (action.endsWith('Up') ? 'above' : 'below')} of the turtle`
                    );
                },
            },
            generator: (block, gen) => {
                const count = block.getFieldValue('COUNT');
                return `${gen.getIndent()}turtle.${action}(${count})`;
            }
        }
    ])),
    'turtle_select': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('select slot')
                    .appendField(new Blockly.FieldNumber(1, 1, 16, 1), 'SLOT');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('turtle_blocks');
                this.setTooltip('Select an inventory slot (1-16)');
            },
        },
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            return `${gen.getIndent()}turtle.select(${slot})`;
        }
    },
    'turtle_craft': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('craft')
                    .appendField(new Blockly.FieldNumber(64, 1, 64, 1), 'LIMIT')
                    .appendField('items');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('turtle_blocks');
                this.setTooltip('Craft items using the items in the turtle inventory');
            },
        },
        generator: (block, gen) => {
            const limit = block.getFieldValue('LIMIT');
            return `${gen.getIndent()}turtle.craft(${limit})`;
        }
    },
    'turtle_transferTo': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('transfer to slot')
                    .appendField(new Blockly.FieldNumber(1, 1, 16, 1), 'SLOT')
                    .appendField('count')
                    .appendField(new Blockly.FieldNumber(64, 1, 64, 1), 'COUNT');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('turtle_blocks');
                this.setTooltip('Transfer items from the selected slot to another slot');
            },
        },
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            const count = block.getFieldValue('COUNT');
            return `${gen.getIndent()}turtle.transferTo(${slot}, ${count})`;
        }
    },
    'turtle_detect': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle detect forward');
                this.setOutput(true, 'Boolean');
                this.setStyle('turtle_blocks');
                this.setTooltip('Detect if there is a block in front of the turtle');
            },
        },
        generator: (block, gen) => {
            return [`turtle.detect()`, Order.ATOMIC];
        }
    },
    'turtle_detectUp': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle detect up');
                this.setOutput(true, 'Boolean');
                this.setStyle('turtle_blocks');
                this.setTooltip('Detect if there is a block above the turtle');
            },
        },
        generator: (block, gen) => {
            return [`turtle.detectUp()`, Order.ATOMIC];
        }
    },
    'turtle_detectDown': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle detect down');
                this.setOutput(true, 'Boolean');
                this.setStyle('turtle_blocks');
                this.setTooltip('Detect if there is a block below the turtle');
            },
        },
        generator: (block, gen) => {
            return [`turtle.detectDown()`, Order.ATOMIC];
        }
    },
    'turtle_compare': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle compare forward');
                this.setOutput(true, 'Boolean');
                this.setStyle('turtle_blocks');
                this.setTooltip('Compare the block in front with the selected slot');
            },
        },
        generator: (block, gen) => {
            return [`turtle.compare()`, Order.ATOMIC];
        }
    },
    'turtle_compareUp': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle compare up');
                this.setOutput(true, 'Boolean');
                this.setStyle('turtle_blocks');
                this.setTooltip('Compare the block above with the selected slot');
            },
        },
        generator: (block, gen) => {
            return [`turtle.compareUp()`, Order.ATOMIC];
        }
    },
    'turtle_compareDown': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle compare down');
                this.setOutput(true, 'Boolean');
                this.setStyle('turtle_blocks');
                this.setTooltip('Compare the block below with the selected slot');
            },
        },
        generator: (block, gen) => {
            return [`turtle.compareDown()`, Order.ATOMIC];
        }
    },
    'turtle_inspect': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle inspect forward');
                this.setOutput(true, null);
                this.setStyle('turtle_blocks');
                this.setTooltip('Get details about the block in front of the turtle');
            },
        },
        generator: (block, gen) => {
            return [`({turtle.inspect()})`, Order.ATOMIC];
        }
    },
    'turtle_inspectUp': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle inspect up');
                this.setOutput(true, null);
                this.setStyle('turtle_blocks');
                this.setTooltip('Get details about the block above the turtle');
            },
        },
        generator: (block, gen) => {
            return [`({turtle.inspectUp()})`, Order.ATOMIC];
        }
    },
    'turtle_inspectDown': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('turtle inspect down');
                this.setOutput(true, null);
                this.setStyle('turtle_blocks');
                this.setTooltip('Get details about the block below the turtle');
            },
        },
        generator: (block, gen) => {
            return [`({turtle.inspectDown()})`, Order.ATOMIC];
        }
    },
    'turtle_getItemCount': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('items in slot')
                    .appendField(new Blockly.FieldNumber(1, 1, 16, 1), 'SLOT');
                this.setOutput(true, 'Number');
                this.setStyle('turtle_blocks');
                this.setTooltip('Get the number of items in a slot');
            },
        },
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            return [`turtle.getItemCount(${slot})`, Order.ATOMIC];
        }
    },
    'turtle_getItemSpace': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('space in slot')
                    .appendField(new Blockly.FieldNumber(1, 1, 16, 1), 'SLOT');
                this.setOutput(true, 'Number');
                this.setStyle('turtle_blocks');
                this.setTooltip('Get the remaining space in a slot');
            },
        },
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            return [`turtle.getItemSpace(${slot})`, Order.ATOMIC];
        }
    },
    'turtle_getItemDetail': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('item detail in slot')
                    .appendField(new Blockly.FieldNumber(1, 1, 16, 1), 'SLOT');
                this.setOutput(true, null);
                this.setStyle('turtle_blocks');
                this.setTooltip('Get detailed info about the item in a slot (name, count, damage)');
            },
        },
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            return [`turtle.getItemDetail(${slot})`, Order.ATOMIC];
        }
    },
    'turtle_getFuelLevel': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('fuel level');
                this.setOutput(true, 'Number');
                this.setStyle('turtle_blocks');
                this.setTooltip('Get the current fuel level of the turtle');
            },
        },
        generator: (block, gen) => {
            return [`turtle.getFuelLevel()`, Order.ATOMIC];
        }
    },
    'turtle_getFuelLimit': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('fuel limit');
                this.setOutput(true, 'Number');
                this.setStyle('turtle_blocks');
                this.setTooltip('Get the maximum fuel level of the turtle');
            },
        },
        generator: (block, gen) => {
            return [`turtle.getFuelLimit()`, Order.ATOMIC];
        }
    },
    'turtle_getSelectedSlot': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('selected slot');
                this.setOutput(true, 'Number');
                this.setStyle('turtle_blocks');
                this.setTooltip('Get the currently selected inventory slot number');
            },
        },
        generator: (block, gen) => {
            return [`turtle.getSelectedSlot()`, Order.ATOMIC];
        }
    }
};