import * as Blockly from 'blockly';
import { GeneratorFunc, luaGenerator } from './luaGenerator';
import { useProjectStore } from '@/stores/projectStore';
import { CCProject } from '@/models/Project';
import { blocksData } from './BlocksDataGen';

export type Blocks = Record<string, {
    block?: {
        init?(this: Blockly.Block): void;
        onchange?(this: Blockly.Block, event: Blockly.Events.Abstract): void;
    }, generator: GeneratorFunc
}>;

export function registerAllBlocks(project: CCProject | null) {

    for (const blockData of blocksData) {
        if (blockData.category === "plugins") {
            if (project && project.plugins && project.plugins.map(p => p.id).includes(blockData.type)) {
                registerBlocks(blockData.blocks);
            }
        } else {
            registerBlocks(blockData.blocks);
        }
    }
}

function registerBlocks(block: Blocks) {
    for (const key in block) {
        luaGenerator.addGenerator(key, block[key].generator);
        if (block[key].block && block[key].block.init) Blockly.Blocks[key] = block[key].block;
    }
}