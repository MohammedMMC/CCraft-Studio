import { TerminalBuffer } from './TerminalBuffer';
import { CC_COLOR_NAMES, CC_COLORS, CCColor } from '../../models/CCColors';

const CC_CHAR_WIDTH = 6;
const CC_CHAR_HEIGHT = 9;
const SCALE = 4;
const MAIN_FONT_FAMILY = 'MinecraftFont';

// Preload the font so canvas can use it immediately
let fontsLoaded = false;
const fontPromise = document.fonts.load(`${CC_CHAR_HEIGHT * SCALE}px ${MAIN_FONT_FAMILY}`).then(() => fontsLoaded = true);

export class TerminalRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private buffer: TerminalBuffer;
  private charWidth: number;
  private charHeight: number;
  private blinkingData: { x: number; y: number; char: string; blinkingInterval: NodeJS.Timeout | null };

  constructor(canvas: HTMLCanvasElement, buffer: TerminalBuffer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.buffer = buffer;
    this.charWidth = CC_CHAR_WIDTH * SCALE;
    this.charHeight = CC_CHAR_HEIGHT * SCALE;
    this.blinkingData = {
      x: 0, y: 0, char: '_',
      blinkingInterval: null
    }

    this.updateCanvasSize();

    if (!fontsLoaded) {
      fontPromise.then(() => this.render());
    }

    setTimeout(() => this.render(), 100);
    setTimeout(() => this.render(), 150);
  }

  setBlinkingCursor(blink: boolean, x: number, y: number) {
    if (this.blinkingData.blinkingInterval) {
      clearInterval(this.blinkingData.blinkingInterval);
      this.blinkingData.blinkingInterval = null;
    }

    if (!blink) return;

    this.blinkingData = { x, y, char: '_', blinkingInterval: null };

    this.blinkingData.blinkingInterval = setInterval(() => {
      this.blinkingData.char = this.blinkingData.char === '_' ? ' ' : '_';
      this.render();
    }, 500);
  }

  updateCanvasSize() {
    this.canvas.width = this.buffer.width * this.charWidth;
    this.canvas.height = this.buffer.height * this.charHeight;
    this.canvas.style.imageRendering = 'pixelated';
  }

  setBuffer(buffer: TerminalBuffer) {
    this.buffer = buffer;
    this.updateCanvasSize();
  }

  render() {
    const ctx = this.ctx;
    const { width, height, cells } = this.buffer;
    const cw = this.charWidth;
    const ch = this.charHeight;

    ctx.fillStyle = CC_COLORS.black.hex;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.imageSmoothingEnabled = false;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${ch / 1.1}px ${MAIN_FONT_FAMILY}, monospace`;

    // Render cells
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = cells[y][x];
        const px = x * cw;
        const py = y * ch;

        // Background
        ctx.fillStyle = !CC_COLOR_NAMES.includes(cell.bg as CCColor) ? cell.bg : CC_COLORS[cell.bg as CCColor].hex;
        ctx.fillRect(px, py, cw, ch);

        // Character
        if (cell.char !== ' ') {
          ctx.fillStyle = !CC_COLOR_NAMES.includes(cell.fg as CCColor) ? cell.fg : CC_COLORS[cell.fg as CCColor].hex;
          ctx.fillText(cell.char, px + 1 + cw / 2, py + 1 + ch / 2);
        }
      }
    }

    if (this.blinkingData.blinkingInterval) {
      ctx.fillStyle = CC_COLORS["white"].hex;
      ctx.fillText(this.blinkingData.char, this.blinkingData.x * cw + 1 + cw / 2, this.blinkingData.y * ch + 1 + ch / 2);
    }
  }
}
