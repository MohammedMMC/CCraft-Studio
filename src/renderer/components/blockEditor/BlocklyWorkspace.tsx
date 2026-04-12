import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as Blockly from 'blockly';
import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';
import { registerAllBlocks } from '@/engine/blockly/blocksRegistery';
import { luaGenerator } from '../../engine/blockly/luaGenerator';
import { TOOLBOX } from '../../engine/blockly/toolbox';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { usePromptStore } from '../shared/PromptDialog';

let blocksRegistered = false;
function ensureInit() {
  if (blocksRegistered) return;
  blocksRegistered = true;
  registerAllBlocks();

  // Changing Default Blocks
  Blockly.Msg.TEXT_ISEMPTY_TITLE = 'is empty %1';
  Blockly.Msg.LISTS_ISEMPTY_TITLE = 'is empty %1';
  function changeBlockInit(blockName: string | string[], fn: (this: Blockly.Block) => void) {
    const blockNames = Array.isArray(blockName) ? blockName : [blockName];
    for (const name of blockNames) {
      if (Blockly.Blocks[name] && Blockly.Blocks[name].init) {
        const baseInit = Blockly.Blocks[name].init;
        Blockly.Blocks[name].init = function (this: Blockly.Block) {
          baseInit.call(this);
          fn.call(this);
        };
      }
    }
  }
  changeBlockInit(['text_length', 'text_reverse', 'lists_isEmpty', 'lists_reverse'], function () {
    this.setInputsInline(false);
  });

  Blockly.dialog.setPrompt((message, defaultValue, callback) => {
    usePromptStore.getState().open({
      title: 'Blockly',
      message,
      defaultValue,
    }).then((result) => {
      callback(result ?? '');
    });
  });
}

Blockly.utils.colour.setHsvSaturation(0.7);

const DARK_THEME = Blockly.Theme.defineTheme('ccraftDark', {
  name: 'ccraftDark',
  base: Blockly.Themes.Classic,
  blockStyles: {
    events_blocks: {
      colourPrimary: '#B18E35',
    },
    ui_blocks: {
      colourPrimary: '#4EBD60',
    },
    terminal_blocks: {
      colourPrimary: '#3F71B5',
    },
    redstone_blocks: {
      colourPrimary: '#E05050',
    },
    filesystem_blocks: {
      colourPrimary: '#C49642',
    },
    http_blocks: {
      colourPrimary: '#49A6D4',
    },
    peripheral_blocks: {
      colourPrimary: '#7C5385',
    },
    turtle_blocks: {
      colourPrimary: '#59B85A',
    },
    os_blocks: {
      colourPrimary: '#8B6FC0',
    },
    rednet_blocks: {
      colourPrimary: '#D05F2D',
    },
    paintutils_blocks: {
      colourPrimary: '#E07070',
    },
    window_blocks: {
      colourPrimary: '#3DA08E',
    },
    settings_blocks: {
      colourPrimary: '#7D7D7D',
    },
    gps_blocks: {
      colourPrimary: '#3F71B5',
    },
    disk_blocks: {
      colourPrimary: '#B88040',
    },
    utility_blocks: {
      colourPrimary: '#7D7D7D',
    },
    logic_blocks: {
      colourPrimary: '#77AB41',
    },
    loop_blocks: {
      colourPrimary: '#B18E35',
    },
    math_blocks: {
      colourPrimary: '#3F71B5',
    },
    text_blocks: {
      colourPrimary: '#B32D5E',
    },
    color_blocks: {
      colourPrimary: '#7D7D7D',
    },
    list_blocks: {
      colourPrimary: '#49A6D4',
    },
    variable_blocks: {
      colourPrimary: '#D05F2D',
    },
    procedure_blocks: {
      colourPrimary: '#7C5385',
    },
  },
  categoryStyles: {
    events_category: { colour: '#B18E35' },
    ui_category: { colour: '#4EBD60' },
    terminal_category: { colour: '#3F71B5' },
    redstone_category: { colour: '#E05050' },
    filesystem_category: { colour: '#C49642' },
    http_category: { colour: '#49A6D4' },
    peripheral_category: { colour: '#7C5385' },
    turtle_category: { colour: '#59B85A' },
    os_category: { colour: '#8B6FC0' },
    rednet_category: { colour: '#D05F2D' },
    paintutils_category: { colour: '#E07070' },
    window_category: { colour: '#3DA08E' },
    settings_category: { colour: '#7D7D7D' },
    gps_category: { colour: '#3F71B5' },
    disk_category: { colour: '#B88040' },
    utility_category: { colour: '#7D7D7D' },
    logic_category: { colour: '#77AB41' },
    loop_category: { colour: '#B18E35' },
    math_category: { colour: '#3F71B5' },
    text_category: { colour: '#B32D5E' },
    color_category: { colour: '#7D7D7D' },
    list_category: { colour: '#49A6D4' },
    variable_category: { colour: '#D05F2D' },
    procedure_category: { colour: '#7C5385' },
  },
  componentStyles: {
    workspaceBackgroundColour: '#1e1e2e',
    toolboxBackgroundColour: '#252535',
    toolboxForegroundColour: '#cdd6f4',
    flyoutBackgroundColour: '#2a2a3c',
    flyoutForegroundColour: '#cdd6f4',
    flyoutOpacity: 0.9,
    scrollbarColour: '#45475a',
    insertionMarkerColour: '#fff',
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.5,
    cursorColour: '#89b4fa',
  },
  fontStyle: {
    family: 'Arial, Helvetica, sans-serif',
    weight: 'bold',
    size: 12,
  },
});

const DEFAULT_WORKSPACE_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="event_screen_load" x="500" y="150">
    <statement name="DO">
    </statement>
  </block>
</xml>
`.trim();

function procedureFlyoutXml(workspace: Blockly.WorkspaceSvg): Element[] {
  const xmlList: Element[] = [];

  if (Blockly.Blocks['procedures_defnoreturn']) {
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'procedures_defnoreturn');
    block.setAttribute('gap', '16');
    const nameField = Blockly.utils.xml.createElement('field');
    nameField.setAttribute('name', 'NAME');
    nameField.appendChild(Blockly.utils.xml.createTextNode(
      Blockly.Msg['PROCEDURES_DEFNORETURN_PROCEDURE'] ||
      Blockly.Msg['LANG_PROCEDURES_DEFNORETURN_PROCEDURE'] ||
      'do something'
    ));
    block.appendChild(nameField);
    xmlList.push(block);
  }

  if (Blockly.Blocks['procedures_defreturn']) {
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'procedures_defreturn');
    block.setAttribute('gap', '16');
    const nameField = Blockly.utils.xml.createElement('field');
    nameField.setAttribute('name', 'NAME');
    nameField.appendChild(Blockly.utils.xml.createTextNode(
      Blockly.Msg['PROCEDURES_DEFRETURN_PROCEDURE'] ||
      Blockly.Msg['LANG_PROCEDURES_DEFRETURN_PROCEDURE'] ||
      'do something'
    ));
    block.appendChild(nameField);
    xmlList.push(block);
  }

  if (Blockly.Blocks['procedures_ifreturn']) {
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'procedures_ifreturn');
    block.setAttribute('gap', '16');
    xmlList.push(block);
  }

  if (xmlList.length) {
    xmlList[xmlList.length - 1].setAttribute('gap', '24');
  }

  const allProcs = Blockly.Procedures.allProcedures(workspace);
  function addCallers(procTuples: any[], callType: string) {
    for (const tuple of procTuples) {
      const name: string = tuple[0];
      const args: string[] = tuple[1];
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', callType);
      block.setAttribute('gap', '16');
      const mutation = Blockly.utils.xml.createElement('mutation');
      mutation.setAttribute('name', name);
      for (const arg of args) {
        const argEl = Blockly.utils.xml.createElement('arg');
        argEl.setAttribute('name', arg);
        mutation.appendChild(argEl);
      }
      block.appendChild(mutation);
      xmlList.push(block);
    }
  }
  addCallers(allProcs[0], 'procedures_callnoreturn');
  addCallers(allProcs[1], 'procedures_callreturn');

  return xmlList;
}

export const BlocklyWorkspace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const { getXml, setXml, setLuaCode } = useBlocklyStore();

  const activeScreenRef = useRef(activeScreenId);
  const suppressSaveRef = useRef(false);

  const saveWorkspace = useCallback(() => {
    const screenId = activeScreenRef.current;
    if (!workspaceRef.current || !screenId || suppressSaveRef.current) return;
    const xml = Blockly.Xml.domToText(
      Blockly.Xml.workspaceToDom(workspaceRef.current)
    );
    setXml(screenId, xml);
    const code = luaGenerator.workspaceToCode(workspaceRef.current);
    setLuaCode(screenId, code);
    useProjectStore.getState().markDirty();
  }, [setXml, setLuaCode]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let disposed = false;

    const rafId = requestAnimationFrame(() => {
      if (disposed || !container) return;
      ensureInit();

      const ws = Blockly.inject(container, {
        toolbox: TOOLBOX,
        theme: DARK_THEME,
        grid: { spacing: 20, length: 5, colour: '#363650', snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 3, minScale: 0.1, scaleSpeed: 1.1 },
        trashcan: true,
        move: { scrollbars: true, drag: true, wheel: true },
        renderer: 'geras',
        sounds: false,
        media: './media/',
        collapse: true,
        comments: true,
      });

      workspaceRef.current = ws;

      LexicalVariablesPlugin.init(ws);

      ws.registerToolboxCategoryCallback('PROCEDURE', procedureFlyoutXml);

      useBlocklyStore.getState().setLiveWorkspace(ws, activeScreenRef.current);

      ws.addChangeListener((e: Blockly.Events.Abstract) => {
        if (e.isUiEvent || suppressSaveRef.current) return;
        if (e.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
          requestAnimationFrame(() => {
            if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
          });
        }
        setTimeout(() => saveWorkspace(), 0);
      });

      const screenId = activeScreenRef.current;
      if (screenId) {
        suppressSaveRef.current = true;
        const xml = useBlocklyStore.getState().getXml(screenId);
        if (xml) {
          try {
            const dom = Blockly.utils.xml.textToDom(xml);
            Blockly.Xml.domToWorkspace(dom, ws);
          } catch {
            const dom = Blockly.utils.xml.textToDom(DEFAULT_WORKSPACE_XML);
            Blockly.Xml.domToWorkspace(dom, ws);
          }
        } else {
          const dom = Blockly.utils.xml.textToDom(DEFAULT_WORKSPACE_XML);
          Blockly.Xml.domToWorkspace(dom, ws);
        }
        suppressSaveRef.current = false;
        setTimeout(() => saveWorkspace(), 50);
      }
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (workspaceRef.current) {
        useBlocklyStore.getState().setLiveWorkspace(null, null);
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
      document.querySelectorAll(
        '.blocklyWidgetDiv, .blocklyDropDownDiv, .blocklyTooltipDiv'
      ).forEach((el) => el.remove());
    };
  }, []);

  const prevScreenRef = useRef(activeScreenId);
  useEffect(() => {
    if (!workspaceRef.current || !activeScreenId) return;
    if (prevScreenRef.current === activeScreenId) return;

    const ws = workspaceRef.current;

    saveWorkspace();
    activeScreenRef.current = activeScreenId;

    suppressSaveRef.current = true;
    ws.clear();
    const xml = getXml(activeScreenId);
    if (xml) {
      try {
        const dom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, ws);
      } catch {
        const dom = Blockly.utils.xml.textToDom(DEFAULT_WORKSPACE_XML);
        Blockly.Xml.domToWorkspace(dom, ws);
      }
    } else {
      const dom = Blockly.utils.xml.textToDom(DEFAULT_WORKSPACE_XML);
      Blockly.Xml.domToWorkspace(dom, ws);
    }
    suppressSaveRef.current = false;
    prevScreenRef.current = activeScreenId;
    useBlocklyStore.getState().setLiveWorkspace(ws, activeScreenId);
    setTimeout(() => saveWorkspace(), 50);
  }, [activeScreenId, getXml, saveWorkspace]);

  useEffect(() => {
    if (!containerRef.current || !workspaceRef.current) return;
    const ro = new ResizeObserver(() => {
      if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const mode = useEditorStore((s) => s.mode);
  useEffect(() => {
    if (mode === 'blocks' && workspaceRef.current) {
      requestAnimationFrame(() => {
        if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
      });
    }
  }, [mode]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};
