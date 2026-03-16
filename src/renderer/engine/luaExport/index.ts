import { CCProject } from '../../models/Project';
import { UIElement, ContainerElement, PanelElement, resolveSize, resolveContainerLayout, isContainerLike } from '../../models/UIElement';
import { generateUICode } from './uiCodeGen';
import { generateHeader } from './templates';
import { generateBaseObjectLua, generateLabelLua, generateButtonLua, generateContainerLua, generatePanelLua } from './componentTemplates';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { escapeLuaString } from '../../utils/luaHelpers';

/** Resolve absolute positions for all elements, including children inside containers. */
function buildPositionMap(
  elements: UIElement[],
  displayWidth: number,
  displayHeight: number,
): Map<string, { x: number; y: number; width: number; height: number }> {
  const map = new Map<string, { x: number; y: number; width: number; height: number }>();

  function resolveContainer(
    container: ContainerElement | PanelElement,
    cx: number, cy: number,
    cw: number, ch: number,
  ) {
    const children = elements
      .filter(c => c.parentId === container.id && c.visible)
      .sort((a, b) => a.zIndex - b.zIndex);
    const positions = resolveContainerLayout(
      container, children, cx, cy, cw, ch, cw, ch,
    );
    for (const pos of positions) {
      map.set(pos.id, { x: pos.x, y: pos.y, width: pos.width, height: pos.height });
      const child = children.find(c => c.id === pos.id);
      if (child && isContainerLike(child)) {
        resolveContainer(child as ContainerElement | PanelElement, pos.x, pos.y, pos.width, pos.height);
      }
    }
  }

  for (const el of elements) {
    const { width, height } = resolveSize(el, displayWidth, displayHeight);

    if (el.parentId === null) {
      map.set(el.id, { x: el.x, y: el.y, width, height });
    }

    if (isContainerLike(el) && el.parentId === null) {
      resolveContainer(el as ContainerElement | PanelElement, el.x, el.y, width, height);
    }
  }

  return map;
}

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
  files.push({ path: 'components/BaseObject.lua', content: generateBaseObjectLua(project.name, project.author) });
  files.push({ path: 'components/Label.lua', content: generateLabelLua(project.name, project.author) });
  files.push({ path: 'components/Button.lua', content: generateButtonLua(project.name, project.author) });
  files.push({ path: 'components/Container.lua', content: generateContainerLua(project.name, project.author) });
  files.push({ path: 'components/Panel.lua', content: generatePanelLua(project.name, project.author) });

  // 2. vars.lua - functions.lua
  files.push({ path: 'utils/vars.lua', content: generateVarsFile(project) });
  files.push({ path: 'utils/functions.lua', content: generateFunctionsFile(project) });

  // 3. screens/<name>.lua
  for (const screen of project.screens) {
    const safeName = sanitize(screen.name);
    files.push({
      path: `screens/${safeName}.lua`,
      content: generateScreenFile(project, screen.name, screen.uiElements),
    });
  }

  // 4. handlers.lua
  files.push({ path: 'utils/handlers.lua', content: generateHandlersFile(project) });

  if (options.mode === 'full') {
    // 4. logic/<screen>.lua per screen
    for (const screen of project.screens) {
      const code = blocklyStore.getLuaCode(screen.id);
      if (code.trim()) {
        const safeName = sanitize(screen.name);
        files.push({ path: `logic/${safeName}.lua`, content: generateLogicFile(screen.name, code) });
      }
    }

    // 5. startup.lua
    files.push({ path: 'startup.lua', content: generateStartupFile(project) });
  } else {
    files.push({ path: 'startup.lua', content: generateUIOnlyStartup(project) });
  }

  if (options.minify) {
    return files.map(f => ({ ...f, content: minifyLua(f.content) }));
  }
  return files;
}

function generateVarsFile(project: CCProject): string {
  const startScreen = project.screens.find(s => s.isStartScreen) ?? project.screens[0];
  const lines: string[] = [
    generateHeader(project.name, project.author),
    '-- =============================================',
    '-- Global Variables',
    '-- =============================================',
    '',
  ];

  for (const v of project.variables) {
    const safeName = sanitize(v.name);
    switch (v.type) {
      case 'string': lines.push(`${safeName} = "${escapeLuaString(v.defaultValue)}"`); break;
      case 'number': lines.push(`${safeName} = ${parseFloat(v.defaultValue) || 0}`); break;
      case 'boolean': lines.push(`${safeName} = ${v.defaultValue === 'true' ? 'true' : 'false'}`); break;
      case 'table': lines.push(`${safeName} = {}`); break;
    }
  }
  if (project.variables.length === 0) lines.push('-- (no variables defined)');

  lines.push('');
  lines.push('-- Runtime state');
  lines.push(`currentScreen = "${sanitize(startScreen?.name ?? 'Screen 1')}"`);
  lines.push('running = true');
  lines.push('');
  lines.push('-- Screen components');
  lines.push('screenComponents = {}');

  return lines.join('\n');
}

function generateFunctionsFile(project: CCProject): string {
  const lines: string[] = [
    generateHeader(project.name, project.author),
    '-- =============================================',
    '-- Global Functions',
    '-- =============================================',
    '',
  ];

  lines.push('function drawCurrentScreen()');
  lines.push('  resolveLayout(term.getSize())');
  lines.push('  local fn = screenDrawFunctions[currentScreen]');
  lines.push('  if fn then fn() end');
  lines.push('end');
  lines.push('');
  lines.push('function navigate(screenName)');
  lines.push('  currentScreen = screenName');
  lines.push('  drawCurrentScreen()');
  lines.push('  local h = handlers[currentScreen]');
  lines.push('  if h and h.onLoad then h.onLoad() end');
  lines.push('end');
  lines.push('');
  lines.push('function refreshScreen() drawCurrentScreen() end');
  lines.push('');
  lines.push('function getElement(name)');
  lines.push('  local sc = screenComponents[currentScreen]');
  lines.push('  if sc then return sc[name:gsub("[^%w_]", "_")] end');
  lines.push('end');
  lines.push('');

  return lines.join('\n');
}

function generateScreenFile(_project: CCProject, screenName: string, uiElements: any[]): string {
  return `-- Screen: ${screenName}\n\n${generateUICode(uiElements, screenName, _project.displayWidth, _project.displayHeight)}`;
}

function generateHandlersFile(project: CCProject): string {
  const lines: string[] = [
    '-- =============================================',
    '-- Event Handlers & Button Regions',
    '-- =============================================',
    '',
    'handlers = {}',
    '',
  ];

  for (const screen of project.screens) {
    const sn = sanitize(screen.name);
    lines.push(`handlers["${sn}"] = { onLoad = nil, onButtonClick = {}, onButtonFocus = {}, onButtonRelease = {}, onKeyPress = {}, onTimer = {}, onRedstone = nil, onModemMessage = {} }`);
  }

  lines.push('');
  lines.push('screenDrawFunctions = {}');
  for (const screen of project.screens) {
    const sn = sanitize(screen.name);
    lines.push(`screenDrawFunctions["${sn}"] = drawScreen_${sn}`);
  }

  lines.push('');
  lines.push('buttonRegions = {}');
  for (const screen of project.screens) {
    const buttons = screen.uiElements.filter(e => e.type === 'button');
    if (buttons.length === 0) continue;
    const sn = sanitize(screen.name);
    const posMap = buildPositionMap(screen.uiElements, project.displayWidth, project.displayHeight);
    lines.push(`buttonRegions["${sn}"] = {`);
    for (const btn of buttons) {
      const pos = posMap.get(btn.id);
      if (!pos) continue;
      lines.push(`  { name = "${escapeLuaString(btn.name)}", x = ${pos.x}, y = ${pos.y}, w = ${pos.width}, h = ${pos.height} },`);
    }
    lines.push('}');
  }
  return lines.join('\n');
}

function generateLogicFile(screenName: string, blockCode: string): string {
  const safeName = sanitize(screenName);
  const lines: string[] = [`-- Logic for screen: ${screenName}`, ''];
  lines.push(parseEventCode(blockCode, safeName));
  return lines.join('\n');
}

function generateStartupFile(project: CCProject): string {
  const startScreen = project.screens.find(s => s.isStartScreen) ?? project.screens[0];
  const safeName = sanitize(startScreen?.name ?? 'Screen 1');

  const lines: string[] = [
    generateHeader(project.name, project.author),
    '-- Resolve script directory',
    'local script_dir = ""',
    'if shell and shell.getRunningProgram then',
    '  local prog = shell.getRunningProgram()',
    '  local dir = prog:match("(.*/)") or ""',
    '  script_dir = dir',
    'end',
    '',
    '-- Load modules',
    'dofile(script_dir .. "utils/vars.lua")',
    'dofile(script_dir .. "utils/functions.lua")',
    '',
    '-- Load component classes',
    'dofile(script_dir .. "components/BaseObject.lua")',
    'dofile(script_dir .. "components/Label.lua")',
    'dofile(script_dir .. "components/Button.lua")',
    'dofile(script_dir .. "components/Container.lua")',
    'dofile(script_dir .. "components/Panel.lua")',
    '',
    '-- Load screens',
  ];

  for (const s of project.screens) lines.push(`dofile(script_dir .. "screens/${sanitize(s.name)}.lua")`);
  lines.push('');
  lines.push('dofile(script_dir .. "utils/handlers.lua")');
  lines.push('');

  for (const s of project.screens) {
    const sn = sanitize(s.name);
    lines.push(`if fs.exists(script_dir .. "logic/${sn}.lua") then dofile(script_dir .. "logic/${sn}.lua") end`);
  }

  lines.push('');
  lines.push(`navigate("${safeName}")`);
  lines.push('');
  lines.push('-- Event loop');
  lines.push('local focusedButton = nil');
  lines.push('while running do');
  lines.push('  local event, p1, p2, p3, p4, p5 = os.pullEvent()');
  lines.push('  if event == "mouse_click" or event == "monitor_touch" then');
  lines.push('    local button, mx, my = p1, p2, p3');
  lines.push('    if event == "monitor_touch" then mx, my = p2, p3 end');
  lines.push('    local sc = screenComponents[currentScreen]');
  lines.push('    for _, btn in ipairs(buttonRegions[currentScreen] or {}) do');
  lines.push('      local comp = sc and sc[btn.name:gsub("[^%w_]", "_")]');
  lines.push('      if comp and comp.visible ~= false and mx >= btn.x and mx < btn.x + btn.w and my >= btn.y and my < btn.y + btn.h then');
  lines.push('        local h = handlers[currentScreen]');
  lines.push('        if h and h.onButtonClick[btn.name] then h.onButtonClick[btn.name](mx, my, button) end');
  lines.push('        focusedButton = btn.name');
  lines.push('        if h and h.onButtonFocus[btn.name] then h.onButtonFocus[btn.name](mx, my, button) end');
  lines.push('        if comp.drawFocused then comp:drawFocused() end');
  lines.push('        break');
  lines.push('      end');
  lines.push('    end');
  lines.push('  elseif event == "mouse_up" then');
  lines.push('    if focusedButton then');
  lines.push('      local h = handlers[currentScreen]');
  lines.push('      if h and h.onButtonRelease[focusedButton] then h.onButtonRelease[focusedButton](p2, p3, p1) end');
  lines.push('      focusedButton = nil');
  lines.push('      drawCurrentScreen()');
  lines.push('    end');
  lines.push('  elseif event == "key" then');
  lines.push('    local h = handlers[currentScreen]');
  lines.push('    if h and h.onKeyPress then');
  lines.push('      for kn, handler in pairs(h.onKeyPress) do');
  lines.push('        if keys.getName(p1) == kn or kn == "any" then handler(p1) end');
  lines.push('      end');
  lines.push('    end');
  lines.push('  elseif event == "timer" then');
  lines.push('    local h = handlers[currentScreen]');
  lines.push('    if h and h.onTimer then for _, fn in pairs(h.onTimer) do fn(p1) end end');
  lines.push('  elseif event == "redstone" then');
  lines.push('    local h = handlers[currentScreen]');
  lines.push('    if h and h.onRedstone then h.onRedstone() end');
  lines.push('  elseif event == "modem_message" then');
  lines.push('    local h = handlers[currentScreen]');
  lines.push('    if h and h.onModemMessage then for _, fn in pairs(h.onModemMessage) do fn(p1, p2, p3, p4, p5) end end');
  lines.push('  end');
  lines.push('end');
  return lines.join('\n');
}

function generateUIOnlyStartup(project: CCProject): string {
  const startScreen = project.screens.find(s => s.isStartScreen) ?? project.screens[0];
  const safeName = sanitize(startScreen?.name ?? 'Screen 1');
  const lines: string[] = [
    generateHeader(project.name, project.author),
    '-- UI-Only Export',
    'local script_dir = ""',
    'if shell and shell.getRunningProgram then',
    '  local prog = shell.getRunningProgram()',
    '  local dir = prog:match("(.*/)") or ""',
    '  script_dir = dir',
    'end',
    'dofile(script_dir .. "utils/vars.lua")',
    '',
    '-- Load component classes',
    'dofile(script_dir .. "components/BaseObject.lua")',
    'dofile(script_dir .. "components/Label.lua")',
    'dofile(script_dir .. "components/Button.lua")',
    'dofile(script_dir .. "components/Container.lua")',
    'dofile(script_dir .. "components/Panel.lua")',
    '',
  ];
  for (const s of project.screens) lines.push(`dofile(script_dir .. "screens/${sanitize(s.name)}.lua")`);
  lines.push('');
  lines.push('resolveLayout(term.getSize())');
  lines.push('');
  lines.push(`drawScreen_${safeName}()`);
  return lines.join('\n');
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
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
