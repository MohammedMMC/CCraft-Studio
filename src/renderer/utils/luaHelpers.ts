import { ContainerElement, isContainerLike, PanelElement, resolveContainerLayout, resolveSize, UIElement } from "@/models/UIElement";

export function escapeLuaString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

export function luaString(str: string): string {
  return `"${escapeLuaString(str)}"`;
}

export function indent(level: number): string {
  return '  '.repeat(level);
}

export function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

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
