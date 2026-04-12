import { UIElement, ContainerElement, PanelElement, resolveSize, resolveContainerLayout, isContainerLike, UIElementType } from '../../models/UIElement';
import { escapeLuaString, indent, luaColor, sanitize } from '../../utils/luaHelpers';
import { CC_COLOR_NAMES, CC_COLORS } from '../../models/CCColors';
import { CCProject, getMonitorSize } from '@/models/Project';

const CLASSES_NAMES: { [key in UIElementType]: string } = {
  "progressbar": "ProgressBar",
  "container": "Container",
  "checkbox": "CheckBox",
  "button": "Button",
  "slider": "Slider",
  "label": "Label",
  "panel": "Panel",
  "input": "Input",
};

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
  project: CCProject,
  elements: UIElement[],
  screenName: string,
  displayWidth: number,
  displayHeight: number,
): string {
  const screen = project.screens.find(s => s.name === screenName);
  const safeName = sanitize(screenName);
  const posMap = buildPositionMap(elements, displayWidth, displayHeight);
  const lines: string[] = [];
  const i = indent(1);

  const monitorSize = getMonitorSize(`${screen?.monitorsHeightSize}x${screen?.monitorsWidthSize}`);
  lines.push(`local screen = Screen:new("${safeName}", { 
    bgColor = ${luaColor(screen?.bgColor || 'black')},
    isWorkingScreen = ${screen?.isWorkingScreen}, displayType = "${screen?.displayType}",
    monitorsHeightSize = ${monitorSize.height}, monitorsWidthSize = ${monitorSize.width},
    monitorsHeightUnit = "${screen?.monitorsHeightUnit}", monitorsWidthUnit = "${screen?.monitorsWidthUnit}",
  })`);
  lines.push('');

  const allVisible = elements.filter(e => e.visible && posMap.has(e.id));

  for (const el of allVisible) {
    lines.push(...generateComponentInstance(safeName, el, posMap.get(el.id)!, elements));
    lines.push('');
  }

  for (const el of allVisible) {
    if (el.type !== 'container' && el.type !== 'panel') continue;
    const children = elements
      .filter(c => c.parentId === el.id && c.visible && posMap.has(c.id))
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const child of children) {
      lines.push(`screen:getChild("${sanitize(el.name)}"):addChild(screen:getChild("${sanitize(child.name)}"))`);
    }
    if (children.length > 0) lines.push('');
  }

  const topLevel = allVisible
    .filter(e => e.parentId === null)
    .sort((a, b) => a.zIndex - b.zIndex);

  for (const el of topLevel) {
    lines.push(`screen:addDrawOrder("${sanitize(el.name)}")`);
  }
  lines.push('');
  lines.push(`table.insert(screens, screen)`);

  return lines.join('\n');
}

function generateComponentInstance(
  screenName: string,
  el: UIElement,
  pos: { x: number; y: number; width: number; height: number },
  allElements: UIElement[],
): string[] {
  const lines: string[] = [];

  lines.push(`screen:addChild(${CLASSES_NAMES[el.type]}:new("${sanitize(el.name)}", {`);

  lines.push(`  x = ${pos.x}, y = ${pos.y}, width = ${pos.width}, height = ${pos.height},`);

  if (el.widthUnit !== 'px') {
    lines.push(`  rawWidth = ${el.widthUnit === 'fill' ? 100 : el.width},`);
  }
  if (el.heightUnit !== 'px') {
    lines.push(`  rawHeight = ${el.heightUnit === 'fill' ? 100 : el.height},`);
  }
  if (el.parentId) {
    const parent = allElements.find(p => p.id === el.parentId);
    if (parent) lines.push(`  parentName = "${escapeLuaString(parent.name)}",`);
  }

  Object.entries(el).filter(([key]) =>
    !['x', 'y', 'width', 'height', 'parentId', 'id'].includes(key)
  ).forEach(([key, value]: [string, any]) => {
    if (typeof value === 'string') {
      if (key.includes('Color') && CC_COLOR_NAMES.includes(value as any)) {
        lines.push(`  ${key} = ${luaColor(value as any)},`);
      } else {
        lines.push(`  ${key} = "${escapeLuaString(value)}",`);
      }
    } else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
      lines.push(`  ${key} = ${value === null ? 'nil' : value},`);
    } else {
      lines.push(`  ${key} = "${value}",`);
    }
  });

  lines.push(`   screenName = "${screenName}",`);

  lines.push('}))');

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
  const eMeta = sanitize(escapeLuaString(meta));
  switch (event) {
    case 'screen_load': {
      return `screen.onLoad = function()\n${ib}\nend`;
    }
    case 'button_click': return `screen:getChild("${eMeta}").events["button_click"] = function(x, y)\n${ib}\nend`;
    case 'button_focus': return `screen:getChild("${eMeta}").events["button_focus"] = function(x, y)\n${ib}\nend`;
    case 'button_release': return `screen:getChild("${eMeta}").events["button_release"] = function(x, y)\n${ib}\nend`;

    case 'key_press': return `handlers["${screen}"].onKeyPress["${eMeta}"] = function(key)\n${ib}\nend`;
    case 'timer': return `handlers["${screen}"].onTimer["t_${eMeta}"] = function(timerId)\n${ib}\nend`;
    case 'redstone': return `handlers["${screen}"].onRedstone = function()\n${ib}\nend`;
    case 'modem_message': return `handlers["${screen}"].onModemMessage["ch_${eMeta}"] = function(side, ch, replyChannel, msg, dist)\n${ib}\nend`;
    default: return body;
  }
}