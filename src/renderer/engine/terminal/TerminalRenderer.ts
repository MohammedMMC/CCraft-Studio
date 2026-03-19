import { TerminalBuffer } from './TerminalBuffer';
import { CC_COLORS } from '../../models/CCColors';

const CC_CHAR_WIDTH = 6;
const CC_CHAR_HEIGHT = 9;
const SCALE = 2;
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

  constructor(canvas: HTMLCanvasElement, buffer: TerminalBuffer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.buffer = buffer;
    this.charWidth = CC_CHAR_WIDTH * SCALE;
    this.charHeight = CC_CHAR_HEIGHT * SCALE;

    this.updateCanvasSize();

    if (!fontsLoaded) {
      fontPromise.then(() => this.render());
    }

    setTimeout(() => this.render(), 100);
    setTimeout(() => this.render(), 150);
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
    ctx.textBaseline = 'top';
    ctx.textAlign = "left";
    ctx.font = `${ch}px ${MAIN_FONT_FAMILY}, monospace`;

    // Render cells
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = cells[y][x];
        const px = x * cw;
        const py = y * ch;

        // Background
        ctx.fillStyle = CC_COLORS[cell.bg].hex;
        ctx.fillRect(px, py, cw, ch);

        // Character
        if (cell.char !== ' ') {
          ctx.fillStyle = CC_COLORS[cell.fg].hex;
          ctx.fillText(cell.char, px + 1, py + 1);
        }
      }
    }
  }

  getCharAt(clientX: number, clientY: number): { x: number; y: number } | null {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = Math.floor((clientX - rect.left) * scaleX / this.charWidth);
    const y = Math.floor((clientY - rect.top) * scaleY / this.charHeight);

    if (x >= 0 && x < this.buffer.width && y >= 0 && y < this.buffer.height) {
      return { x, y };
    }
    return null;
  }
}
