export type CCColor =
  | 'white' | 'orange' | 'magenta' | 'lightBlue'
  | 'yellow' | 'lime' | 'pink' | 'gray'
  | 'lightGray' | 'cyan' | 'purple' | 'blue'
  | 'brown' | 'green' | 'red' | 'black';

export const CC_COLORS: Record<CCColor, { hex: string; luaName: string; blit: string; luaValue: number }> = {
  white:     { hex: '#F0F0F0', luaName: 'colors.white',     blit: "0", luaValue: 1 },
  orange:    { hex: '#F2B233', luaName: 'colors.orange',    blit: "1", luaValue: 2 },
  magenta:   { hex: '#E57FD8', luaName: 'colors.magenta',   blit: "2", luaValue: 4 },
  lightBlue: { hex: '#99B2F2', luaName: 'colors.lightBlue', blit: "3", luaValue: 8 },
  yellow:    { hex: '#DEDE6C', luaName: 'colors.yellow',    blit: "4", luaValue: 16 },
  lime:      { hex: '#7FCC19', luaName: 'colors.lime',      blit: "5", luaValue: 32 },
  pink:      { hex: '#F2B2CC', luaName: 'colors.pink',      blit: "6", luaValue: 64 },
  gray:      { hex: '#4C4C4C', luaName: 'colors.gray',      blit: "7", luaValue: 128 },
  lightGray: { hex: '#999999', luaName: 'colors.lightGray', blit: "8", luaValue: 256 },
  cyan:      { hex: '#4C99B2', luaName: 'colors.cyan',      blit: "9", luaValue: 512 },
  purple:    { hex: '#B266E5', luaName: 'colors.purple',    blit: "a", luaValue: 1024 },
  blue:      { hex: '#3366CC', luaName: 'colors.blue',      blit: "b", luaValue: 2048 },
  brown:     { hex: '#7F664C', luaName: 'colors.brown',     blit: "c", luaValue: 4096 },
  green:     { hex: '#57A64E', luaName: 'colors.green',     blit: "d", luaValue: 8192 },
  red:       { hex: '#CC4C4C', luaName: 'colors.red',       blit: "e", luaValue: 16384 },
  black:     { hex: '#111111', luaName: 'colors.black',     blit: "f", luaValue: 32768 },
};

export const CC_COLOR_NAMES: CCColor[] = [
  'white', 'orange', 'magenta', 'lightBlue',
  'yellow', 'lime', 'pink', 'gray',
  'lightGray', 'cyan', 'purple', 'blue',
  'brown', 'green', 'red', 'black',
];
