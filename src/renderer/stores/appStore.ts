import { create } from 'zustand';

interface AppStore {
    craftPCDataPath: string | null;
    craftPCExecPath: string | null;
    useCraftOSPC: boolean;

    loadApp: (data: Object) => void;
    saveApp: () => void;

    setCraftOSPC: (value: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
    craftPCDataPath: null,
    craftPCExecPath: null,
    useCraftOSPC: false,

    loadApp: (data) => set(data),

    saveApp: () => {
        window.electronAPI.saveAppData({
            useCraftOSPC: get().useCraftOSPC,
            craftPCDataPath: get().craftPCDataPath,
            craftPCExecPath: get().craftPCExecPath,
        });
    },

    setCraftOSPC: (value) => set({ useCraftOSPC: value }),
}));
