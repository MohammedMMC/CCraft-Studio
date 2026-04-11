import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

const turtleSimpleMoves = [
    'forward', 'back', 'up', 'down', 'turnLeft', 'turnRight',
    'dig', 'digUp', 'digDown', 'place', 'placeUp', 'placeDown',
    'attack', 'attackUp', 'attackDown',
    'refuel', 'equipLeft', 'equipRight',
];

export const turtleBlocks: Block = {
    ...Object.fromEntries(turtleSimpleMoves.map(move => [
        `turtle_${move}`,
        {
            block: {},
            generator: (block, gen) => {
                return `${gen.getIndent()}turtle.${move}()`
            }
        }
    ])),
    'turtle_drop': {
        block: {},
        generator: (block, gen) => {
            const count = block.getFieldValue('COUNT');
            return `${gen.getIndent()}turtle.drop(${count})`;
        }
    },
    'turtle_dropUp': {
        block: {},
        generator: (block, gen) => {
            const count = block.getFieldValue('COUNT');
            return `${gen.getIndent()}turtle.dropUp(${count})`;
        }
    },
    'turtle_dropDown': {
        block: {},
        generator: (block, gen) => {
            const count = block.getFieldValue('COUNT');
            return `${gen.getIndent()}turtle.dropDown(${count})`;
        }
    },
    'turtle_suck': {
        block: {},
        generator: (block, gen) => {
            const count = block.getFieldValue('COUNT');
            return `${gen.getIndent()}turtle.suck(${count})`;
        }
    },
    'turtle_suckUp': {
        block: {},
        generator: (block, gen) => {
            const count = block.getFieldValue('COUNT');
            return `${gen.getIndent()}turtle.suckUp(${count})`;
        }
    },
    'turtle_suckDown': {
        block: {},
        generator: (block, gen) => {
            const count = block.getFieldValue('COUNT');
            return `${gen.getIndent()}turtle.suckDown(${count})`;
        }
    },
    'turtle_select': {
        block: {},
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            return `${gen.getIndent()}turtle.select(${slot})`;
        }
    },
    'turtle_craft': {
        block: {},
        generator: (block, gen) => {
            const limit = block.getFieldValue('LIMIT');
            return `${gen.getIndent()}turtle.craft(${limit})`;
        }
    },
    'turtle_transferTo': {
        block: {},
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            const count = block.getFieldValue('COUNT');
            return `${gen.getIndent()}turtle.transferTo(${slot}, ${count})`;
        }
    },
    'turtle_detect': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.detect()`, Order.ATOMIC];
        }
    },
    'turtle_detectUp': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.detectUp()`, Order.ATOMIC];
        }
    },
    'turtle_detectDown': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.detectDown()`, Order.ATOMIC];
        }
    },
    'turtle_compare': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.compare()`, Order.ATOMIC];
        }
    },
    'turtle_compareUp': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.compareUp()`, Order.ATOMIC];
        }
    },
    'turtle_compareDown': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.compareDown()`, Order.ATOMIC];
        }
    },
    'turtle_inspect': {
        block: {},
        generator: (block, gen) => {
            return [`({turtle.inspect()})`, Order.ATOMIC];
        }
    },
    'turtle_inspectUp': {
        block: {},
        generator: (block, gen) => {
            return [`({turtle.inspectUp()})`, Order.ATOMIC];
        }
    },
    'turtle_inspectDown': {
        block: {},
        generator: (block, gen) => {
            return [`({turtle.inspectDown()})`, Order.ATOMIC];
        }
    },
    'turtle_getItemCount': {
        block: {},
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            return [`turtle.getItemCount(${slot})`, Order.ATOMIC];
        }
    },
    'turtle_getItemSpace': {
        block: {},
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            return [`turtle.getItemSpace(${slot})`, Order.ATOMIC];
        }
    },
    'turtle_getItemDetail': {
        block: {},
        generator: (block, gen) => {
            const slot = block.getFieldValue('SLOT');
            return [`turtle.getItemDetail(${slot})`, Order.ATOMIC];
        }
    },
    'turtle_getFuelLevel': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.getFuelLevel()`, Order.ATOMIC];
        }
    },
    'turtle_getFuelLimit': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.getFuelLimit()`, Order.ATOMIC];
        }
    },
    'turtle_getSelectedSlot': {
        block: {},
        generator: (block, gen) => {
            return [`turtle.getSelectedSlot()`, Order.ATOMIC];
        }
    }
};