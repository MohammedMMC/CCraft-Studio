import * as Blockly from 'blockly';
import { GeneratorFunc, luaGenerator } from './luaGenerator';

import { eventsBlocks } from './blocks/custom/events';
import { uiActionsBlocks } from './blocks/custom/uiActions';
import { terminalBlocks } from './blocks/custom/terminal';
import { redstoneBlocks } from './blocks/custom/redstone';
import { filesBlocks } from './blocks/custom/files';
import { httpBlocks } from './blocks/custom/http';
import { peripheralBlocks } from './blocks/custom/peripheral';
import { turtleBlocks } from './blocks/custom/turtle';
import { systemBlocks } from './blocks/custom/system';
import { rednetBlocks } from './blocks/custom/rednet';
import { textUtilsBlocks } from './blocks/custom/textUtils';
import { paintUtilsBlocks } from './blocks/custom/paintUtils';
import { windowBlocks } from './blocks/custom/window';
import { settingsBlocks } from './blocks/custom/settings';
import { diskBlocks } from './blocks/custom/disk';
import { utilityBlocks } from './blocks/custom/utility';
import { logicBlocks } from './blocks/main/logic';
import { mathBlocks } from './blocks/main/math';
import { textBlocks } from './blocks/main/text';
import { colorsBlocks } from './blocks/main/colors';
import { variablesBlocks } from './blocks/main/variables';
import { controlBlocks } from './blocks/main/control';
import { listsBlocks } from './blocks/main/lists';
import { functionsBlocks } from './blocks/main/functions';
import { pluginsBlocks } from './blocks/main/plugins';
import { modemBlocks } from './blocks/custom/modem';

export type Block = Record<string, {
    block?: {
        init?(this: Blockly.Block): void;
        onchange?(this: Blockly.Block, event: Blockly.Events.Abstract): void;
    }, generator: GeneratorFunc
}>;

export function registerAllBlocks() {
    registerBlocks(eventsBlocks);
    registerBlocks(uiActionsBlocks);
    registerBlocks(terminalBlocks);
    registerBlocks(redstoneBlocks);
    registerBlocks(filesBlocks);
    registerBlocks(httpBlocks);
    registerBlocks(peripheralBlocks);
    registerBlocks(turtleBlocks);
    registerBlocks(systemBlocks);
    registerBlocks(rednetBlocks);
    registerBlocks(textUtilsBlocks);
    registerBlocks(paintUtilsBlocks);
    registerBlocks(windowBlocks);
    registerBlocks(settingsBlocks);
    registerBlocks(diskBlocks);
    registerBlocks(utilityBlocks);
    registerBlocks(modemBlocks);

    registerBlocks(logicBlocks);
    registerBlocks(mathBlocks);
    registerBlocks(textBlocks);
    registerBlocks(colorsBlocks);
    registerBlocks(variablesBlocks);
    registerBlocks(controlBlocks);
    registerBlocks(listsBlocks);
    registerBlocks(functionsBlocks);
    registerBlocks(pluginsBlocks);
}

function registerBlocks(block: Block) {
    for (const key in block) {
        luaGenerator.addGenerator(key, block[key].generator);
        if (block[key].block && block[key].block.init) Blockly.Blocks[key] = block[key].block;
    }
}