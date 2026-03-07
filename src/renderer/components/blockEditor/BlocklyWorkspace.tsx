import React, { useRef, useEffect, useCallback } from 'react';
import * as Blockly from 'blockly';
import { defineAllBlocks } from '../../engine/blockly/ccBlocks';
import { luaGenerator, registerAllGenerators } from '../../engine/blockly/luaGenerator';
import { TOOLBOX } from '../../engine/blockly/toolbox';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { useProjectStore } from '../../stores/projectStore';

// One-time init
let blocksRegistered = false;
function ensureInit() {
  if (blocksRegistered) return;
  blocksRegistered = true;
  defineAllBlocks();
  registerAllGenerators();
}

const DARK_THEME = Blockly.Theme.defineTheme('ccraftDark', {
  name: 'ccraftDark',
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: '#1e1e2e',
    toolboxBackgroundColour: '#252535',
    toolboxForegroundColour: '#cdd6f4',
    flyoutBackgroundColour: '#2a2a3c',
    flyoutForegroundColour: '#cdd6f4',
    flyoutOpacity: 0.95,
    scrollbarColour: '#45475a',
    insertionMarkerColour: '#89b4fa',
    insertionMarkerOpacity: 0.5,
    scrollbarOpacity: 0.6,
    cursorColour: '#89b4fa',
  },
  fontStyle: {
    family: 'JetBrains Mono, Fira Code, Consolas, monospace',
    weight: 'normal',
    size: 11,
  },
});

const DEFAULT_WORKSPACE_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="event_screen_load" x="30" y="30">
    <statement name="DO">
      <block type="ui_draw_screen"/>
    </statement>
  </block>
</xml>
`.trim();

export const BlocklyWorkspace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const { getXml, setXml, setLuaCode } = useBlocklyStore();

  const saveWorkspace = useCallback(() => {
    if (!workspaceRef.current || !activeScreenId) return;
    const xml = Blockly.Xml.domToText(
      Blockly.Xml.workspaceToDom(workspaceRef.current)
    );
    setXml(activeScreenId, xml);
    const code = luaGenerator.workspaceToCode(workspaceRef.current);
    setLuaCode(activeScreenId, code);
    useProjectStore.getState().markDirty();
  }, [activeScreenId, setXml, setLuaCode]);

  // Create workspace
  useEffect(() => {
    if (!containerRef.current) return;
    ensureInit();

    const ws = Blockly.inject(containerRef.current, {
      toolbox: TOOLBOX,
      theme: DARK_THEME,
      grid: { spacing: 20, length: 3, colour: '#363650', snap: true },
      zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 3, minScale: 0.3 },
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      renderer: 'zelos',
      sounds: false,
    });

    workspaceRef.current = ws;

    // Listen for changes
    ws.addChangeListener((e: Blockly.Events.Abstract) => {
      if (e.isUiEvent) return;
      // Defer save to avoid re-entrancy
      setTimeout(() => saveWorkspace(), 0);
    });

    return () => {
      ws.dispose();
      workspaceRef.current = null;
    };
  }, []); // workspace created once

  // Load/save XML when screen changes
  useEffect(() => {
    if (!workspaceRef.current || !activeScreenId) return;
    const ws = workspaceRef.current;

    // Block change events while loading
    ws.clear();
    const xml = getXml(activeScreenId);
    if (xml) {
      try {
        const dom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, ws);
      } catch {
        // If corrupted, load default
        const dom = Blockly.utils.xml.textToDom(DEFAULT_WORKSPACE_XML);
        Blockly.Xml.domToWorkspace(dom, ws);
      }
    } else {
      // New screen: inject default blocks
      const dom = Blockly.utils.xml.textToDom(DEFAULT_WORKSPACE_XML);
      Blockly.Xml.domToWorkspace(dom, ws);
      // Save immediately
      setTimeout(() => saveWorkspace(), 50);
    }
  }, [activeScreenId, getXml, saveWorkspace]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current || !workspaceRef.current) return;
    const ro = new ResizeObserver(() => {
      Blockly.svgResize(workspaceRef.current!);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};
