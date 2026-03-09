import React, { useRef, useEffect, useCallback } from 'react';
import * as Blockly from 'blockly';
import { defineAllBlocks } from '../../engine/blockly/ccBlocks';
import { luaGenerator, registerAllGenerators } from '../../engine/blockly/luaGenerator';
import { TOOLBOX } from '../../engine/blockly/toolbox';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import { usePromptStore } from '../shared/PromptDialog';

// One-time init
let blocksRegistered = false;
function ensureInit() {
  if (blocksRegistered) return;
  blocksRegistered = true;
  defineAllBlocks();
  registerAllGenerators();

  // Override Blockly's prompt dialog to use our custom one
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
      colourSecondary: '#9A7B2E',
      colourTertiary: '#836827',
    },
    ui_blocks: {
      colourPrimary: '#4EBD60',
      colourSecondary: '#3DA34E',
      colourTertiary: '#2E8B3C',
    },
    terminal_blocks: {
      colourPrimary: '#3F71B5',
      colourSecondary: '#35619E',
      colourTertiary: '#2B5187',
    },
    redstone_blocks: {
      colourPrimary: '#E05050',
      colourSecondary: '#CC3F3F',
      colourTertiary: '#B33030',
    },
    filesystem_blocks: {
      colourPrimary: '#C49642',
      colourSecondary: '#AD8438',
      colourTertiary: '#96722E',
    },
    http_blocks: {
      colourPrimary: '#49A6D4',
      colourSecondary: '#3D90BB',
      colourTertiary: '#327AA2',
    },
    peripheral_blocks: {
      colourPrimary: '#7C5385',
      colourSecondary: '#6B4673',
      colourTertiary: '#5A3A61',
    },
    turtle_blocks: {
      colourPrimary: '#59B85A',
      colourSecondary: '#4AA34B',
      colourTertiary: '#3C8E3D',
    },
    os_blocks: {
      colourPrimary: '#8B6FC0',
      colourSecondary: '#7A5FAD',
      colourTertiary: '#694F9A',
    },
    rednet_blocks: {
      colourPrimary: '#D05F2D',
      colourSecondary: '#B85228',
      colourTertiary: '#A04523',
    },
    textutils_blocks: {
      colourPrimary: '#B32D5E',
      colourSecondary: '#9C2751',
      colourTertiary: '#852145',
    },
    paintutils_blocks: {
      colourPrimary: '#E07070',
      colourSecondary: '#CC5E5E',
      colourTertiary: '#B34D4D',
    },
    window_blocks: {
      colourPrimary: '#3DA08E',
      colourSecondary: '#348D7C',
      colourTertiary: '#2B7A6B',
    },
    settings_blocks: {
      colourPrimary: '#7D7D7D',
      colourSecondary: '#6B6B6B',
      colourTertiary: '#595959',
    },
    gps_blocks: {
      colourPrimary: '#3F71B5',
      colourSecondary: '#35619E',
      colourTertiary: '#2B5187',
    },
    disk_blocks: {
      colourPrimary: '#B88040',
      colourSecondary: '#A37038',
      colourTertiary: '#8E6030',
    },
    utility_blocks: {
      colourPrimary: '#7D7D7D',
      colourSecondary: '#6B6B6B',
      colourTertiary: '#595959',
    },
    logic_blocks: {
      colourPrimary: '#77AB41',
      colourSecondary: '#689537',
      colourTertiary: '#59802E',
    },
    loop_blocks: {
      colourPrimary: '#B18E35',
      colourSecondary: '#9A7B2E',
      colourTertiary: '#836827',
    },
    math_blocks: {
      colourPrimary: '#3F71B5',
      colourSecondary: '#35619E',
      colourTertiary: '#2B5187',
    },
    text_blocks: {
      colourPrimary: '#B32D5E',
      colourSecondary: '#9C2751',
      colourTertiary: '#852145',
    },
    list_blocks: {
      colourPrimary: '#49A6D4',
      colourSecondary: '#3D90BB',
      colourTertiary: '#327AA2',
    },
    variable_blocks: {
      colourPrimary: '#D05F2D',
      colourSecondary: '#B85228',
      colourTertiary: '#A04523',
    },
    procedure_blocks: {
      colourPrimary: '#7C5385',
      colourSecondary: '#6B4673',
      colourTertiary: '#5A3A61',
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
    textutils_category: { colour: '#B32D5E' },
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
    flyoutOpacity: 1,
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
  <block type="event_screen_load" x="30" y="30">
    <statement name="DO">
    </statement>
  </block>
</xml>
`.trim();

export const BlocklyWorkspace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const activeScreenId = useProjectStore((s) => s.activeScreenId);
  const { getXml, setXml, setLuaCode } = useBlocklyStore();

  // Use a ref so the change listener always calls the latest save logic
  const activeScreenRef = useRef(activeScreenId);
  activeScreenRef.current = activeScreenId;

  // Flag to suppress saves during screen-switch loading
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

  // Create workspace (deferred to next frame to let DOM settle)
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

      useBlocklyStore.getState().setLiveWorkspace(ws, activeScreenRef.current);

      ws.addChangeListener((e: Blockly.Events.Abstract) => {
        if (e.isUiEvent || suppressSaveRef.current) return;
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
      // Clean up any Blockly elements injected onto document.body
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

  // Resize observer
  useEffect(() => {
    if (!containerRef.current || !workspaceRef.current) return;
    const ro = new ResizeObserver(() => {
      if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Resize when switching back to blocks mode
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
