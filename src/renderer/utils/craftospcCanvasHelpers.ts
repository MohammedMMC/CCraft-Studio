import { TerminalBuffer } from '@/engine/terminal/TerminalBuffer';
import { TerminalRenderer } from '@/engine/terminal/TerminalRenderer';
import type * as craftpcHelpers from 'src/main/craftospcHelpers';

export type Monitor = {
    windowId: number;
    width: number;
    height: number;
    canvasWidth: number;
    canvasHeight: number;
    buffer: TerminalBuffer;
    renderer: TerminalRenderer; 
    id: string;
};

export function rgbColorFromPalette(
    palette: craftpcHelpers.PacketTerminal['palette'],
    colors: craftpcHelpers.PacketTerminal['colors'],
    x: number, y: number): [string, string] {
    const color = colors?.[y]?.[x] ?? 0;
    const colorPaletteBG = palette?.[color >> 4];
    const colorPaletteFG = palette?.[color & 0xF];

    return [
        colorPaletteFG ? `rgb(${colorPaletteFG.r},${colorPaletteFG.g},${colorPaletteFG.b})` : 'white',
        colorPaletteBG ? `rgb(${colorPaletteBG.r},${colorPaletteBG.g},${colorPaletteBG.b})` : 'black'
    ]
}