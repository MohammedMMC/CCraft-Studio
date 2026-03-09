import { create } from 'zustand';

export type EditorMode = 'ui' | 'blocks';
export type EditorTool = 'select' | 'pan';

interface EditorState {
  mode: EditorMode;
  tool: EditorTool;
  selectedElementId: string | null;
  selectedBlockId: string | null;
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  showPreview: boolean;
  previewWidth: number;
  snapToGrid: boolean;
  clipboard: string | null;

  setMode: (mode: EditorMode) => void;
  setTool: (tool: EditorTool) => void;
  selectElement: (elementId: string | null) => void;
  selectBlock: (blockId: string | null) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  toggleGrid: () => void;
  togglePreview: () => void;
  setPreviewWidth: (width: number) => void;
  toggleSnap: () => void;
  setClipboard: (data: string | null) => void;
}

// Load persisted preferences from localStorage
const loadPref = <T>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return JSON.parse(val);
  } catch { /* ignore */ }
  return fallback;
};

const savePref = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'ui',
  tool: 'select',
  selectedElementId: null,
  selectedBlockId: null,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  showGrid: true,
  showPreview: loadPref('ccraft:showPreview', true),
  previewWidth: loadPref('ccraft:previewWidth', 320),
  snapToGrid: true,
  clipboard: null,

  setMode: (mode) => set({ mode, selectedElementId: null, selectedBlockId: null }),
  setTool: (tool) => set({ tool }),
  selectElement: (elementId) => set({ selectedElementId: elementId }),
  selectBlock: (blockId) => set({ selectedBlockId: blockId }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(3, zoom)) }),
  zoomIn: () => set((s) => ({ zoom: Math.min(3, s.zoom + 0.1) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(0.25, s.zoom - 0.1) })),
  resetZoom: () => set({ zoom: 1, panOffset: { x: 0, y: 0 } }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  togglePreview: () => set((s) => {
    const next = !s.showPreview;
    savePref('ccraft:showPreview', next);
    return { showPreview: next };
  }),
  setPreviewWidth: (width) => {
    const clamped = Math.max(200, Math.min(800, width));
    savePref('ccraft:previewWidth', clamped);
    set({ previewWidth: clamped });
  },
  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  setClipboard: (data) => set({ clipboard: data }),
}));
