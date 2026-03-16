import { CCProject } from '../../models/Project';
import { UIElement, ContainerElement, PanelElement, resolveSize, resolveContainerLayout, isContainerLike } from '../../models/UIElement';
import { COMPONENTS_LIST, generateFunctionsFile, generateHandlersFile, generateHeader, generateScreenFile, generateStartupFile, generateVarsFile, getComponentLua } from './templates';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { escapeLuaString, sanitize } from '../../utils/luaHelpers';

/** Resolve absolute positions for all elements, including children inside containers. */
export interface ExportOptions {
  mode: 'full' | 'uiOnly';
  minify: boolean;
}

export interface ExportFile {
  path: string;
  content: string;
}

export function exportProject(project: CCProject, options: ExportOptions): ExportFile[] {
  const startScreen = project.screens.find(s => s.isStartScreen) ?? project.screens[0];
  if (!startScreen) return [];

  const files: ExportFile[] = [];
  const blocklyStore = useBlocklyStore.getState();

  // 1. Component classes
  for (const component of COMPONENTS_LIST) {
    files.push({ path: `components/${component}.lua`, content: getComponentLua(project.name, project.author, component) });
  }

  // 2. vars.lua - functions.lua
  files.push({ path: 'utils/vars.lua', content: generateVarsFile(project) });
  if (options.mode === 'full') {
    files.push({ path: 'utils/functions.lua', content: generateFunctionsFile(project.name, project.author) });
    files.push({ path: 'utils/handlers.lua', content: generateHandlersFile(project) });
  }

  // 3. screens/<name>.lua
  for (const screen of project.screens) {
    const safeName = sanitize(screen.name);
    files.push({
      path: `screens/${safeName}.lua`,
      content: generateScreenFile(project, screen.name, screen.uiElements),
    });
  }

  if (options.mode === 'full') {
    // 4. logic/<screen>.lua per screen
    for (const screen of project.screens) {
      const code = blocklyStore.getLuaCode(screen.id);
      if (code.trim()) {
        const safeName = sanitize(screen.name);
        files.push({ path: `logic/${safeName}.lua`, content: generateLogicFile(screen.name, code) });
      }
    }
  }

  files.push({ path: 'startup.lua', content: generateStartupFile(project, options.mode !== 'full') });

  if (options.minify) {
    return files.map(f => ({ ...f, content: minifyLua(f.content) }));
  }
  return files;
}

function generateLogicFile(screenName: string, blockCode: string): string {
  const safeName = sanitize(screenName);
  const lines: string[] = [`-- Logic for screen: ${screenName}`, ''];
  lines.push(parseEventCode(blockCode, safeName));
  return lines.join('\n');
}

function parseEventCode(code: string, screenName: string): string {
  const lines = code.split('\n');
  const output: string[] = [];
  let insideEvent: string | null = null;
  let eventBody: string[] = [];
  let eventMeta = '';

  for (const line of lines) {
    const startMatch = line.match(/-- \[EVENT:(\w+)(?::(.*?))?\]/);
    const endMatch = line.match(/-- \[\/EVENT:/);
    if (startMatch && !insideEvent) {
      insideEvent = startMatch[1];
      eventMeta = startMatch[2] || '';
      eventBody = [];
    } else if (endMatch && insideEvent) {
      const body = eventBody.filter(l => l.trim()).join('\n');
      output.push(wrapEvent(screenName, insideEvent, eventMeta, body));
      output.push('');
      insideEvent = null;
    } else if (insideEvent) {
      eventBody.push(line);
    } else if (line.trim()) {
      output.push(line);
    }
  }
  return output.join('\n');
}

function wrapEvent(screen: string, event: string, meta: string, body: string): string {
  const ib = body.split('\n').map(l => '  ' + l).join('\n');
  const eMeta = escapeLuaString(meta);
  switch (event) {
    case 'screen_load': {
      const targetScreen = meta ? sanitize(meta) : screen;
      return `handlers["${targetScreen}"].onLoad = function()\n${ib}\nend`;
    }
    case 'button_click': return `handlers["${screen}"].onButtonClick["${eMeta}"] = function(mx, my, button)\n${ib}\nend`;
    case 'button_focus': return `handlers["${screen}"].onButtonFocus["${eMeta}"] = function(mx, my, button)\n${ib}\nend`;
    case 'button_release': return `handlers["${screen}"].onButtonRelease["${eMeta}"] = function(mx, my, button)\n${ib}\nend`;
    case 'key_press': return `handlers["${screen}"].onKeyPress["${eMeta}"] = function(key)\n${ib}\nend`;
    case 'timer': return `handlers["${screen}"].onTimer["t_${eMeta}"] = function(timerId)\n${ib}\nend`;
    case 'redstone': return `handlers["${screen}"].onRedstone = function()\n${ib}\nend`;
    case 'modem_message': return `handlers["${screen}"].onModemMessage["ch_${eMeta}"] = function(side, ch, replyChannel, msg, dist)\n${ib}\nend`;
    default: return body;
  }
}

function minifyLua(code: string): string {
  return code.split('\n').map(l => l.trim()).filter(l => !l.startsWith('--') && l.length > 0).join('\n');
}
