import { UIElement } from '../../models/UIElement';
import { CC_COLORS, CCColor } from '../../models/CCColors';
import { escapeLuaString, indent } from '../../utils/luaHelpers';

export function generateUICode(elements: UIElement[], screenName: string, ind: number = 1): string {
  const lines: string[] = [];
  const i = (n: number) => indent(ind + n);

  lines.push(`${indent(ind)}local function drawScreen_${sanitize(screenName)}()`);
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

    case 'textInput': {
      lines.push(`${i}term.setTextColor(${fg})`);
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
      lines.push(`${i}term.write(string.rep(" ", ${el.width}))`);
      lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
      lines.push(`${i}term.write(elements["${escapeLuaString(el.name)}"].value or "${escapeLuaString(el.placeholder)}")`);
      break;
    }

    case 'progressBar': {
      lines.push(`${i}local pct_${sanitize(el.name)} = elements["${escapeLuaString(el.name)}"].value / ${el.maxValue}`);
      lines.push(`${i}local fillW_${sanitize(el.name)} = math.floor(${el.width} * pct_${sanitize(el.name)})`);
      lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
      lines.push(`${i}term.setTextColor(${CC_COLORS[el.fillColor].luaName})`);
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      lines.push(`${i}term.write(string.rep("${escapeLuaString(el.fillChar)}", fillW_${sanitize(el.name)}))`);
      lines.push(`${i}term.setTextColor(${CC_COLORS[el.emptyColor].luaName})`);
      lines.push(`${i}term.write(string.rep("${escapeLuaString(el.emptyChar)}", ${el.width} - fillW_${sanitize(el.name)}))`);
      break;
    }

    case 'list': {
      lines.push(`${i}local items_${sanitize(el.name)} = elements["${escapeLuaString(el.name)}"].items`);
      lines.push(`${i}local sel_${sanitize(el.name)} = elements["${escapeLuaString(el.name)}"].selectedIndex`);
      lines.push(`${i}for row = 0, ${el.height - 1} do`);
      lines.push(`${i}  local idx = row + 1`);
      lines.push(`${i}  term.setCursorPos(${el.x}, ${el.y} + row)`);
      lines.push(`${i}  if idx == sel_${sanitize(el.name)} then`);
      lines.push(`${i}    term.setTextColor(${CC_COLORS[el.selectedFgColor].luaName})`);
      lines.push(`${i}    term.setBackgroundColor(${CC_COLORS[el.selectedBgColor].luaName})`);
      lines.push(`${i}  else`);
      lines.push(`${i}    term.setTextColor(${fg})`);
      lines.push(`${i}    term.setBackgroundColor(${bg})`);
      lines.push(`${i}  end`);
      lines.push(`${i}  local text = items_${sanitize(el.name)}[idx] or ""`);
      lines.push(`${i}  term.write(text .. string.rep(" ", ${el.width} - #text))`);
      lines.push(`${i}end`);
      break;
    }

    case 'panel': {
      if (el.filled) {
        lines.push(`${i}term.setBackgroundColor(${bg})`);
        for (let row = 0; row < el.height; row++) {
          lines.push(`${i}term.setCursorPos(${el.x}, ${el.y + row})`);
          lines.push(`${i}term.write(string.rep(" ", ${el.width}))`);
        }
      }
      if (el.borderStyle !== 'none') {
        const bc = CC_COLORS[el.borderColor].luaName;
        lines.push(`${i}term.setTextColor(${bc})`);
        lines.push(`${i}term.setBackgroundColor(${bg})`);
        const chars = el.borderStyle === 'double'
          ? { tl: '\u2554', tr: '\u2557', bl: '\u255a', br: '\u255d', h: '\u2550', v: '\u2551' }
          : el.borderStyle === 'rounded'
            ? { tl: '\u256d', tr: '\u256e', bl: '\u2570', br: '\u256f', h: '\u2500', v: '\u2502' }
            : { tl: '\u250c', tr: '\u2510', bl: '\u2514', br: '\u2518', h: '\u2500', v: '\u2502' };
        lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
        lines.push(`${i}term.write("${chars.tl}" .. string.rep("${chars.h}", ${el.width - 2}) .. "${chars.tr}")`);
        for (let row = 1; row < el.height - 1; row++) {
          lines.push(`${i}term.setCursorPos(${el.x}, ${el.y + row})`);
          lines.push(`${i}term.write("${chars.v}")`);
          lines.push(`${i}term.setCursorPos(${el.x + el.width - 1}, ${el.y + row})`);
          lines.push(`${i}term.write("${chars.v}")`);
        }
        lines.push(`${i}term.setCursorPos(${el.x}, ${el.y + el.height - 1})`);
        lines.push(`${i}term.write("${chars.bl}" .. string.rep("${chars.h}", ${el.width - 2}) .. "${chars.br}")`);
        if (el.title) {
          lines.push(`${i}term.setTextColor(${fg})`);
          lines.push(`${i}term.setCursorPos(${el.x + 2}, ${el.y})`);
          lines.push(`${i}term.write("${escapeLuaString(el.title)}")`);
        }
      }
      break;
    }

    case 'statusBar': {
      lines.push(`${i}term.setTextColor(${fg})`);
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
      const text = alignTextLua(el.text, el.width, el.textAlign);
      lines.push(`${i}term.write(${text})`);
      break;
    }

    case 'image': {
      lines.push(`${i}-- Image element: ${el.name} (NFP rendering not included)`);
      break;
    }

    case 'scrollView': {
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      for (let row = 0; row < el.height; row++) {
        lines.push(`${i}term.setCursorPos(${el.x}, ${el.y + row})`);
        lines.push(`${i}term.write(string.rep(" ", ${el.width}))`);
      }
      if (el.borderStyle === 'single') {
        const bc = CC_COLORS[el.borderColor].luaName;
        lines.push(`${i}term.setTextColor(${bc})`);
        lines.push(`${i}term.setCursorPos(${el.x + el.width - 1}, ${el.y})`);
        lines.push(`${i}term.write("^")`);
        lines.push(`${i}term.setCursorPos(${el.x + el.width - 1}, ${el.y + el.height - 1})`);
        lines.push(`${i}term.write("v")`);
      }
      break;
    }

    case 'tabBar': {
      lines.push(`${i}local tabs_${sanitize(el.name)} = elements["${escapeLuaString(el.name)}"].tabs or {}`);
      lines.push(`${i}local activeTab_${sanitize(el.name)} = elements["${escapeLuaString(el.name)}"].activeTab or 1`);
      lines.push(`${i}local tabX_${sanitize(el.name)} = ${el.x}`);
      lines.push(`${i}for ti, tabText in ipairs(tabs_${sanitize(el.name)}) do`);
      lines.push(`${i}  if ti == activeTab_${sanitize(el.name)} then`);
      lines.push(`${i}    term.setTextColor(${CC_COLORS[el.activeFgColor].luaName})`);
      lines.push(`${i}    term.setBackgroundColor(${CC_COLORS[el.activeBgColor].luaName})`);
      lines.push(`${i}  else`);
      lines.push(`${i}    term.setTextColor(${CC_COLORS[el.inactiveFgColor].luaName})`);
      lines.push(`${i}    term.setBackgroundColor(${CC_COLORS[el.inactiveBgColor].luaName})`);
      lines.push(`${i}  end`);
      lines.push(`${i}  term.setCursorPos(tabX_${sanitize(el.name)}, ${el.y})`);
      lines.push(`${i}  term.write(" " .. tabText .. " ")`);
      lines.push(`${i}  tabX_${sanitize(el.name)} = tabX_${sanitize(el.name)} + #tabText + 2`);
      lines.push(`${i}end`);
      break;
    }

    case 'divider': {
      const dc = CC_COLORS[el.dividerColor].luaName;
      lines.push(`${i}term.setTextColor(${dc})`);
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      const divChars: Record<string, { h: string; v: string }> = {
        thin:   { h: '\u2500', v: '\u2502' },
        thick:  { h: '\u2501', v: '\u2503' },
        dashed: { h: '\u2504', v: '\u2506' },
        double: { h: '\u2550', v: '\u2551' },
      };
      const dc2 = divChars[el.style] || divChars.thin;
      if (el.orientation === 'horizontal') {
        lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
        lines.push(`${i}term.write(string.rep("${dc2.h}", ${el.width}))`);
      } else {
        for (let row = 0; row < el.height; row++) {
          lines.push(`${i}term.setCursorPos(${el.x}, ${el.y + row})`);
          lines.push(`${i}term.write("${dc2.v}")`);
        }
      }
      break;
    }

    case 'checkbox': {
      lines.push(`${i}term.setTextColor(${fg})`);
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
      lines.push(`${i}local checked_${sanitize(el.name)} = elements["${escapeLuaString(el.name)}"].checked`);
      lines.push(`${i}if checked_${sanitize(el.name)} then`);
      lines.push(`${i}  term.setTextColor(${CC_COLORS[el.checkColor].luaName})`);
      lines.push(`${i}  term.write("${escapeLuaString(el.checkedChar)}")`);
      lines.push(`${i}else`);
      lines.push(`${i}  term.write("${escapeLuaString(el.uncheckedChar)}")`);
      lines.push(`${i}end`);
      lines.push(`${i}term.setTextColor(${fg})`);
      lines.push(`${i}term.write(" ${escapeLuaString(el.text)}")`);
      break;
    }

    case 'dropdown': {
      lines.push(`${i}term.setTextColor(${fg})`);
      lines.push(`${i}term.setBackgroundColor(${bg})`);
      lines.push(`${i}term.setCursorPos(${el.x}, ${el.y})`);
      lines.push(`${i}local ddItems_${sanitize(el.name)} = elements["${escapeLuaString(el.name)}"].items or {}`);
      lines.push(`${i}local ddSel_${sanitize(el.name)} = elements["${escapeLuaString(el.name)}"].selectedIndex or 1`);
      lines.push(`${i}local ddText = ddItems_${sanitize(el.name)}[ddSel_${sanitize(el.name)}] or ""`);
      lines.push(`${i}term.write(ddText .. string.rep(" ", ${el.width} - #ddText - 2) .. " v")`);
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
