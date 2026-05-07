/// <reference types="vite/client" />
declare module '@mit-app-inventor/blockly-block-lexical-variables' {
  import type * as Blockly from 'blockly';

  export interface LexicalVariablesPluginApi {
    init(
      workspace: Blockly.WorkspaceSvg,
      options?: Record<string, unknown>
    ): void;
    FieldParameterFlydown: (name, isEditable, opt_displayLocation, opt_additionalChangeHandler) => Blockly.Field;
    // FieldGlobalFlydown: typeof Blockly.Field;
  }

  export const LexicalVariablesPlugin: LexicalVariablesPluginApi;
}