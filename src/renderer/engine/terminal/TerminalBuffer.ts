import { CCColor, CC_COLORS } from '../../models/CCColors';

export interface TerminalCell {
  char: string;
  fg: CCColor;
  bg: CCColor;
}

export class TerminalBuffer {
  width: number;
  height: number;
  cells: TerminalCell[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.clear();
  }

  clear(bg: CCColor = 'black') {
    this.cells = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => ({
        char: ' ',
        fg: 'white' as CCColor,
        bg,
      }))
    );
  }

  setCell(x: number, y: number, char: string, fg: CCColor, bg: CCColor) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      const existing = this.cells[y][x];
      this.cells[y][x] = {
        char: char === ' ' ? existing.char : (char[0] || ' '),
        fg, bg,
      };
    }
  }

  writeText(x: number, y: number, text: string, fg: CCColor, bg: CCColor) {
    for (let i = 0; i < text.length; i++) {
      this.setCell(x + i, y, text[i], fg, bg);
    }
  }

  fillRect(x: number, y: number, w: number, h: number, char: string, fg: CCColor, bg: CCColor) {
    for (let row = y; row < y + h && row < this.height; row++) {
      for (let col = x; col < x + w && col < this.width; col++) {
        this.setCell(col, row, char, fg, bg);
      }
    }
  }

  getCell(x: number, y: number): TerminalCell | null {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.cells[y][x];
    }
    return null;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.clear();
  }
}
