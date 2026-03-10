import { create } from 'zustand';
import { UIElement, UIElementType, UI_ELEMENT_DEFAULTS } from '../models/UIElement';
import { useProjectStore } from './projectStore';
import { generateId, generateElementName } from '../utils/idGenerator';

interface UIElementState {
  addElement: (screenId: string, type: UIElementType, overrides?: Partial<UIElement>) => UIElement;
  removeElement: (screenId: string, elementId: string) => void;
  updateElement: (screenId: string, elementId: string, updates: Partial<UIElement>) => void;
  duplicateElement: (screenId: string, elementId: string) => UIElement | null;
  moveElement: (screenId: string, elementId: string, x: number, y: number) => void;
  resizeElement: (screenId: string, elementId: string, width: number, height: number) => void;
  reorderElement: (screenId: string, elementId: string, newZIndex: number) => void;
  getElements: (screenId: string) => UIElement[];
  getElementById: (screenId: string, elementId: string) => UIElement | undefined;
}

export const useUIElementStore = create<UIElementState>((_set, _get) => ({
  addElement: (screenId, type, overrides = {}) => {
    const projectStore = useProjectStore.getState();
    const screen = projectStore.project?.screens.find(s => s.id === screenId);
    if (!screen) throw new Error(`Screen ${screenId} not found`);

    const existingNames = screen.uiElements.map(e => e.name);
    const defaults = UI_ELEMENT_DEFAULTS[type];

    const element = {
      ...defaults,
      ...overrides,
      id: overrides.id || generateId(),
      name: overrides.name || generateElementName(type, existingNames),
      zIndex: overrides.zIndex ?? 0,
    } as UIElement;

    const screens = projectStore.project!.screens.map(s => {
      if (s.id !== screenId) return s;
      return { ...s, uiElements: [...s.uiElements, element] };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));

    return element;
  },

  removeElement: (screenId, elementId) => {
    const projectStore = useProjectStore.getState();
    if (!projectStore.project) return;

    const screens = projectStore.project.screens.map(s => {
      if (s.id !== screenId) return s;
      return { ...s, uiElements: s.uiElements.filter(e => e.id !== elementId) };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));
  },

  updateElement: (screenId, elementId, updates) => {
    const projectStore = useProjectStore.getState();
    if (!projectStore.project) return;

    const screens = projectStore.project.screens.map(s => {
      if (s.id !== screenId) return s;
      return {
        ...s,
        uiElements: s.uiElements.map(e =>
          e.id === elementId ? { ...e, ...updates } as UIElement : e
        ),
      };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));
  },

  duplicateElement: (screenId, elementId) => {
    const projectStore = useProjectStore.getState();
    const screen = projectStore.project?.screens.find(s => s.id === screenId);
    const original = screen?.uiElements.find(e => e.id === elementId);
    if (!screen || !original) return null;

    const existingNames = screen.uiElements.map(e => e.name);

    const duplicate = {
      ...original,
      id: generateId(),
      name: generateElementName(original.type, existingNames),
      x: original.x + 2,
      y: original.y + 1,
      zIndex: 0,
    } as UIElement;

    const screens = projectStore.project!.screens.map(s => {
      if (s.id !== screenId) return s;
      return { ...s, uiElements: [...s.uiElements, duplicate] };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));

    return duplicate;
  },

  moveElement: (screenId, elementId, x, y) => {
    const projectStore = useProjectStore.getState();
    if (!projectStore.project) return;

    const screens = projectStore.project.screens.map(s => {
      if (s.id !== screenId) return s;
      return {
        ...s,
        uiElements: s.uiElements.map(e =>
          e.id === elementId ? { ...e, x: Math.max(1, Math.round(x)), y: Math.max(1, Math.round(y)) } as UIElement : e
        ),
      };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));
  },

  resizeElement: (screenId, elementId, width, height) => {
    const projectStore = useProjectStore.getState();
    if (!projectStore.project) return;

    const screens = projectStore.project.screens.map(s => {
      if (s.id !== screenId) return s;
      return {
        ...s,
        uiElements: s.uiElements.map(e =>
          e.id === elementId ? { ...e, width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) } as UIElement : e
        ),
      };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));
  },

  reorderElement: (screenId, elementId, newZIndex) => {
    const projectStore = useProjectStore.getState();
    if (!projectStore.project) return;

    const screens = projectStore.project.screens.map(s => {
      if (s.id !== screenId) return s;
      return {
        ...s,
        uiElements: s.uiElements.map(e =>
          e.id === elementId ? { ...e, zIndex: newZIndex } as UIElement : e
        ),
      };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));
  },

  getElements: (screenId) => {
    const project = useProjectStore.getState().project;
    const screen = project?.screens.find(s => s.id === screenId);
    return screen?.uiElements ?? [];
  },

  getElementById: (screenId, elementId) => {
    const project = useProjectStore.getState().project;
    const screen = project?.screens.find(s => s.id === screenId);
    return screen?.uiElements.find(e => e.id === elementId);
  },
}));
