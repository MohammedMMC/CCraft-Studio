import { create } from 'zustand';
import { CCProject, Screen, GlobalVariable, createDefaultProject, DeviceType } from '../models/Project';

interface ProjectState {
  project: CCProject | null;
  filePath: string | null;
  isDirty: boolean;
  activeScreenId: string | null;

  createProject: (overrides?: Partial<CCProject>) => void;
  loadProject: (project: CCProject, filePath: string) => void;
  setFilePath: (path: string) => void;
  markDirty: () => void;
  markClean: () => void;
  closeProject: () => void;

  updateProjectInfo: (updates: Partial<Pick<CCProject, 'name' | 'author' | 'description' | 'device' | 'displayWidth' | 'displayHeight' | 'colorMode'>>) => void;

  setActiveScreen: (screenId: string) => void;
  addScreen: (name: string) => string;
  removeScreen: (screenId: string) => void;
  renameScreen: (screenId: string, name: string) => void;
  setStartScreen: (screenId: string) => void;
  getActiveScreen: () => Screen | null;

  addVariable: (variable: GlobalVariable) => void;
  removeVariable: (name: string) => void;
  updateVariable: (name: string, updates: Partial<GlobalVariable>) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  filePath: null,
  isDirty: false,
  activeScreenId: null,

  createProject: (overrides) => {
    const project = createDefaultProject(overrides);
    set({
      project,
      filePath: null,
      isDirty: false,
      activeScreenId: project.screens[0]?.id ?? null,
    });
  },

  loadProject: (project, filePath) => {
    set({
      project,
      filePath,
      isDirty: false,
      activeScreenId: project.screens.find(s => s.isStartScreen)?.id ?? project.screens[0]?.id ?? null,
    });
  },

  setFilePath: (path) => set({ filePath: path }),
  markDirty: () => set({ isDirty: true }),
  markClean: () => set((state) => ({
    isDirty: false,
    project: state.project ? { ...state.project, modifiedAt: new Date().toISOString() } : null,
  })),
  closeProject: () => set({ project: null, filePath: null, isDirty: false, activeScreenId: null }),

  updateProjectInfo: (updates) => set((state) => {
    if (!state.project) return state;
    return {
      project: { ...state.project, ...updates },
      isDirty: true,
    };
  }),

  setActiveScreen: (screenId) => set({ activeScreenId: screenId }),

  addScreen: (name) => {
    const id = crypto.randomUUID();
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          screens: [...state.project.screens, {
            id,
            name,
            isStartScreen: false,
            uiElements: [],
          }],
        },
        activeScreenId: id,
        isDirty: true,
      };
    });
    return id;
  },

  removeScreen: (screenId) => set((state) => {
    if (!state.project || state.project.screens.length <= 1) return state;
    const screens = state.project.screens.filter(s => s.id !== screenId);
    if (!screens.some(s => s.isStartScreen) && screens.length > 0) {
      screens[0].isStartScreen = true;
    }
    const newActiveId = state.activeScreenId === screenId
      ? screens[0]?.id ?? null
      : state.activeScreenId;
    return {
      project: { ...state.project, screens },
      activeScreenId: newActiveId,
      isDirty: true,
    };
  }),

  renameScreen: (screenId, name) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        screens: state.project.screens.map(s => s.id === screenId ? { ...s, name } : s),
      },
      isDirty: true,
    };
  }),

  setStartScreen: (screenId) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        screens: state.project.screens.map(s => ({ ...s, isStartScreen: s.id === screenId })),
      },
      isDirty: true,
    };
  }),

  getActiveScreen: () => {
    const { project, activeScreenId } = get();
    if (!project || !activeScreenId) return null;
    return project.screens.find(s => s.id === activeScreenId) ?? null;
  },

  addVariable: (variable) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        variables: [...state.project.variables, variable],
      },
      isDirty: true,
    };
  }),

  removeVariable: (name) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        variables: state.project.variables.filter(v => v.name !== name),
      },
      isDirty: true,
    };
  }),

  updateVariable: (name, updates) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        variables: state.project.variables.map(v => v.name === name ? { ...v, ...updates } : v),
      },
      isDirty: true,
    };
  }),
}));
