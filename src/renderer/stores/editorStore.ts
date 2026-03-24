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
  showCraftPC: boolean;
  showGrid: boolean;
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
  toggleCraftPC: () => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  setClipboard: (data: string | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'ui',
  tool: 'select',
  selectedElementId: null,
  selectedBlockId: null,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  showGrid: true,
  snapToGrid: true,
  clipboard: null,
  showCraftPC: false,

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
  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  toggleCraftPC: () => set((s) => ({ showCraftPC: !s.showCraftPC })),
  setClipboard: (data) => set({ clipboard: data }),
}));
