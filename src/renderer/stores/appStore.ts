import { create } from 'zustand';

interface AppStore {
    filePath: string | null;
    useCraftOSPC: boolean;

    setCraftOSPC: (value: boolean) => void;

    loadApp: (data: Object) => void;
    saveApp: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
    filePath: null,
    useCraftOSPC: false,

    loadApp: (data) => set(data),

    saveApp: () => {
        window.electronAPI.saveAppData({
            useCraftOSPC: get().useCraftOSPC
        });
    },

    setCraftOSPC: (value) => set({ useCraftOSPC: value }),
}));
