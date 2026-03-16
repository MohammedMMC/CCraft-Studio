/// <reference types="vite/client" />
declare module '@mit-app-inventor/blockly-block-lexical-variables' {
  import type * as Blockly from 'blockly';

  export interface LexicalVariablesPluginApi {
    init(
      workspace: Blockly.WorkspaceSvg,
      options?: Record<string, unknown>
    ): void;
  }

  export const LexicalVariablesPlugin: LexicalVariablesPluginApi;
}