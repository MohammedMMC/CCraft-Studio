import { GeneratorFunc, Order } from "../luaGenerator";

export const filesBlocksGenerators: Record<string, GeneratorFunc> = {
    'fs_writeFile': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        const content = gen.valueToCode(block, 'CONTENT', Order.NONE);
        return `${gen.getIndent()}local _fh = fs.open(${path}, "w")\n${gen.getIndent()}if _fh then _fh.write(${content}); _fh.close() end`;
    },
    'fs_appendFile': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        const content = gen.valueToCode(block, 'CONTENT', Order.NONE);
        return `${gen.getIndent()}local _fh = fs.open(${path}, "a")\n${gen.getIndent()}if _fh then _fh.write(${content}); _fh.close() end`;
    },
    'fs_delete': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return `${gen.getIndent()}fs.delete(${path})`;
    },
    'fs_makeDir': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return `${gen.getIndent()}fs.makeDir(${path})`;
    },
    'fs_move': (block, gen) => {
        const from = gen.valueToCode(block, 'FROM', Order.NONE);
        const to = gen.valueToCode(block, 'TO', Order.NONE);
        return `${gen.getIndent()}fs.move(${from}, ${to})`;
    },
    'fs_copy': (block, gen) => {
        const from = gen.valueToCode(block, 'FROM', Order.NONE);
        const to = gen.valueToCode(block, 'TO', Order.NONE);
        return `${gen.getIndent()}fs.copy(${from}, ${to})`;
    },
    'fs_readFile': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return [`(function() local f = fs.open(${path}, "r"); if f then local d = f.readAll(); f.close(); return d end; return "" end)()`, Order.ATOMIC];
    },
    'fs_exists': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return [`fs.exists(${path})`, Order.ATOMIC];
    },
    'fs_isDir': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return [`fs.isDir(${path})`, Order.ATOMIC];
    },
    'fs_list': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return [`fs.list(${path})`, Order.ATOMIC];
    },
    'fs_getSize': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return [`fs.getSize(${path})`, Order.ATOMIC];
    },
    'fs_getFreeSpace': (block, gen) => {
        const path = gen.valueToCode(block, 'PATH', Order.NONE);
        return [`fs.getFreeSpace(${path})`, Order.ATOMIC];
    }
};