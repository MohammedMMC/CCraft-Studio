import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const rednetBlocks: Block = {
    'rednet_open': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return `${gen.getIndent()}rednet.open("${side}")`;
        }
    },
    'rednet_close': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return `${gen.getIndent()}rednet.close("${side}")`;
        }
    },
    'rednet_send': {
        block: {},
        generator: (block, gen) => {
            const id = gen.valueToCode(block, 'ID', Order.NONE);
            const message = gen.valueToCode(block, 'MESSAGE', Order.NONE);
            const protocol = block.getFieldValue('PROTOCOL');
            if (protocol) {
                return `${gen.getIndent()}rednet.send(${id}, ${message}, "${protocol}")`;
            }
            return `${gen.getIndent()}rednet.send(${id}, ${message})`;
        }
    },
    'rednet_broadcast': {
        block: {},
        generator: (block, gen) => {
            const message = gen.valueToCode(block, 'MESSAGE', Order.NONE);
            const protocol = block.getFieldValue('PROTOCOL');
            if (protocol) {
                return `${gen.getIndent()}rednet.broadcast(${message}, "${protocol}")`;
            }
            return `${gen.getIndent()}rednet.broadcast(${message})`;
        }
    },
    'rednet_host': {
        block: {},
        generator: (block, gen) => {
            const protocol = block.getFieldValue('PROTOCOL');
            const hostname = block.getFieldValue('HOSTNAME');
            return `${gen.getIndent()}rednet.host("${protocol}", "${hostname}")`;
        }
    },
    'rednet_unhost': {
        block: {},
        generator: (block, gen) => {
            const protocol = block.getFieldValue('PROTOCOL');
            return `${gen.getIndent()}rednet.unhost("${protocol}")`;
        }
    },
    'rednet_receive': {
        block: {},
        generator: (block, gen) => {
            const timeout = block.getFieldValue('TIMEOUT');
            return [`({rednet.receive(${timeout})})`, Order.ATOMIC];
        }
    },
    'rednet_lookup': {
        block: {},
        generator: (block, gen) => {
            const protocol = block.getFieldValue('PROTOCOL');
            const hostname = block.getFieldValue('HOSTNAME');
            if (hostname) {
                return [`rednet.lookup("${protocol}", "${hostname}")`, Order.ATOMIC];
            }
            return [`rednet.lookup("${protocol}")`, Order.ATOMIC];
        }
    },
    'rednet_isOpen': {
        block: {},
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`rednet.isOpen("${side}")`, Order.ATOMIC];
        }
    }
};