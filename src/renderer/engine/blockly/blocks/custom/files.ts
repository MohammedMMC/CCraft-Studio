import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";

export const filesBlocks: Block = {
    'fs_writeFile': {
        block: {
            init() {
                this.appendValueInput('CONTENT').setCheck('String')
                    .appendField('write');
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('to file');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('filesystem_blocks');
                this.setInputsInline(true);
                this.setTooltip('Write content to a file (overwrites existing content)');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            const content = gen.valueToCode(block, 'CONTENT', Order.NONE);
            return `${gen.getIndent()}local _fh = fs.open(${path}, "w")\n${gen.getIndent()}if _fh then _fh.write(${content}); _fh.close() end`;
        }
    },
    'fs_appendFile': {
        block: {
            init() {
                this.appendValueInput('CONTENT').setCheck('String')
                    .appendField('append');
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('to file');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('filesystem_blocks');
                this.setInputsInline(true);
                this.setTooltip('Append content to the end of a file');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            const content = gen.valueToCode(block, 'CONTENT', Order.NONE);
            return `${gen.getIndent()}local _fh = fs.open(${path}, "a")\n${gen.getIndent()}if _fh then _fh.write(${content}); _fh.close() end`;
        }
    },
    'fs_delete': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('delete file');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('filesystem_blocks');
                this.setInputsInline(true);
                this.setTooltip('Delete a file or directory');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return `${gen.getIndent()}fs.delete(${path})`;
        }
    },
    'fs_makeDir': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('create directory');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('filesystem_blocks');
                this.setInputsInline(true);
                this.setTooltip('Create a new directory');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return `${gen.getIndent()}fs.makeDir(${path})`;
        }
    },
    'fs_move': {
        block: {
            init() {
                this.appendValueInput('FROM').setCheck('String')
                    .appendField('move');
                this.appendValueInput('TO').setCheck('String')
                    .appendField('to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('filesystem_blocks');
                this.setInputsInline(true);
                this.setTooltip('Move a file or directory to a new location');
            },
        },
        generator: (block, gen) => {
            const from = gen.valueToCode(block, 'FROM', Order.NONE);
            const to = gen.valueToCode(block, 'TO', Order.NONE);
            return `${gen.getIndent()}fs.move(${from}, ${to})`;
        }
    },
    'fs_copy': {
        block: {
            init() {
                this.appendValueInput('FROM').setCheck('String')
                    .appendField('copy');
                this.appendValueInput('TO').setCheck('String')
                    .appendField('to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('filesystem_blocks');
                this.setInputsInline(true);
                this.setTooltip('Copy a file or directory');
            },
        },
        generator: (block, gen) => {
            const from = gen.valueToCode(block, 'FROM', Order.NONE);
            const to = gen.valueToCode(block, 'TO', Order.NONE);
            return `${gen.getIndent()}fs.copy(${from}, ${to})`;
        }
    },
    'fs_readFile': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('read file');
                this.setOutput(true, 'String');
                this.setStyle('filesystem_blocks');
                this.setTooltip('Read the entire contents of a file as a string');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return [`(function() local f = fs.open(${path}, "r"); if f then local d = f.readAll(); f.close(); return d end; return "" end)()`, Order.ATOMIC];
        }
    },
    'fs_exists': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('file');
                this.appendDummyInput()
                    .appendField('exists?');
                this.setOutput(true, 'Boolean');
                this.setStyle('filesystem_blocks');
                this.setInputsInline(true);
                this.setTooltip('Check if a file or directory exists');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return [`fs.exists(${path})`, Order.ATOMIC];
        }
    },
    'fs_isDir': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('is');
                this.appendDummyInput()
                    .appendField('a directory?');
                this.setOutput(true, 'Boolean');
                this.setStyle('filesystem_blocks');
                this.setInputsInline(true);
                this.setTooltip('Check if a path is a directory');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return [`fs.isDir(${path})`, Order.ATOMIC];
        }
    },
    'fs_list': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('list files in');
                this.setOutput(true, 'Array');
                this.setStyle('filesystem_blocks');
                this.setTooltip('List all files and directories in a path');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return [`fs.list(${path})`, Order.ATOMIC];
        }
    },
    'fs_getSize': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('size of file');
                this.setOutput(true, 'Number');
                this.setStyle('filesystem_blocks');
                this.setTooltip('Get the size of a file in bytes');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return [`fs.getSize(${path})`, Order.ATOMIC];
        }
    },
    'fs_getFreeSpace': {
        block: {
            init() {
                this.appendValueInput('PATH').setCheck('String')
                    .appendField('free space on');
                this.setOutput(true, 'Number');
                this.setStyle('filesystem_blocks');
                this.setTooltip('Get the free space available on the drive containing the path');
            },
        },
        generator: (block, gen) => {
            const path = gen.valueToCode(block, 'PATH', Order.NONE);
            return [`fs.getFreeSpace(${path})`, Order.ATOMIC];
        }
    }
};