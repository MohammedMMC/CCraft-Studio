import { UIElement } from '../../models/UIElement';
import { CC_COLORS, CCColor } from '../../models/CCColors';
import { escapeLuaString, indent } from '../../utils/luaHelpers';

export function generateUICode(elements: UIElement[], screenName: string, ind: number = 1): string {
  const lines: string[] = [];
  const i = (n: number) => indent(ind + n);

  lines.push(`${indent(ind)}function drawScreen_${sanitize(screenName)}()`);
  lines.push(`${i(0)}  term.setBackgroundColor(${CC_COLORS.black.luaName})`);
  lines.push(`${i(0)}  term.clear()`);

  const sorted = [...elements].filter(e => e.visible).sort((a, b) => a.zIndex - b.zIndex);

  for (const el of sorted) {
    lines.push('');
    lines.push(`${i(0)}  -- ${el.name} (${el.type})`);
    lines.push(...generateElementLua(el, ind + 1));
  }

  lines.push(`${indent(ind)}end`);
  return lines.join('\n');
}

function generateElementLua(el: UIElement, ind: number): string[] {
  const i = indent(ind);
  const lines: string[] = [];
  const fg = CC_COLORS[el.fgColor].luaName;
  const bg = CC_COLORS[el.bgColor].luaName;

  switch (el.type) {
    case 'label': {
      lines.push(`${i}term.setTextColor(${fg})`);
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
      const text = alignTextLua(el.text, el.width, el.textAlign);
      lines.push(`${i}term.write(${text})`);
      break;
    }

    case 'button': {
      lines.push(`${i}term.setTextColor(${fg})`);
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      // Fill background
      for (let row = 0; row < el.height; row++) {
        lines.push(`${i}term.setCursorPos(${el.x}, ${el.y + row})`);
        lines.push(`${i}term.write(string.rep(" ", ${el.width}))`);
      }
      // Write centered text
      const midY = el.y + Math.floor(el.height / 2);
      const text = alignTextLua(el.text, el.width, el.textAlign);
      lines.push(`${i}term.setCursorPos(${el.x}, ${midY})`);
      lines.push(`${i}term.write(${text})`);
      break;
    }
  }

  return lines;
}

function alignTextLua(text: string, width: number, align: 'left' | 'center' | 'right'): string {
  const escaped = escapeLuaString(text);
  switch (align) {
    case 'center':
      return `string.rep(" ", math.floor((${width} - #"${escaped}") / 2)) .. "${escaped}" .. string.rep(" ", math.ceil((${width} - #"${escaped}") / 2))`;
    case 'right':
      return `string.rep(" ", ${width} - #"${escaped}") .. "${escaped}"`;
    default:
      return `"${escaped}" .. string.rep(" ", ${width} - #"${escaped}")`;
  }
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}
