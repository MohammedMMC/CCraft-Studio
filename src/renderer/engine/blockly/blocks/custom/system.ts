import { Block } from "../../blocksRegistery";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const systemBlocks: Block = {
    'os_sleep': {
        block: {},
        generator: (block, gen) => {
            const secs = gen.valueToCode(block, 'SECS', Order.NONE);
            return `${gen.getIndent()}os.sleep(${secs})`;
        }
    },
    'os_shutdown': {
        block: {},
        generator: (block, gen) => {
            return `${gen.getIndent()}os.shutdown()`;
        }
    },
    'os_reboot': {
        block: {},
        generator: (block, gen) => {
            return `${gen.getIndent()}os.reboot()`;
        }
    },
    'os_queueEvent': {
        block: {},
        generator: (block, gen) => {
            const name = block.getFieldValue('NAME');
            const data = gen.valueToCode(block, 'DATA', Order.NONE);
            return `${gen.getIndent()}os.queueEvent("${name}", ${data})`;
        }
    },
    'os_setComputerLabel': {
        block: {},
        generator: (block, gen) => {
            const label = gen.valueToCode(block, 'LABEL', Order.NONE);
            return `${gen.getIndent()}os.setComputerLabel(${label})`;
        }
    },
    'os_cancelTimer': {
        block: {},
        generator: (block, gen) => {
            const id = gen.valueToCode(block, 'ID', Order.NONE);
            return `${gen.getIndent()}os.cancelTimer(${id})`;
        }
    },
    'os_cancelAlarm': {
        block: {},
        generator: (block, gen) => {
            const id = gen.valueToCode(block, 'ID', Order.NONE);
            return `${gen.getIndent()}os.cancelAlarm(${id})`;
        }
    },
    'os_startTimer': {
        block: {},
        generator: (block, gen) => {
            const secs = gen.valueToCode(block, 'SECS', Order.NONE);
            return [`os.startTimer(${secs})`, Order.ATOMIC];
        }
    },
    'os_setAlarm': {
        block: {},
        generator: (block, gen) => {
            const time = gen.valueToCode(block, 'TIME', Order.NONE);
            return [`os.setAlarm(${time})`, Order.ATOMIC];
        }
    },
    'os_time': {
        block: {},
        generator: (block, gen) => {
            return [`os.time()`, Order.ATOMIC];
        }
    },
    'os_day': {
        block: {},
        generator: (block, gen) => {
            return [`os.day()`, Order.ATOMIC];
        }
    },
    'os_epoch': {
        block: {},
        generator: (block, gen) => {
            return [`os.epoch()`, Order.ATOMIC];
        }
    },
    'os_clock': {
        block: {},
        generator: (block, gen) => {
            return [`os.clock()`, Order.ATOMIC];
        }
    },
    'os_getComputerID': {
        block: {},
        generator: (block, gen) => {
            return [`os.getComputerID()`, Order.ATOMIC];
        }
    },
    'os_getComputerLabel': {
        block: {},
        generator: (block, gen) => {
            return [`os.getComputerLabel()`, Order.ATOMIC];
        }
    },
    'os_version': {
        block: {},
        generator: (block, gen) => {
            return [`os.version()`, Order.ATOMIC];
        }
    }
};