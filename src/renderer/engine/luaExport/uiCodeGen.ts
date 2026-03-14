import { UIElement, ContainerElement, resolveSize, resolveContainerLayout } from '../../models/UIElement';
import { CCColor, CC_COLORS } from '../../models/CCColors';
import { escapeLuaString, indent } from '../../utils/luaHelpers';

function luaColor(color: CCColor): string | null {
  if (color === 'transparent') return null;
  return CC_COLORS[color].luaName;
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

/** Resolve absolute positions for all elements, including children inside containers. */
function buildPositionMap(
  elements: UIElement[],
  displayWidth: number,
  displayHeight: number,
): Map<string, { x: number; y: number; width: number; height: number }> {
  const map = new Map<string, { x: number; y: number; width: number; height: number }>();

  function resolveContainer(
    container: ContainerElement,
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
      if (child?.type === 'container') {
        resolveContainer(child as ContainerElement, pos.x, pos.y, pos.width, pos.height);
      }
    }
  }

  for (const el of elements) {
    const { width, height } = resolveSize(el, displayWidth, displayHeight);

    if (el.parentId === null) {
      map.set(el.id, { x: el.x, y: el.y, width, height });
    }

    if (el.type === 'container' && el.parentId === null) {
      resolveContainer(el as ContainerElement, el.x, el.y, width, height);
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

  // Screen namespace table
  lines.push(`local screen_${safeName} = {}`);
  lines.push('');

  // Collect all visible elements with resolved positions
  const allVisible = elements.filter(e => e.visible && posMap.has(e.id));

  // Generate component instances for all elements
  for (const el of allVisible) {
    const pos = posMap.get(el.id)!;
    const varName = `screen_${safeName}.${sanitize(el.name)}`;
    lines.push(...generateComponentInstance(el, pos, varName));
    lines.push('');
  }

  // Wire container children
  for (const el of allVisible) {
    if (el.type !== 'container') continue;
    const children = elements
      .filter(c => c.parentId === el.id && c.visible && posMap.has(c.id))
      .sort((a, b) => a.zIndex - b.zIndex);
    for (const child of children) {
      lines.push(`screen_${safeName}.${sanitize(el.name)}:addChild(screen_${safeName}.${sanitize(child.name)})`);
    }
    if (children.length > 0) lines.push('');
  }

  // Draw order: top-level elements sorted by zIndex
  const topLevel = allVisible
    .filter(e => e.parentId === null)
    .sort((a, b) => a.zIndex - b.zIndex);

  lines.push(`screen_${safeName}._drawOrder = {`);
  for (const el of topLevel) {
    lines.push(`${i}screen_${safeName}.${sanitize(el.name)},`);
  }
  lines.push('}');
  lines.push('');

  // Draw function
  lines.push(`function drawScreen_${safeName}()`);
  lines.push(`${i}term.setBackgroundColor(${CC_COLORS.black.luaName})`);
  lines.push(`${i}term.clear()`);
  lines.push(`${i}for _, obj in ipairs(screen_${safeName}._drawOrder) do`);
  lines.push(`${i}${i}obj:draw()`);
  lines.push(`${i}end`);
  lines.push('end');
  lines.push('');

  // Register screen components for event loop access
  lines.push(`screenComponents["${safeName}"] = screen_${safeName}`);

  return lines.join('\n');
}

function generateComponentInstance(
  el: UIElement,
  pos: { x: number; y: number; width: number; height: number },
  varName: string,
): string[] {
  const lines: string[] = [];
  const escapedName = escapeLuaString(el.name);

  switch (el.type) {
    case 'label': {
      const fg = luaColor(el.fgColor);
      const bg = luaColor(el.bgColor);
      lines.push(`${varName} = Label:new("${escapedName}", {`);
      lines.push(`  x = ${pos.x}, y = ${pos.y}, width = ${pos.width}, height = ${pos.height},`);
      lines.push(`  text = "${escapeLuaString(el.text)}", textAlign = "${el.textAlign}",`);
      lines.push(`  fgColor = ${fg ?? 'nil'}, bgColor = ${bg ?? 'nil'},`);
      lines.push(`  visible = ${el.visible},`);
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
      lines.push(`  text = "${escapeLuaString(el.text)}", textAlign = "${el.textAlign}",`);
      lines.push(`  fgColor = ${fg ?? 'nil'}, bgColor = ${bg ?? 'nil'},`);
      lines.push(`  focusTextColor = ${focusFg ?? 'nil'}, focusBgColor = ${focusBg ?? 'nil'},`);
      lines.push(`  visible = ${el.visible},`);
      lines.push('})');
      break;
    }

    case 'container': {
      const fg = luaColor(el.fgColor);
      const bg = luaColor(el.bgColor);
      lines.push(`${varName} = Container:new("${escapedName}", {`);
      lines.push(`  x = ${pos.x}, y = ${pos.y}, width = ${pos.width}, height = ${pos.height},`);
      lines.push(`  fgColor = ${fg ?? 'nil'}, bgColor = ${bg ?? 'nil'},`);
      lines.push(`  visible = ${el.visible},`);
      lines.push('})');
      break;
    }
  }

  return lines;
}
