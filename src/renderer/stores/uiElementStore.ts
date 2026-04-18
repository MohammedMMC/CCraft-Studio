import { create } from 'zustand';
import { UIElement, UIElementType, UI_ELEMENT_DEFAULTS } from '../models/UIElement';
import { useProjectStore } from './projectStore';
import { generateId, generateElementName } from '../utils/idGenerator';

interface UIElementState {
  addElement: (screenId: string, type: UIElementType, overrides?: Partial<UIElement>) => UIElement;
  removeElement: (screenId: string, elementId: string) => UIElement[];
  restoreElements: (screenId: string, elements: UIElement[]) => void;
  updateElement: (screenId: string, elementId: string, updates: Partial<UIElement>) => void;
  duplicateElement: (screenId: string, elementId: string) => UIElement | null;
  moveElement: (screenId: string, elementId: string, x: number, y: number) => void;
  resizeElement: (screenId: string, elementId: string, width: number, height: number) => void;
  reorderElement: (screenId: string, elementId: string, newZIndex: number) => void;
  setParent: (screenId: string, elementId: string, parentId: string | null) => void;
  getElements: (screenId: string) => UIElement[];
  getElementById: (screenId: string, elementId: string) => UIElement | undefined;
  getChildren: (screenId: string, parentId: string) => UIElement[];
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
      parentId: (overrides as any).parentId ?? null,
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
    const screen = projectStore.project?.screens.find(s => s.id === screenId);
    if (!projectStore.project || !screen) return [];

    if (!screen.uiElements.some(e => e.id === elementId)) return [];

    const childrenByParent = new Map<string, string[]>();
    for (const el of screen.uiElements) {
      if (!el.parentId) continue;
      const arr = childrenByParent.get(el.parentId) || [];
      arr.push(el.id);
      childrenByParent.set(el.parentId, arr);
    }

    const idsToDelete = new Set<string>();
    const stack: string[] = [elementId];

    while (stack.length > 0) {
      const currentId = stack.pop() as string;
      if (idsToDelete.has(currentId)) continue;
      idsToDelete.add(currentId);
      const children = childrenByParent.get(currentId) || [];
      stack.push(...children);
    }

    const deletedElements = screen.uiElements
      .filter(e => idsToDelete.has(e.id))
      .map(e => ({ ...e })) as UIElement[];

    const screens = projectStore.project.screens.map(s => {
      if (s.id !== screenId) return s;
      return {
        ...s,
        uiElements: s.uiElements.filter(e => !idsToDelete.has(e.id)),
      };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));

    return deletedElements;
  },

  restoreElements: (screenId, elements) => {
    const projectStore = useProjectStore.getState();
    if (!projectStore.project || elements.length === 0) return;

    const screens = projectStore.project.screens.map(s => {
      if (s.id !== screenId) return s;
      const existingIds = new Set(s.uiElements.map(e => e.id));
      const toRestore = elements
        .filter(e => !existingIds.has(e.id))
        .map(e => ({ ...e })) as UIElement[];
      return {
        ...s,
        uiElements: [...s.uiElements, ...toRestore],
      };
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

    const childrenByParent = new Map<string, UIElement[]>();
    for (const el of screen.uiElements) {
      if (!el.parentId) continue;
      const arr = childrenByParent.get(el.parentId) || [];
      arr.push(el);
      childrenByParent.set(el.parentId, arr);
    }

    const usedNames = screen.uiElements.map(e => e.name);
    const idMap = new Map<string, string>();
    const clones: UIElement[] = [];
    const queue: UIElement[] = [original];

    while (queue.length > 0) {
      const src = queue.shift() as UIElement;
      const newId = generateId();
      idMap.set(src.id, newId);

      const mappedParentId =
        src.id === original.id
          ? src.parentId
          : src.parentId
            ? (idMap.get(src.parentId) ?? src.parentId)
            : null;

      const clone = {
        ...src,
        parentId: mappedParentId,
        id: newId,
        name: generateElementName(src.type, usedNames),
        ...(src.id === original.id ? { x: src.x + 2, y: src.y + 1, zIndex: 0 } : {}),
      } as UIElement;


      clones.push(clone);
      usedNames.push(clone.name);

      const children = childrenByParent.get(src.id) || [];
      queue.push(...children);
    }

    const screens = projectStore.project!.screens.map((s) => {
      if (s.id !== screenId) return s;
      return { ...s, uiElements: [...s.uiElements, ...clones] };
    });

    useProjectStore.setState((state) => ({
      project: state.project ? { ...state.project, screens } : null,
      isDirty: true,
    }));

    return clones[0] ?? null;
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

  setParent: (screenId, elementId, parentId) => {
    const projectStore = useProjectStore.getState();
    if (!projectStore.project) return;

    const screens = projectStore.project.screens.map(s => {
      if (s.id !== screenId) return s;

      if (parentId !== null) {
        const parent = s.uiElements.find(e => e.id === parentId);
        if (!parent || (parent.type !== 'container' && parent.type !== 'panel')) return s;
        let ancestor: string | null = parentId;
        while (ancestor !== null) {
          if (ancestor === elementId) return s;
          const a = s.uiElements.find(e => e.id === ancestor);
          ancestor = a?.parentId ?? null;
        }
      }

      return {
        ...s,
        uiElements: s.uiElements.map(e =>
          e.id === elementId ? { ...e, parentId } as UIElement : e
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

  getChildren: (screenId, parentId) => {
    const project = useProjectStore.getState().project;
    const screen = project?.screens.find(s => s.id === screenId);
    return screen?.uiElements.filter(e => e.parentId === parentId) ?? [];
  },
}));
