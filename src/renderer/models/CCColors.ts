export type CCColor =
  | 'white' | 'orange' | 'magenta' | 'lightBlue'
  | 'yellow' | 'lime' | 'pink' | 'gray'
  | 'lightGray' | 'cyan' | 'purple' | 'blue'
  | 'brown' | 'green' | 'red' | 'black'
  | 'transparent';

export const CC_COLORS: Record<CCColor, { hex: string; luaName: string; luaValue: number }> = {
  white:     { hex: '#F0F0F0', luaName: 'colors.white',     luaValue: 1 },
  orange:    { hex: '#F2B233', luaName: 'colors.orange',    luaValue: 2 },
  magenta:   { hex: '#E57FD8', luaName: 'colors.magenta',   luaValue: 4 },
  lightBlue: { hex: '#99B2F2', luaName: 'colors.lightBlue', luaValue: 8 },
  yellow:    { hex: '#DEDE6C', luaName: 'colors.yellow',    luaValue: 16 },
  lime:      { hex: '#7FCC19', luaName: 'colors.lime',      luaValue: 32 },
  pink:      { hex: '#F2B2CC', luaName: 'colors.pink',      luaValue: 64 },
  gray:      { hex: '#4C4C4C', luaName: 'colors.gray',      luaValue: 128 },
  lightGray: { hex: '#999999', luaName: 'colors.lightGray', luaValue: 256 },
  cyan:      { hex: '#4C99B2', luaName: 'colors.cyan',      luaValue: 512 },
  purple:    { hex: '#B266E5', luaName: 'colors.purple',    luaValue: 1024 },
  blue:      { hex: '#3366CC', luaName: 'colors.blue',      luaValue: 2048 },
  brown:     { hex: '#7F664C', luaName: 'colors.brown',     luaValue: 4096 },
  green:     { hex: '#57A64E', luaName: 'colors.green',     luaValue: 8192 },
  red:       { hex: '#CC4C4C', luaName: 'colors.red',       luaValue: 16384 },
  black:     { hex: '#111111', luaName: 'colors.black',     luaValue: 32768 },
  transparent: { hex: 'transparent', luaName: '',            luaValue: -1 },
};

export const CC_COLOR_NAMES: CCColor[] = [
  'white', 'orange', 'magenta', 'lightBlue',
  'yellow', 'lime', 'pink', 'gray',
  'lightGray', 'cyan', 'purple', 'blue',
  'brown', 'green', 'red', 'black',
  'transparent',
];
