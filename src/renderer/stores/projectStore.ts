import { create } from 'zustand';
import { CCProject, Screen, GlobalVariable, createDefaultProject, DeviceType } from '../models/Project';
import { CCColor } from '@/models/CCColors';

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

  updateProjectInfo: (updates: Partial<Pick<CCProject, 'name' | 'author' | 'description' | 'device' | 'displayWidth' | 'displayHeight' | 'colorMode' | 'customMonitors'>>) => void;

  setActiveScreen: (screenId: string) => void;
  addScreen: (name: string) => string;
  removeScreen: (screenId: string) => void;
  renameScreen: (screenId: string, name: string) => void;
  changeProjectInfo: (newName: string | undefined, newAuthor: string | undefined, newDescription: string | undefined) => void;
  setWorkingScreen: (screenId: string, isActivated: boolean) => void;
  getActiveScreen: () => Screen | null;
  changeScreenBgColor: (screenId: string, color: CCColor) => void;
  setScreenDisplayType: (screenId: string, displayType: Screen['displayType']) => void;
  setMonitorsSize: (screenId: string, widthSize: number | null, heightSize: number | null) => void;
  setMonitorsUnit: (screenId: string, widthUnit: Screen['monitorsWidthUnit'] | null, heightUnit: Screen['monitorsHeightUnit'] | null) => void;

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
      activeScreenId: project.screens.find(s => s.isWorkingScreen)?.id ?? project.screens[0]?.id ?? null,
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
            isWorkingScreen: false,
            displayType: 'any',
            monitorsWidthSize: 5,
            monitorsHeightSize: 3,
            monitorsWidthUnit: '=',
            monitorsHeightUnit: '=',
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
    if (!screens.some(s => s.isWorkingScreen) && screens.length > 0) {
      screens[0].isWorkingScreen = true;
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

  changeProjectInfo: (newName, newAuthor, newDescription) => set((state) => {
    if (!state.project) return state;
    return {
      project: { ...state.project, name: newName ?? state.project.name, author: newAuthor ?? state.project.author, description: newDescription ?? state.project.description },
      isDirty: true,
    };
  }),

  setWorkingScreen: (screenId, isActivated) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        screens: state.project.screens.map(s => ({ ...s, isWorkingScreen: s.id === screenId ? isActivated : s.isWorkingScreen })),
      },
      isDirty: true,
    };
  }),

  setScreenDisplayType: (screenId, displayType) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        screens: state.project.screens.map(s => s.id === screenId ? { ...s, displayType } : s),
      },
      isDirty: true,
    };
  }),

  setMonitorsSize: (screenId, widthSize, heightSize) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        screens: state.project.screens.map(s => s.id === screenId ? { ...s, monitorsWidthSize: widthSize ?? s.monitorsWidthSize, monitorsHeightSize: heightSize ?? s.monitorsHeightSize } : s),
      },
      isDirty: true,
    };
  }),

  setMonitorsUnit: (screenId, widthUnit, heightUnit) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        screens: state.project.screens.map(s => s.id === screenId ? { ...s, monitorsWidthUnit: widthUnit ?? s.monitorsWidthUnit, monitorsHeightUnit: heightUnit ?? s.monitorsHeightUnit } : s),
      },
      isDirty: true,
    };
  }),

  getActiveScreen: () => {
    const { project, activeScreenId } = get();
    if (!project || !activeScreenId) return null;
    return project.screens.find(s => s.id === activeScreenId) ?? null;
  },

  changeScreenBgColor: (screenId, color) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        screens: state.project.screens.map(s => s.id === screenId ? { ...s, bgColor: color } : s),
      },
      isDirty: true,
    };
  }),

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
