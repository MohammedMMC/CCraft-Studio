import { create } from 'zustand';

interface AppStore {
    craftPCDataPath: string | null;
    craftPCExecPath: string | null;
    useCraftOSPC: boolean;
    cloudEnabled: boolean;

    loadApp: (data: Object) => void;
    saveApp: () => void;

    setCraftOSPC: (value: boolean) => void;
    setCloudEnabled: (value: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
    craftPCDataPath: null,
    craftPCExecPath: null,
    useCraftOSPC: false,
    cloudEnabled: false,

    loadApp: (data) => {
        set(data);

        if (get().useCraftOSPC && (get().craftPCDataPath === null || get().craftPCExecPath === null)) {
            window.electronAPI.craftpc.getDirs().then((dirs) => {
                set({
                    craftPCDataPath: dirs.data,
                    craftPCExecPath: dirs.exec,
                });
                get().saveApp();
            });
        }
    },

    saveApp: () => {
        window.electronAPI.saveAppData({
            useCraftOSPC: get().useCraftOSPC,
            cloudEnabled: get().cloudEnabled,
            craftPCDataPath: get().craftPCDataPath,
            craftPCExecPath: get().craftPCExecPath,
        });
    },

    setCraftOSPC: (value) => set({ useCraftOSPC: value }),
    setCloudEnabled: (value) => set({ cloudEnabled: value }),
}));
