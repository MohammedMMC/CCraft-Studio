import { UIElement, ContainerElement, PanelElement, resolveSize, resolveContainerLayout, isContainerLike } from '../../models/UIElement';
import { escapeLuaString, indent, luaColor, sanitize } from '../../utils/luaHelpers';
import { CC_COLORS } from '../../models/CCColors';

export function buildPositionMap(
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

export function generateUICode(
  elements: UIElement[],
  screenName: string,
  displayWidth: number,
  displayHeight: number,
): string {
  const safeName = sanitize(screenName);
  const posMap = buildPositionMap(elements, displayWidth, displayHeight);
  const lines: string[] = [];
  const i = indent(1);

  lines.push(`local screen_${safeName} = {}`);
  lines.push('');

  const allVisible = elements.filter(e => e.visible && posMap.has(e.id));

  for (const el of allVisible) {
    const pos = posMap.get(el.id)!;
    const varName = `screen_${safeName}.${sanitize(el.name)}`;
    lines.push(...generateComponentInstance(el, pos, varName, elements));
    lines.push('');
  }

  for (const el of allVisible) {
    if (el.type !== 'container' && el.type !== 'panel') continue;
    const children = elements
      .filter(c => c.parentId === el.id && c.visible && posMap.has(c.id))
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const child of children) {
      lines.push(`screen_${safeName}.${sanitize(el.name)}:addChild(screen_${safeName}.${sanitize(child.name)})`);
    }
    if (children.length > 0) lines.push('');
  }

  const topLevel = allVisible
    .filter(e => e.parentId === null)
    .sort((a, b) => a.zIndex - b.zIndex);

  lines.push(`screen_${safeName}._drawOrder = {`);
  for (const el of topLevel) {
    lines.push(`${i}screen_${safeName}.${sanitize(el.name)},`);
  }
  lines.push('}');
  lines.push('');

  lines.push(`function drawScreen_${safeName}()`);
  lines.push(`${i}term.setBackgroundColor(${CC_COLORS.black.luaName})`);
  lines.push(`${i}term.clear()`);
  lines.push(`${i}for _, obj in ipairs(screen_${safeName}._drawOrder) do`);
  lines.push(`${i}${i}obj:draw()`);
  lines.push(`${i}end`);
  lines.push('end');
  lines.push('');

  lines.push(`screenComponents["${safeName}"] = screen_${safeName}`);

  return lines.join('\n');
}

function generateComponentInstance(
  el: UIElement,
  pos: { x: number; y: number; width: number; height: number },
  varName: string,
  allElements: UIElement[],
): string[] {
  const lines: string[] = [];
  const escapedName = escapeLuaString(el.name);

  const unitLines: string[] = [];
  if (el.widthUnit !== 'px') {
    unitLines.push(`  widthUnit = "${el.widthUnit}", rawWidth = ${el.width},`);
  }
  if (el.heightUnit !== 'px') {
    unitLines.push(`  heightUnit = "${el.heightUnit}", rawHeight = ${el.height},`);
  }

  const parentLine: string[] = [];
  if (el.parentId) {
    const parent = allElements.find(p => p.id === el.parentId);
    if (parent) parentLine.push(`  parentName = "${escapeLuaString(parent.name)}",`);
  }

  switch (el.type) {
    case 'label': {
      const fg = luaColor(el.fgColor);
      const bg = luaColor(el.bgColor);
      lines.push(`${varName} = Label:new("${varName + "_" + escapedName}", {`);
      lines.push(`  x = ${pos.x}, y = ${pos.y}, width = ${pos.width}, height = ${pos.height},`);
      lines.push(...unitLines);
      lines.push(...parentLine);
      lines.push(`  text = "${escapeLuaString(el.text)}", textAlign = "${el.textAlign}",`);
      lines.push(`  fgColor = ${fg ?? 'nil'}, bgColor = ${bg ?? 'nil'},`);
      lines.push(`  visible = ${el.visible},`);
      lines.push(`  zIndex = ${el.zIndex},`);
      lines.push(`  type = "${el.type}",`);
      lines.push('})');
      break;
    }

    case 'button': {
      const fg = luaColor(el.fgColor);
      const bg = luaColor(el.bgColor);
      const focusFg = luaColor(el.focusTextColor);
      const focusBg = luaColor(el.focusBgColor);
      lines.push(`${varName} = Button:new("${escapedName}", {`);
      lines.push(`  x = ${pos.x}, y = ${pos.y}, width = ${pos.width}, height = ${pos.height},`);
      lines.push(...unitLines);
      lines.push(...parentLine);
      lines.push(`  text = "${escapeLuaString(el.text)}", textAlign = "${el.textAlign}",`);
      lines.push(`  fgColor = ${fg ?? 'nil'}, bgColor = ${bg ?? 'nil'},`);
      lines.push(`  focusTextColor = ${focusFg ?? 'nil'}, focusBgColor = ${focusBg ?? 'nil'},`);
      lines.push(`  visible = ${el.visible},`);
      lines.push(`  zIndex = ${el.zIndex},`);
      lines.push(`  type = "${el.type}",`);
      lines.push('})');
      break;
    }

    case 'container': {
      const fg = luaColor(el.fgColor);
      const bg = luaColor(el.bgColor);
      lines.push(`${varName} = Container:new("${escapedName}", {`);
      lines.push(`  x = ${pos.x}, y = ${pos.y}, width = ${pos.width}, height = ${pos.height},`);
      lines.push(...unitLines);
      lines.push(...parentLine);
      lines.push(`  fgColor = ${fg ?? 'nil'}, bgColor = ${bg ?? 'nil'},`);
      lines.push(`  visible = ${el.visible},`);
      lines.push(`  zIndex = ${el.zIndex},`);
      lines.push(`  type = "${el.type}",`);
      lines.push(`  display = "${el.display}", flexDirection = "${el.flexDirection}",`);
      lines.push(`  gap = ${el.gap}, gapUnit = "${el.gapUnit}",`);
      lines.push(`  alignItems = "${el.alignItems}", justifyContent = "${el.justifyContent}",`);
      lines.push(`  gridTemplateCols = ${el.gridTemplateCols}, gridTemplateRows = ${el.gridTemplateRows},`);
      lines.push(`  padding = ${el.padding}, paddingUnit = "${el.paddingUnit}",`);
      lines.push('})');
      break;
    }

    case 'panel': {
      const fg = luaColor(el.fgColor);
      const bg = luaColor(el.bgColor);
      const border = luaColor(el.borderColor);
      const titleBg = luaColor(el.titleBgColor);
      lines.push(`${varName} = Panel:new("${escapedName}", {`);
      lines.push(`  x = ${pos.x}, y = ${pos.y}, width = ${pos.width}, height = ${pos.height},`);
      lines.push(...unitLines);
      lines.push(...parentLine);
      lines.push(`  text = "${escapeLuaString(el.text)}", textAlign = "${el.textAlign}",`);
      lines.push(`  fgColor = ${fg ?? 'nil'}, bgColor = ${bg ?? 'nil'},`);
      lines.push(`  borderColor = ${border ?? 'nil'}, titleBgColor = ${titleBg ?? 'nil'},`);
      lines.push(`  visible = ${el.visible},`);
      lines.push(`  zIndex = ${el.zIndex},`);
      lines.push(`  type = "${el.type}",`);
      lines.push(`  display = "${el.display}", flexDirection = "${el.flexDirection}",`);
      lines.push(`  gap = ${el.gap}, gapUnit = "${el.gapUnit}",`);
      lines.push(`  alignItems = "${el.alignItems}", justifyContent = "${el.justifyContent}",`);
      lines.push(`  gridTemplateCols = ${el.gridTemplateCols}, gridTemplateRows = ${el.gridTemplateRows},`);
      lines.push(`  padding = ${el.padding}, paddingUnit = "${el.paddingUnit}",`);
      lines.push('})');
      break;
    }
  }

  return lines;
}

export function parseEventCode(code: string, screenName: string): string {
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

export function wrapEvent(screen: string, event: string, meta: string, body: string): string {
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