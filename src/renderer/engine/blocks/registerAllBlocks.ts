import { BlockRegistry } from './BlockRegistry';
import { eventBlocks } from './definitions/events';
import { controlBlocks } from './definitions/control';
import { uiActionBlocks } from './definitions/uiActions';
import { variableBlocks } from './definitions/variables';
import { stringBlocks } from './definitions/strings';
import { tableBlocks } from './definitions/tables';
import { ccApiBlocks } from './definitions/ccApi';
import { mathBlocks } from './definitions/math';
import { logicBlocks } from './definitions/logic';
import { functionBlocks } from './definitions/functions';

export function registerAllBlocks() {
  BlockRegistry.registerAll(eventBlocks);
  BlockRegistry.registerAll(controlBlocks);
  BlockRegistry.registerAll(uiActionBlocks);
  BlockRegistry.registerAll(variableBlocks);
  BlockRegistry.registerAll(stringBlocks);
  BlockRegistry.registerAll(tableBlocks);
  BlockRegistry.registerAll(ccApiBlocks);
  BlockRegistry.registerAll(mathBlocks);
  BlockRegistry.registerAll(logicBlocks);
  BlockRegistry.registerAll(functionBlocks);
}
