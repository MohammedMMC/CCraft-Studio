import { CC_COLORS, CCColor } from "@/models/CCColors";

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

export function luaColor(color: CCColor): string | null {
  return CC_COLORS[color].luaName;
}

export function minifyLua(code: string): string {
  return code.split('\n').map(l => l.trim()).filter(l => !l.startsWith('--') && l.length > 0).join('\n');
}