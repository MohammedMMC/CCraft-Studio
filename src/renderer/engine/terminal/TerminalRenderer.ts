import { TerminalBuffer } from './TerminalBuffer';
import { CC_COLOR_NAMES, CC_COLORS, CCColor } from '../../models/CCColors';

export const CC_CHAR_WIDTH = 12;
export const CC_CHAR_HEIGHT = 18;
const FONT_IMAGE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGd27GMAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjE2RGmv9QAACjlJREFUeF7tm4mS3DgORO3//2gPjkzwLqmrxwW5ybcGEwChWhI6o2P315/NqRrw+/fvRgfmaSlfHmG8ns2mNEBXacb9/OaOKdwIBFh9mwKepgUsV50e91GqBsiGfbG+81hfLJMSMabpDViaFmg9tJ1IYX0FXKk5Kubr0CGznG+m6+Nnx32WugHtgmN9RcyhmqNivg4tkvIsygNGqu1MBrMrQP+Zg+VxlYOijF6LpsOriF/VgnYqg9IAWY0vZ9g4GOYdCbsMiJ/p64tOj/ssVQPeZNmAIH+XL/h+A/5xTgOg2zJrAJ9S8HiLD7c6o17/KX41yzaf+5RRnfg+8Gwh6jjDgl574rDhJxOQBsQy3IuFyWCx/cfU0oR1VK82RdiU23RTx8NysQbMNyJinmRtHlZg1Cp/h0osxgQTprmMV4CojSqMTWUWM4ZUN/VV3IqNgjjms6z5tTTGZ0DZCImNe57zURazbQxlRPTw+UwKk7dAtT46qmXd/QZ6bdHy+cwjePEavODhG7vL+RCCbstpAFQpDzPzysM/xuIZdPxZ8MYT4etH/O/caAAedmKIoYwjLI7ThSOXBR9g0gDuv2ycREGjfYEMnqom5lwWfIDZFQCqK8CU8xI2lVXAA3yMA40+bg7MY92AesGmCGT7XSFUYJ2n2rKBi+kPUTego7oVEFsCUhHhIt+lGffpHG7cAhAdzZN+9JXMz+nzHq+qP8yLK+B/4yFbnfOJBjya0wDotkgD4m1H4VM/nmrm6NuAEz4iLmnXCc0Egxf1H8T/ImQr4T4607H4AhzmeuNYtDhOqeomMrAGVFt36JlqgQpPuA7A8p1x7FWP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";

export class TerminalRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private buffer: TerminalBuffer;
  private blinkingData: { x: number; y: number; char: string; blinkingInterval: NodeJS.Timeout | null };

  private fontData: ImageData | null = null;
  private fontDataWidth = 0;
  private fontReady = false;

  constructor(canvas: HTMLCanvasElement, buffer: TerminalBuffer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.buffer = buffer;
    this.blinkingData = {
      x: 0, y: 0, char: '_',
      blinkingInterval: null
    }

    this.loadBitmapFont();
    this.updateCanvasSize();

    setTimeout(() => this.render(), 1000);
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
    this.canvas.width = this.buffer.width * CC_CHAR_WIDTH;
    this.canvas.height = this.buffer.height * CC_CHAR_HEIGHT;
  }

  setBuffer(buffer: TerminalBuffer) {
    this.buffer = buffer;
    this.updateCanvasSize();
  }

  private async loadBitmapFont() {
    const img = new Image();
    img.src = FONT_IMAGE_DATA_URL;
    await img.decode();

    const fontCanvas = document.createElement('canvas');
    fontCanvas.width = 256;
    fontCanvas.height = 350;

    const fontCtx = fontCanvas.getContext('2d', { willReadFrequently: true })!;
    fontCtx.imageSmoothingEnabled = false;
    fontCtx.clearRect(0, 0, fontCanvas.width, fontCanvas.height);
    fontCtx.drawImage(img, 0, 0, 512, 512);

    this.fontData = fontCtx.getImageData(0, 0, 256, 350);
    this.fontDataWidth = this.fontData.width;
    this.fontReady = true;

    this.render();
  }

  private drawBitmapChar(
    ch: string,
    cellX: number,
    cellY: number,
    fgHex: string,
    bgHex: string
  ) {
    if (!this.fontReady || !this.fontData) return;

    const code = ch.length !== 1 ? parseInt(ch) : ch.charCodeAt(0) & 0xff;
    const srcX = 16 * (code & 0x0f) + 2;
    const srcY = 22 * (code >> 4) + 2;

    const cellStartX = cellX * CC_CHAR_WIDTH;
    const cellStartY = cellY * CC_CHAR_HEIGHT;

    for (let yy = 0; yy < CC_CHAR_HEIGHT; yy++) {
      for (let xx = 0; xx < CC_CHAR_WIDTH; xx++) {
        this.ctx.fillStyle = this.fontData.data[((srcY + yy) * this.fontDataWidth + (srcX + xx)) * 4 + 3] > 127 ? fgHex : bgHex;
        this.ctx.fillRect(cellStartX + xx, cellStartY + yy, 1, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const { width, height, cells } = this.buffer;
    const cw = CC_CHAR_WIDTH;
    const ch = CC_CHAR_HEIGHT;

    ctx.fillStyle = CC_COLORS.black.hex;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.imageSmoothingEnabled = false;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

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
          const fg = !CC_COLOR_NAMES.includes(cell.fg as CCColor)
            ? (cell.fg as string)
            : CC_COLORS[cell.fg as CCColor].hex;

          const bg = !CC_COLOR_NAMES.includes(cell.bg as CCColor)
            ? (cell.bg as string)
            : CC_COLORS[cell.bg as CCColor].hex;

          this.drawBitmapChar(cell.char, x, y, fg, bg);
        }
      }
    }
    if (this.blinkingData.blinkingInterval) {
      this.drawBitmapChar(this.blinkingData.char, this.blinkingData.x, this.blinkingData.y, CC_COLORS.white.hex, "transparent");
    }
  }
}
