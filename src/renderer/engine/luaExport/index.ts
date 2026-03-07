import { CCProject } from '../../models/Project';
import { generateUICode } from './uiCodeGen';
import { generateHeader } from './templates';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { escapeLuaString } from '../../utils/luaHelpers';

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

  // 1. vars.lua - functions.lua
  files.push({ path: 'utils/vars.lua', content: generateVarsFile(project) });
  files.push({ path: 'utils/functions.lua', content: generateFunctionsFile(project) });

  // 2. screens/<name>.lua
  for (const screen of project.screens) {
    const safeName = sanitize(screen.name);
    files.push({
      path: `screens/${safeName}.lua`,
      content: generateScreenFile(project, screen.name, screen.uiElements),
    });
  }

  // 3. handlers.lua
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
  lines.push(`currentScreen = "${sanitize(startScreen?.name ?? 'Main')}"`);
  lines.push('running = true');
  lines.push('');
  lines.push('-- Element state');
  lines.push('elements = {}');

  for (const screen of project.screens) {
    if (screen.uiElements.length === 0) continue;
    lines.push('');
    lines.push(`-- ${screen.name} elements`);
    for (const el of screen.uiElements) {
      lines.push(`elements["${escapeLuaString(el.name)}"] = {`);
      lines.push(`  x = ${el.x}, y = ${el.y}, width = ${el.width}, height = ${el.height},`);
      lines.push(`  visible = ${el.visible},`);
      if ((el as any).text !== undefined) lines.push(`  text = "${escapeLuaString((el as any).text)}",`);
      if (el.type === 'progressBar') lines.push(`  value = ${(el as any).value ?? 0},`);
      if (el.type === 'textInput') lines.push(`  value = "${escapeLuaString((el as any).defaultValue ?? '')}",`);
      if (el.type === 'list' || el.type === 'dropdown') {
        const items = ((el as any).items ?? []).map((i: string) => `"${escapeLuaString(i)}"`).join(', ');
        lines.push(`  items = {${items}}, selectedIndex = ${((el as any).selectedIndex ?? 0) + 1},`);
      }
      if (el.type === 'tabBar') {
        const tabs = ((el as any).tabs ?? []).map((t: string) => `"${escapeLuaString(t)}"`).join(', ');
        lines.push(`  tabs = {${tabs}}, activeTab = ${((el as any).activeTab ?? 0) + 1},`);
      }
      if (el.type === 'checkbox') {
        lines.push(`  checked = ${(el as any).checked ? 'true' : 'false'},`);
      }
      if (el.type === 'scrollView') {
        lines.push(`  scrollOffset = 0, contentHeight = ${(el as any).contentHeight ?? 20},`);
      }
      // Responsive anchoring
      if (el.anchorH !== 'fixed' || el.anchorV !== 'fixed') {
        lines.push(`  anchorH = "${el.anchorH}", anchorV = "${el.anchorV}",`);
        lines.push(`  marginLeft = ${el.marginLeft}, marginRight = ${el.marginRight},`);
        lines.push(`  marginTop = ${el.marginTop}, marginBottom = ${el.marginBottom},`);
      }
      lines.push('}');
    }
  }
  return lines.join('\n');
}

function generateFunctionsFile(project: CCProject): string {
  const hasResponsiveElements = project.screens.some(s =>
    s.uiElements.some(el => el.anchorH !== 'fixed' || el.anchorV !== 'fixed')
  );

  const lines: string[] = [
    generateHeader(project.name, project.author),
    '-- =============================================',
    '-- Global Functions',
    '-- =============================================',
    '',
  ];

  lines.push('function drawCurrentScreen()');
  lines.push('  local fn = screenDrawFunctions[currentScreen]');
  lines.push('  if fn then fn() end');
  lines.push('end');
  lines.push('');
  lines.push('function navigate(screenName)');
  lines.push('  currentScreen = screenName');
  if (hasResponsiveElements) lines.push('  resolveLayout()');
  lines.push('  drawCurrentScreen()');
  lines.push('  local h = handlers[currentScreen]');
  lines.push('  if h and h.onLoad then h.onLoad() end');
  lines.push('end');
  lines.push('');
  lines.push('function refreshScreen() drawCurrentScreen() end');
  lines.push('');

  if (hasResponsiveElements) {
    lines.push('function resolveLayout()');
    lines.push('  local sw, sh = term.getSize()');
    lines.push('  for name, el in pairs(elements) do');
    lines.push('    local ah = el.anchorH or "fixed"');
    lines.push('    local av = el.anchorV or "fixed"');
    lines.push('    local ml = el.marginLeft or 0');
    lines.push('    local mr = el.marginRight or 0');
    lines.push('    local mt = el.marginTop or 0');
    lines.push('    local mb = el.marginBottom or 0');
    lines.push('    if ah == "left" then');
    lines.push('      el.x = 1 + ml');
    lines.push('    elseif ah == "right" then');
    lines.push('      el.x = sw - el.width - mr + 1');
    lines.push('    elseif ah == "center" then');
    lines.push('      el.x = math.floor((sw - el.width) / 2) + 1');
    lines.push('    elseif ah == "stretch" then');
    lines.push('      el.x = 1 + ml');
    lines.push('      el.width = sw - ml - mr');
    lines.push('    end');
    lines.push('    if av == "top" then');
    lines.push('      el.y = 1 + mt');
    lines.push('    elseif av == "bottom" then');
    lines.push('      el.y = sh - el.height - mb + 1');
    lines.push('    elseif av == "center" then');
    lines.push('      el.y = math.floor((sh - el.height) / 2) + 1');
    lines.push('    elseif av == "stretch" then');
    lines.push('      el.y = 1 + mt');
    lines.push('      el.height = sh - mt - mb');
    lines.push('    end');
    lines.push('  end');
    lines.push('end');
    lines.push('');
  }

  return lines.join('\n');
}

function generateScreenFile(_project: CCProject, screenName: string, uiElements: any[]): string {
  return `-- Screen: ${screenName}\n\n${generateUICode(uiElements, screenName)}`;
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
    lines.push(`handlers["${sn}"] = { onLoad = nil, onButtonClick = {}, onKeyPress = {}, onTimer = {}, onRedstone = nil, onModemMessage = {} }`);
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
    lines.push(`buttonRegions["${sn}"] = {`);
    for (const btn of buttons) {
      lines.push(`  { name = "${escapeLuaString(btn.name)}", x = ${btn.x}, y = ${btn.y}, w = ${btn.width}, h = ${btn.height} },`);
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
  const safeName = sanitize(startScreen?.name ?? 'Main');
  const hasResponsiveElements = project.screens.some(s =>
    s.uiElements.some(el => el.anchorH !== 'fixed' || el.anchorV !== 'fixed')
  );

  const lines: string[] = [
    generateHeader(project.name, project.author),
    'local script_path = debug.getinfo(1, "S").source:sub(2)',
    'local script_dir = script_path:match("(.*[/\\])")',
    '',
    '-- Load modules',
    'dofile(script_dir .. "utils/vars.lua")',
    'dofile(script_dir .. "utils/functions.lua")',
    '',
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
  lines.push('while running do');
  lines.push('  local event, p1, p2, p3, p4, p5 = os.pullEvent()');
  lines.push('  if event == "mouse_click" or event == "monitor_touch" then');
  lines.push('    local button, mx, my = p1, p2, p3');
  lines.push('    if event == "monitor_touch" then mx, my = p1, p2 end');
  lines.push('    for _, btn in ipairs(buttonRegions[currentScreen] or {}) do');
  lines.push('      local el = elements[btn.name]');
  lines.push('      if el and el.visible ~= false and mx >= btn.x and mx < btn.x + btn.w and my >= btn.y and my < btn.y + btn.h then');
  lines.push('        local h = handlers[currentScreen]');
  lines.push('        if h and h.onButtonClick[btn.name] then h.onButtonClick[btn.name](mx, my, button) end');
  lines.push('      end');
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
  if (hasResponsiveElements) {
    lines.push('  elseif event == "term_resize" then');
    lines.push('    resolveLayout()');
    lines.push('    drawCurrentScreen()');
  }
  lines.push('  end');
  lines.push('');

  lines.push('  -- Reload Screens');
  lines.push('  term.clear()');
  lines.push('  refreshScreen()');
  
  lines.push('end');
  return lines.join('\n');
}

function generateUIOnlyStartup(project: CCProject): string {
  const startScreen = project.screens.find(s => s.isStartScreen) ?? project.screens[0];
  const safeName = sanitize(startScreen?.name ?? 'Main');
  const lines: string[] = [
    generateHeader(project.name, project.author),
    '-- UI-Only Export',
    'dofile(script_dir .. "utils/vars.lua")',
    '',
  ];
  for (const s of project.screens) lines.push(`dofile(script_dir .. "screens/${sanitize(s.name)}.lua")`);
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
    const startMatch = line.match(/-- \[EVENT:(\w+)(?::(.+?))?\]/);
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
  switch (event) {
    case 'screen_load': return `handlers["${screen}"].onLoad = function()\n${ib}\nend`;
    case 'button_click': return `handlers["${screen}"].onButtonClick["${meta}"] = function(mx, my, button)\n${ib}\nend`;
    case 'key_press': return `handlers["${screen}"].onKeyPress["${meta}"] = function(key)\n${ib}\nend`;
    case 'timer': return `handlers["${screen}"].onTimer["t_${meta}"] = function(timerId)\n${ib}\nend`;
    case 'redstone': return `handlers["${screen}"].onRedstone = function()\n${ib}\nend`;
    case 'modem_message': return `handlers["${screen}"].onModemMessage["ch_${meta}"] = function(side, ch, replyChannel, msg, dist)\n${ib}\nend`;
    default: return body;
  }
}

function minifyLua(code: string): string {
  return code.split('\n').map(l => l.trim()).filter(l => !l.startsWith('--') && l.length > 0).join('\n');
}
