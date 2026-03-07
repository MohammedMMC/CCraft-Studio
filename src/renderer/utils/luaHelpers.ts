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
