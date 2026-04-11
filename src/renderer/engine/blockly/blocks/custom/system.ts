import { GeneratorFunc, Order } from "../../luaGenerator";

export const systemBlocksGenerators: Record<string, GeneratorFunc> = {
    'os_sleep': (block, gen) => {
        const secs = gen.valueToCode(block, 'SECS', Order.NONE);
        return `${gen.getIndent()}os.sleep(${secs})`;
    },
    'os_shutdown': (_block, gen) => {
        return `${gen.getIndent()}os.shutdown()`;
    },
    'os_reboot': (_block, gen) => {
        return `${gen.getIndent()}os.reboot()`;
    },
    'os_queueEvent': (block, gen) => {
        const name = block.getFieldValue('NAME');
        const data = gen.valueToCode(block, 'DATA', Order.NONE);
        return `${gen.getIndent()}os.queueEvent("${name}", ${data})`;
    },
    'os_setComputerLabel': (block, gen) => {
        const label = gen.valueToCode(block, 'LABEL', Order.NONE);
        return `${gen.getIndent()}os.setComputerLabel(${label})`;
    },
    'os_cancelTimer': (block, gen) => {
        const id = gen.valueToCode(block, 'ID', Order.NONE);
        return `${gen.getIndent()}os.cancelTimer(${id})`;
    },
    'os_cancelAlarm': (block, gen) => {
        const id = gen.valueToCode(block, 'ID', Order.NONE);
        return `${gen.getIndent()}os.cancelAlarm(${id})`;
    },
    'os_startTimer': (block, gen) => {
        const secs = gen.valueToCode(block, 'SECS', Order.NONE);
        return [`os.startTimer(${secs})`, Order.ATOMIC];
    },
    'os_setAlarm': (block, gen) => {
        const time = gen.valueToCode(block, 'TIME', Order.NONE);
        return [`os.setAlarm(${time})`, Order.ATOMIC];
    },
    'os_time': () => {
        return [`os.time()`, Order.ATOMIC];
    },
    'os_day': () => {
        return [`os.day()`, Order.ATOMIC];
    },
    'os_epoch': () => {
        return [`os.epoch()`, Order.ATOMIC];
    },
    'os_clock': () => {
        return [`os.clock()`, Order.ATOMIC];
    },
    'os_getComputerID': () => {
        return [`os.getComputerID()`, Order.ATOMIC];
    },
    'os_getComputerLabel': () => {
        return [`os.getComputerLabel()`, Order.ATOMIC];
    },
    'os_version': () => {
        return [`os.version()`, Order.ATOMIC];
    }
};