import { create } from 'zustand';

interface BlocklyState {
  // XML per screen id
  workspaceXml: Record<string, string>;
  // Generated Lua code per screen id
  luaCode: Record<string, string>;

  getXml: (screenId: string) => string | undefined;
  setXml: (screenId: string, xml: string) => void;
  getLuaCode: (screenId: string) => string;
  setLuaCode: (screenId: string, code: string) => void;
  removeScreen: (screenId: string) => void;
  clear: () => void;

  // For project save/load
  getAllXml: () => Record<string, string>;
  loadAllXml: (data: Record<string, string>) => void;
}

export const useBlocklyStore = create<BlocklyState>((set, get) => ({
  workspaceXml: {},
  luaCode: {},

  getXml: (screenId) => get().workspaceXml[screenId],

  setXml: (screenId, xml) => set((s) => ({
    workspaceXml: { ...s.workspaceXml, [screenId]: xml },
  })),

  getLuaCode: (screenId) => get().luaCode[screenId] || '',

  setLuaCode: (screenId, code) => set((s) => ({
    luaCode: { ...s.luaCode, [screenId]: code },
  })),

  removeScreen: (screenId) => set((s) => {
    const { [screenId]: _xml, ...restXml } = s.workspaceXml;
    const { [screenId]: _code, ...restCode } = s.luaCode;
    return { workspaceXml: restXml, luaCode: restCode };
  }),

  clear: () => set({ workspaceXml: {}, luaCode: {} }),

  getAllXml: () => get().workspaceXml,
  loadAllXml: (data) => set({ workspaceXml: data }),
}));
