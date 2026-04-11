import { GeneratorFunc, Order } from "../../luaGenerator";

const turtleSimpleMoves = [
    'forward', 'back', 'up', 'down', 'turnLeft', 'turnRight',
    'dig', 'digUp', 'digDown', 'place', 'placeUp', 'placeDown',
    'attack', 'attackUp', 'attackDown',
    'refuel', 'equipLeft', 'equipRight',
];

export const turtleBlocksGenerators: Record<string, GeneratorFunc> = {
    ...Object.fromEntries(turtleSimpleMoves.map(move => [
        `turtle_${move}`,
        (_block, gen) => `${gen.getIndent()}turtle.${move}()`
    ])),
    'turtle_drop': (block, gen) => {
        const count = block.getFieldValue('COUNT');
        return `${gen.getIndent()}turtle.drop(${count})`;
    },
    'turtle_dropUp': (block, gen) => {
        const count = block.getFieldValue('COUNT');
        return `${gen.getIndent()}turtle.dropUp(${count})`;
    },
    'turtle_dropDown': (block, gen) => {
        const count = block.getFieldValue('COUNT');
        return `${gen.getIndent()}turtle.dropDown(${count})`;
    },
    'turtle_suck': (block, gen) => {
        const count = block.getFieldValue('COUNT');
        return `${gen.getIndent()}turtle.suck(${count})`;
    },
    'turtle_suckUp': (block, gen) => {
        const count = block.getFieldValue('COUNT');
        return `${gen.getIndent()}turtle.suckUp(${count})`;
    },
    'turtle_suckDown': (block, gen) => {
        const count = block.getFieldValue('COUNT');
        return `${gen.getIndent()}turtle.suckDown(${count})`;
    },
    'turtle_select': (block, gen) => {
        const slot = block.getFieldValue('SLOT');
        return `${gen.getIndent()}turtle.select(${slot})`;
    },
    'turtle_craft': (block, gen) => {
        const limit = block.getFieldValue('LIMIT');
        return `${gen.getIndent()}turtle.craft(${limit})`;
    },
    'turtle_transferTo': (block, gen) => {
        const slot = block.getFieldValue('SLOT');
        const count = block.getFieldValue('COUNT');
        return `${gen.getIndent()}turtle.transferTo(${slot}, ${count})`;
    },
    'turtle_detect': () => {
        return [`turtle.detect()`, Order.ATOMIC];
    },
    'turtle_detectUp': () => {
        return [`turtle.detectUp()`, Order.ATOMIC];
    },
    'turtle_detectDown': () => {
        return [`turtle.detectDown()`, Order.ATOMIC];
    },
    'turtle_compare': () => {
        return [`turtle.compare()`, Order.ATOMIC];
    },
    'turtle_compareUp': () => {
        return [`turtle.compareUp()`, Order.ATOMIC];
    },
    'turtle_compareDown': () => {
        return [`turtle.compareDown()`, Order.ATOMIC];
    },
    'turtle_inspect': () => {
        return [`({turtle.inspect()})`, Order.ATOMIC];
    },
    'turtle_inspectUp': () => {
        return [`({turtle.inspectUp()})`, Order.ATOMIC];
    },
    'turtle_inspectDown': () => {
        return [`({turtle.inspectDown()})`, Order.ATOMIC];
    },
    'turtle_getItemCount': (block) => {
        const slot = block.getFieldValue('SLOT');
        return [`turtle.getItemCount(${slot})`, Order.ATOMIC];
    },
    'turtle_getItemSpace': (block) => {
        const slot = block.getFieldValue('SLOT');
        return [`turtle.getItemSpace(${slot})`, Order.ATOMIC];
    },
    'turtle_getItemDetail': (block) => {
        const slot = block.getFieldValue('SLOT');
        return [`turtle.getItemDetail(${slot})`, Order.ATOMIC];
    },
    'turtle_getFuelLevel': () => {
        return [`turtle.getFuelLevel()`, Order.ATOMIC];
    },
    'turtle_getFuelLimit': () => {
        return [`turtle.getFuelLimit()`, Order.ATOMIC];
    },
    'turtle_getSelectedSlot': () => {
        return [`turtle.getSelectedSlot()`, Order.ATOMIC];
    }
};