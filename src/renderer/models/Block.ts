export type BlockCategory =
  | 'events'
  | 'control'
  | 'uiActions'
  | 'variables'
  | 'strings'
  | 'tables'
  | 'ccApi'
  | 'math'
  | 'logic'
  | 'functions';

export const BLOCK_CATEGORY_META: Record<BlockCategory, { label: string; color: string }> = {
  events:    { label: 'Events',         color: '#D4A017' },
  control:   { label: 'Control',        color: '#E8A317' },
  uiActions: { label: 'UI Actions',     color: '#4E9A06' },
  variables: { label: 'Variables',      color: '#F57900' },
  strings:   { label: 'Strings',        color: '#5C3566' },
  tables:    { label: 'Tables / Lists', color: '#CC0000' },
  ccApi:     { label: 'CC:Tweaked API',  color: '#3465A4' },
  math:      { label: 'Math',           color: '#4E9A06' },
  logic:     { label: 'Logic',          color: '#2E8B57' },
  functions: { label: 'Functions',      color: '#75507B' },
};

export type BlockType = 'hat' | 'statement' | 'expression' | 'boolean' | 'cap';

export interface InputDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'any' | 'dropdown' | 'variable' | 'color';
  label?: string;
  defaultValue?: string | number | boolean;
  dropdownOptions?: { label: string; value: string }[];
}

export interface BlockDefinition {
  id: string;
  category: BlockCategory;
  type: BlockType;
  label: string;
  inputs: InputDefinition[];
  canHaveNext: boolean;
  hasBranch: boolean;
  branchCount: number;
  branchLabels?: string[];
  tooltip?: string;
  luaGenerator: (block: BlockInstance, ctx: LuaGenContext) => string;
}

export interface BlockInstance {
  id: string;
  definitionId: string;
  inputValues: Record<string, BlockInput>;
  nextBlock: string | null;
  branchBlocks: (string | null)[];
  position?: { x: number; y: number };
}

export type BlockInput =
  | { kind: 'literal'; value: string | number | boolean }
  | { kind: 'block'; blockId: string }
  | { kind: 'dropdown'; selected: string }
  | { kind: 'variable'; name: string };

export interface LuaGenContext {
  indent: number;
  getBlock: (id: string) => BlockInstance | undefined;
  getDefinition: (defId: string) => BlockDefinition | undefined;
  generateBlock: (blockId: string, ctx: LuaGenContext) => string;
  generateChain: (startBlockId: string | null, ctx: LuaGenContext) => string;
  generateInput: (input: BlockInput, ctx: LuaGenContext) => string;
  getIndent: () => string;
  screenNames: string[];
  elementNames: string[];
  variables: { name: string; type: string }[];
}

export function createBlockInstance(definitionId: string, def: BlockDefinition): BlockInstance {
  const inputValues: Record<string, BlockInput> = {};
  for (const input of def.inputs) {
    if (input.type === 'dropdown' && input.dropdownOptions?.[0]) {
      inputValues[input.name] = { kind: 'dropdown', selected: input.dropdownOptions[0].value };
    } else if (input.defaultValue !== undefined) {
      inputValues[input.name] = { kind: 'literal', value: input.defaultValue };
    } else if (input.type === 'string') {
      inputValues[input.name] = { kind: 'literal', value: '' };
    } else if (input.type === 'number') {
      inputValues[input.name] = { kind: 'literal', value: 0 };
    } else if (input.type === 'boolean') {
      inputValues[input.name] = { kind: 'literal', value: true };
    } else {
      inputValues[input.name] = { kind: 'literal', value: '' };
    }
  }

  return {
    id: crypto.randomUUID(),
    definitionId,
    inputValues,
    nextBlock: null,
    branchBlocks: new Array(def.branchCount).fill(null),
  };
}
