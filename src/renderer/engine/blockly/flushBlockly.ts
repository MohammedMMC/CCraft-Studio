import * as Blockly from 'blockly';
import type { CCProject } from '@/models/Project';
import { useBlocklyStore } from '@/stores/blocklyStore';
import { registerAllBlocks } from './blocksRegistery';
import { setBlocklyActiveScreenOverride } from './ccBlocks';
import { luaGenerator } from './luaGenerator';

let lastPluginKey: string | null = null;

function ensureBlocksRegistered(project: CCProject) {
    const pluginKey = project.plugins.map(p => p.id).sort().join('|');
    if (lastPluginKey === pluginKey) return;
    lastPluginKey = pluginKey;
    registerAllBlocks(project);
}

function buildCodeFromXml(xmlText: string, screenId: string): string {
    setBlocklyActiveScreenOverride(screenId);
    const workspace = new Blockly.Workspace();
    try {
        const dom = Blockly.utils.xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(dom, workspace);
        return luaGenerator.workspaceToCode(workspace);
    } catch {
        return '';
    } finally {
        workspace.dispose();
        setBlocklyActiveScreenOverride(null);
    }
}

export function flushBlocklyWorkspaces(project: CCProject) {
    ensureBlocksRegistered(project);

    const { liveWorkspace, liveScreenId, setXml, setLuaCode, getXml } = useBlocklyStore.getState();

    if (liveWorkspace && liveScreenId) {
        const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(liveWorkspace));
        setXml(liveScreenId, xml);
        setLuaCode(liveScreenId, luaGenerator.workspaceToCode(liveWorkspace));
    }

    for (const screen of project.screens) {
        if (screen.id === liveScreenId) continue;
        const xmlText = getXml(screen.id);
        if (!xmlText) {
            setLuaCode(screen.id, '');
            continue;
        }
        setLuaCode(screen.id, buildCodeFromXml(xmlText, screen.id));
    }
}
