

/**
 * CraftOS-PC Raw Mode Protocol v1.2 — Full TypeScript Parser
 * https://www.craftos-pc.cc/docs/rawmode
 */

let _crcTable: number[] | null = null;
function crc32(str: string): number {
    if (!_crcTable) {
        _crcTable = Array.from({ length: 256 }, (_, n) => {
            let c = n;
            for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            return c;
        });
    }
    let crc = 0 ^ -1;
    for (let i = 0; i < str.length; i++)
        crc = (crc >>> 8) ^ _crcTable[(crc ^ str.charCodeAt(i)) & 0xff];
    return (crc ^ -1) >>> 0;
}

// ─── Buffer reader ────────────────────────────────────────────────────────────

function reader(buf: Buffer) {
    let p = 0;
    return {
        get pos() { return p; },
        u8() { return buf.readUInt8(p++); },
        u16() { const v = buf.readUInt16LE(p); p += 2; return v; },
        u32() { const v = buf.readUInt32LE(p); p += 4; return v; },
        u64() { const v = Number(buf.readBigUInt64LE(p)); p += 8; return v; },
        f64() { const v = buf.readDoubleBE(p); p += 8; return v; },
        i8() { return buf.readInt8(p++); },
        back() { p--; },
        skip(n: number) { p += n; },
        string() { let s = ''; for (let c = this.u8(); c !== 0; c = this.u8()) s += String.fromCharCode(c); return s; },
        bytes(n: number) { const v = buf.subarray(p, p + n); p += n; return v; },
        eof() { return p >= buf.length; },
    };
}

type Reader = ReturnType<typeof reader>;

// ─── Packet types ─────────────────────────────────────────────────────────────

export type RGBColor = { r: number; g: number; b: number };
export type Palette = Record<number, RGBColor>;
export type Grid = Record<number, Record<number, number>>;

/** Type 0 — Terminal contents (server → client) */
export interface PacketTerminal {
    type: 0;
    windowId: number;
    mode: 0 | 1 | 2;       // 0=text, 1=16-color gfx, 2=256-color gfx
    blink: boolean;          // cursor blinking (v1.1+) or showing (v1.0)
    width: number;           // in character cells
    height: number;
    cursorX: number;
    cursorY: number;
    grayscale: boolean;
    // mode 0 only
    screen?: Grid;           // screen[y][x] = char code
    colors?: Grid;           // colors[y][x] = byte: high nibble=BG, low nibble=FG
    // mode 1/2 only
    pixels?: Grid;           // pixels[y][x] = palette index
    // mode 0/1 → 16 entries; mode 2 → 256 entries
    palette: Palette;
}

/** Type 1 — Key event (client → server) */
export interface PacketKey {
    type: 1;
    windowId: number;
    isChar: boolean;         // true = char event (bit 3 of flags set)
    keyId: number;           // CC key ID (see KEY_MAP), or char code if isChar
    keyDown: boolean;        // true = key_down, false = key_up
    held: boolean;           // true = key is held/auto-repeating
    ctrlHeld: boolean;       // true = Ctrl is held
}

/** Type 2 — Mouse event (client → server) */
export interface PacketMouse {
    type: 2;
    windowId: number;
    event: 'click' | 'up' | 'scroll' | 'drag';
    button: number;          // 1=left,2=right,3=middle; or scroll direction 0=up,1=down
    x: number;               // char cell in mode 0, pixel in mode 1/2
    y: number;
}

/** Type 3 — Generic Lua event (client → server) */
export interface PacketEvent {
    type: 3;
    windowId: number;
    name: string;
    params: LuaValue[];
}

/** Type 4 — Terminal / window change */
export interface PacketTermChange {
    type: 4;
    windowId: number;
    closing: 0 | 1 | 2;     // 0=open/update, 1=close window, 2=quit all
    computerId: number;      // >0 means computerId-1 (v1.1+)
    width: number;
    height: number;
    title: string;
}

/** Type 5 — Show message (server → client) */
export interface PacketMessage {
    type: 5;
    windowId: number;
    flags: number;           // 0=none, 0x10=error, 0x20=warning, 0x40=info
    severity: 'none' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}

/** Type 6 — Version/capability flags */
export interface PacketCapabilities {
    type: 6;
    windowId: number;
    binaryChecksum: boolean; // bit 0
    filesystemSupport: boolean; // bit 1
    requestAllWindows: boolean; // bit 2
    speakerSupport: boolean;    // bit 3
    rawFlags: number;
}

/** Type 7 — File request (client → server) */
export interface PacketFileRequest {
    type: 7;
    windowId: number;
    requestType: number;
    requestId: number;
    path: string;
    path2?: string;          // for copy/move (types 12, 13)
}

/** Type 8 — File response (server → client) */
export interface PacketFileResponse {
    type: 8;
    windowId: number;
    requestType: number;
    requestId: number;
    result: FileResponseResult;
}

export type FileResponseResult =
    | { kind: 'boolean'; value: boolean }
    | { kind: 'integer'; value: number }
    | { kind: 'string'; value: string }
    | { kind: 'list'; value: string[] }
    | { kind: 'attributes'; size: number; created: Date; modified: Date; isDir: boolean; isReadOnly: boolean }
    | { kind: 'success' }
    | { kind: 'error'; message: string };

/** Type 9 — File data */
export interface PacketFileData {
    type: 9;
    windowId: number;
    requestId: number;
    error: boolean;
    data: Buffer;
}

/** Type 10 — Speaker sound (server → client) */
export interface PacketSpeaker {
    type: 10;
    windowId: number;
    soundType: number;
    soundName: string;       // for types 0-15: note name; 254: minecraft sound; 255: 'dfpwm'
    speakerId: number;
    volume: number;          // 0-255 maps to 0.0-3.0
    speed: number;           // decoded to float multiplier
    payload: Buffer;         // empty for notes, sound name for 254, audio for 255
}

export interface PacketUnknown {
    type: -1;
    windowId: number;
    rawType: number;
    data: Buffer;
}

export type CraftOSPacket =
    | PacketTerminal | PacketKey | PacketMouse | PacketEvent
    | PacketTermChange | PacketMessage | PacketCapabilities
    | PacketFileRequest | PacketFileResponse | PacketFileData
    | PacketSpeaker | PacketUnknown;

// ─── Lua value (for Type 3) ───────────────────────────────────────────────────

export type LuaValue =
    | { luaType: 'number'; value: number }
    | { luaType: 'float'; value: number }
    | { luaType: 'boolean'; value: boolean }
    | { luaType: 'string'; value: string }
    | { luaType: 'table'; keys: LuaValue[]; values: LuaValue[] }
    | { luaType: 'nil' };

function readLuaValue(r: Reader): LuaValue {
    const t = r.u8();
    if (t === 0) return { luaType: 'number', value: r.u32() };
    if (t === 1) return { luaType: 'float', value: r.f64() };
    if (t === 2) return { luaType: 'boolean', value: r.u8() !== 0 };
    if (t === 3) return { luaType: 'string', value: r.string() };
    if (t === 4) {
        const count = r.u8();
        const keys: LuaValue[] = Array.from({ length: count }, () => readLuaValue(r));
        const values: LuaValue[] = Array.from({ length: count }, () => readLuaValue(r));
        return { luaType: 'table', keys, values };
    }
    return { luaType: 'nil' };
}

// ─── RLE decoder ─────────────────────────────────────────────────────────────

function decodeRLE(r: Reader, width: number, height: number): Grid {
    const grid: Grid = {};
    let c = r.u8(), n = r.u8();
    for (let y = 0; y < height; y++) {
        grid[y] = {};
        for (let x = 0; x < width; x++) {
            grid[y][x] = c;
            if (--n === 0) { c = r.u8(); n = r.u8(); }
        }
    }
    // Per spec: at end, c/n will be first bytes of next field — put them back
    r.back(); r.back();
    return grid;
}

// ─── Individual packet parsers ────────────────────────────────────────────────

const NOTE_NAMES = [
    'banjo', 'basedrum', 'bass', 'bell', 'bit', 'chime',
    'cow_bell', 'didgeridoo', 'flute', 'guitar', 'harp', 'hat',
    'iron_xylophone', 'pling', 'snare', 'xylophone',
];

function parseType0(r: Reader, windowId: number): PacketTerminal {
    const mode = r.u8() as 0 | 1 | 2;
    const blink = r.u8() === 1;
    const width = r.u16();
    const height = r.u16();
    const cursorX = r.u16();
    const cursorY = r.u16();
    const grayscale = r.u8() === 1;
    r.skip(3); // reserved

    let screen: Grid | undefined, colors: Grid | undefined, pixels: Grid | undefined;

    if (mode === 0) {
        screen = decodeRLE(r, width, height);
        colors = decodeRLE(r, width, height);
    } else {
        pixels = decodeRLE(r, width * 6, height * 9);
    }

    const palSize = mode === 2 ? 256 : 16;
    const palette: Palette = {};
    for (let i = 0; i < palSize; i++)
        palette[i] = { r: r.u8(), g: r.u8(), b: r.u8() };

    return { type: 0, windowId, mode, blink, width, height, cursorX, cursorY, grayscale, screen, colors, pixels, palette };
}

function parseType1(r: Reader, windowId: number): PacketKey {
    const keyId = r.u8();
    const flags = r.u8();
    return {
        type: 1, windowId,
        isChar: (flags & 0b1000) !== 0,
        keyDown: (flags & 0b0001) !== 0,
        held: (flags & 0b0010) !== 0,
        ctrlHeld: (flags & 0b0100) !== 0,
        keyId,
    };
}

function parseType2(r: Reader, windowId: number): PacketMouse {
    const evtIdx = r.u8();
    const button = r.u8();
    const x = r.u32();
    const y = r.u32();
    const EVENTS = ['click', 'up', 'scroll', 'drag'] as const;
    return { type: 2, windowId, event: EVENTS[evtIdx] ?? 'click', button, x, y };
}

function parseType3(r: Reader, windowId: number): PacketEvent {
    const count = r.u8();
    const name = r.string();
    const params = Array.from({ length: count }, () => readLuaValue(r));
    return { type: 3, windowId, name, params };
}

function parseType4(r: Reader, windowId: number): PacketTermChange {
    const closing = r.u8() as 0 | 1 | 2;
    const computerId = r.u8();
    const width = r.u16();
    const height = r.u16();
    const title = r.string();
    return { type: 4, windowId, closing, computerId, width, height, title };
}

function parseType5(r: Reader, windowId: number): PacketMessage {
    const flags = r.u32();
    const title = r.string();
    const message = r.string();
    const severity = flags === 0x10 ? 'error' : flags === 0x20 ? 'warning' : flags === 0x40 ? 'info' : 'none';
    return { type: 5, windowId, flags, severity, title, message };
}

function parseType6(r: Reader, windowId: number): PacketCapabilities {
    const rawFlags = r.u16();
    return {
        type: 6, windowId, rawFlags,
        binaryChecksum: (rawFlags & 1) !== 0,
        filesystemSupport: (rawFlags & 2) !== 0,
        requestAllWindows: (rawFlags & 4) !== 0,
        speakerSupport: (rawFlags & 8) !== 0,
    };
}

function parseType7(r: Reader, windowId: number): PacketFileRequest {
    const requestType = r.u8();
    const requestId = r.u8();
    const path = r.string();
    const path2 = (requestType === 12 || requestType === 13) ? r.string() : undefined;
    return { type: 7, windowId, requestType, requestId, path, path2 };
}

function parseType8(r: Reader, windowId: number): PacketFileResponse {
    const requestType = r.u8();
    const requestId = r.u8();
    let result: FileResponseResult;

    if ([0, 1, 2].includes(requestType)) {
        // Boolean operations
        const v = r.u8();
        result = v === 0 ? { kind: 'boolean', value: false }
            : v === 1 ? { kind: 'boolean', value: true }
                : { kind: 'error', message: 'operation failed' };
    } else if ([3, 5, 6].includes(requestType)) {
        // Integer operations
        const v = r.u32();
        result = v === 0xffffffff ? { kind: 'error', message: 'operation failed' } : { kind: 'integer', value: v };
    } else if (requestType === 4) {
        // String (getDrive)
        const v = r.string();
        result = v ? { kind: 'string', value: v } : { kind: 'error', message: 'operation failed' };
    } else if (requestType === 7 || requestType === 9) {
        // List (list, find)
        const count = r.u32();
        if (count === 0xffffffff) { result = { kind: 'error', message: 'operation failed' }; }
        else { result = { kind: 'list', value: Array.from({ length: count }, () => r.string()) }; }
    } else if (requestType === 8) {
        // Attributes
        const size = r.u32();
        const created = new Date(r.u64());
        const modified = new Date(r.u64());
        const isDir = r.u8() !== 0;
        const isReadOnly = r.u8() !== 0;
        const ok = r.u8();
        result = ok === 0 ? { kind: 'attributes', size, created, modified, isDir, isReadOnly }
            : ok === 1 ? { kind: 'error', message: 'does not exist' }
                : { kind: 'error', message: 'operation failed' };
    } else {
        // Non-returning operations (makeDir, delete, copy, move, write ops)
        const errMsg = r.string();
        result = errMsg === '' ? { kind: 'success' } : { kind: 'error', message: errMsg };
    }

    return { type: 8, windowId, requestType, requestId, result };
}

function parseType9(r: Reader, windowId: number, totalBytes: number): PacketFileData {
    const error = r.u8() !== 0;
    const requestId = r.u8();
    const size = r.u32();
    const data = r.bytes(size);
    return { type: 9, windowId, requestId, error, data: Buffer.from(data) };
}

function parseType10(r: Reader, windowId: number): PacketSpeaker {
    const soundType = r.u8();
    const speakerId = r.u8();
    const volume = r.u8();
    const speedParam = r.i8();
    const payloadSize = r.u16();
    const payload = Buffer.from(r.bytes(payloadSize));

    // Decode speed exponent: speed = 2^(param / (param < 0 ? 128 : 127))
    const speed = Math.pow(2, speedParam / (speedParam < 0 ? 128 : 127));

    const soundName =
        soundType <= 15 ? (NOTE_NAMES[soundType] ?? `note_${soundType}`)
            : soundType === 254 ? payload.toString('utf8').replace(/\0/g, '')
                : soundType === 255 ? 'dfpwm'
                    : `unknown_${soundType}`;

    return { type: 10, windowId, soundType, soundName, speakerId, volume, speed, payload };
}

// ─── Main parser ──────────────────────────────────────────────────────────────

export interface ParseResult {
    packet: CraftOSPacket;
    /** How many raw bytes were consumed from the input buffer */
    bytesConsumed: number;
    /** Was the CRC valid? */
    checksumOk: boolean;
}

export interface ParseOptions {
    /** After Type 6 exchange, CRC is over raw binary not base64 */
    useBinaryChecksum?: boolean;
    /** After Type 6 exchange, large !CPD packets are supported */
    isVersion11?: boolean;
}

/**
 * Parse one CraftOS-PC raw mode packet from a Buffer.
 *
 * @param buf   Raw bytes from stdout (may contain multiple packets)
 * @param opts  Protocol state flags (update after receiving Type 6)
 * @returns     Parsed packet + bytes consumed, or null if not enough data yet
 */
export function parseCraftOSPacket(
    buf: Buffer,
    opts: ParseOptions = {}
): ParseResult | null {
    const { useBinaryChecksum = false, isVersion11 = false } = opts;

    // Determine header and payload offset
    const magic = buf.subarray(0, 4).toString('ascii');
    let off: number;

    if (magic === '!CPC') {
        off = 8;
    } else if (magic === '!CPD' && isVersion11) {
        off = 16;
    } else {
        return null; // Not enough data or corrupt stream
    }

    if (buf.length < off) return null; // Need more data

    const payloadSize = parseInt(buf.subarray(4, off).toString('ascii'), 16);
    const totalPacket = off + payloadSize + 8 + 1; // header + payload + crc + newline

    if (buf.length < off + payloadSize + 8) return null; // Need more data

    // Verify CRC
    const b64 = buf.subarray(off, off + payloadSize).toString('ascii');
    const decoded = Buffer.from(b64, 'base64');
    const goodCRC = parseInt(buf.subarray(off + payloadSize, off + payloadSize + 8).toString('ascii'), 16);
    const calcCRC = crc32(useBinaryChecksum ? decoded.toString('binary') : b64);
    const checksumOk = goodCRC === calcCRC;

    // Parse payload
    const r = reader(decoded);
    const rawType = r.u8();
    const windowId = r.u8();

    let packet: CraftOSPacket;

    try {
        switch (rawType) {
            case 0: packet = parseType0(r, windowId); break;
            case 1: packet = parseType1(r, windowId); break;
            case 2: packet = parseType2(r, windowId); break;
            case 3: packet = parseType3(r, windowId); break;
            case 4: packet = parseType4(r, windowId); break;
            case 5: packet = parseType5(r, windowId); break;
            case 6: packet = parseType6(r, windowId); break;
            case 7: packet = parseType7(r, windowId); break;
            case 8: packet = parseType8(r, windowId); break;
            case 9: packet = parseType9(r, windowId, decoded.length); break;
            case 10: packet = parseType10(r, windowId); break;
            default: packet = { type: -1, windowId, rawType, data: decoded.subarray(2) };
        }
    } catch {
        packet = { type: -1, windowId, rawType, data: decoded.subarray(2) };
    }

    return { packet, bytesConsumed: totalPacket, checksumOk };
}

/**
 * Parse ALL complete packets from a buffer (handles multiple packets + partial trailing data).
 *
 * @example
 * proc.stdout.on('data', (chunk: Buffer) => {
 *   leftover = Buffer.concat([leftover, chunk]);
 *   const { packets, remaining } = parseCraftOSPackets(leftover);
 *   leftover = remaining;
 *   for (const { packet } of packets) handlePacket(packet);
 * });
 */
export function parseCraftOSPackets(
    buf: Buffer,
    opts: ParseOptions = {}
): { packets: ParseResult[]; remaining: Buffer } {
    const packets: ParseResult[] = [];

    while (buf.length > 0) {
        // Skip leading whitespace (spec says newline terminates each packet)
        while (buf.length > 0 && (buf[0] === 0x0a || buf[0] === 0x0d)) buf = buf.subarray(1);
        if (buf.length === 0) break;

        const result = parseCraftOSPacket(buf, opts);
        if (!result) break; // Incomplete packet — wait for more data

        packets.push(result);
        buf = buf.subarray(result.bytesConsumed);
    }

    return { packets, remaining: buf };
}

// ─── Packet builders (client → server) ───────────────────────────────────────

let _useBinaryChecksum = false;
export function setBinaryChecksum(v: boolean) { _useBinaryChecksum = v; }

function buildPacket(payload: Buffer): string {
    const b64 = payload.toString('base64');
    const cs = crc32(_useBinaryChecksum ? payload.toString('binary') : b64).toString(16).padStart(8, '0');
    return `!CPC${b64.length.toString(16).padStart(4, '0')}${b64}${cs}\n`;
}

/**
 * Build a Type 1 key packet to send to CraftOS-PC stdin.
 *
 * @example
 * // Press 'a' (key 30), then release
 * stdin.write(buildKeyPacket(0, 30, true,  false)); // key_down
 * stdin.write(buildKeyPacket(0, 97, false, true));  // char 'a'
 * stdin.write(buildKeyPacket(0, 30, false, false)); // key_up
 */
export function buildKeyPacket(
    windowId: number,
    keyIdOrChar: number,
    keyDown: boolean,
    isChar: boolean,
    held = false,
    ctrlHeld = false
): string {
    const flags =
        (keyDown ? 0b0001 : 0) |
        (held ? 0b0010 : 0) |
        (ctrlHeld ? 0b0100 : 0) |
        (isChar ? 0b1000 : 0);
    return buildPacket(Buffer.from([1, windowId, keyIdOrChar, flags]));
}

/**
 * Build a Type 2 mouse packet.
 *
 * @example
 * stdin.write(buildMousePacket(0, 'click', 1, 5, 3)); // left click at (5,3)
 */
export function buildMousePacket(
    windowId: number,
    event: 'click' | 'up' | 'scroll' | 'drag',
    button: number,
    x: number,
    y: number
): string {
    const EVENT_IDS = { click: 0, up: 1, scroll: 2, drag: 3 };
    const buf = Buffer.alloc(10);
    buf[0] = 2; buf[1] = windowId;
    buf[2] = EVENT_IDS[event]; buf[3] = button;
    buf.writeUInt32LE(x, 4);
    buf.writeUInt32LE(y, 8);
    return buildPacket(buf);
}

/**
 * The initial handshake to send on connection.
 * Requests binary checksum + filesystem + window list (flags 0x0007).
 */
export const HANDSHAKE = '!CPC0008BgAHAA==8C7C7ED3\n';
