import * as Blockly from 'blockly';
import { useProjectStore } from '../../stores/projectStore';
import { UI_ELEMENT_COLORS_NAMES, UI_ELEMENT_PROPS_NAMES, UI_ELEMENT_WITH_TEXT, UIElement, UIElementType } from '@/models/UIElement';
import { FieldColour } from '@blockly/field-colour';
import { CC_COLORS } from '@/models/CCColors';
import { Abstract } from 'node_modules/blockly/core/events/events_abstract';

export const SIDES: [string, string][] = [
  ['left', 'left'],
  ['right', 'right'],
  ['top', 'top'],
  ['bottom', 'bottom'],
  ['front', 'front'],
  ['back', 'back'],
];

export const ALIGNS: [string, string][] = [
  ['start', 'start'],
  ['center', 'center'],
  ['end', 'end'],
  ['space between', 'space-between'],
];

export const TEXT_ALIGNS: [string, string][] = [
  ['left', 'left'],
  ['center', 'center'],
  ['right', 'right']
];


export class FieldCCColor extends FieldColour {
  protected override updateSize_(margin?: number) {
    super.updateSize_(margin);
    const constants = this.getConstants();
    if (!constants) return;
    this.size_.height = constants.FIELD_TEXT_HEIGHT;
    this.positionBorderRect_();
  }
}

export function createColorField() {
  return new FieldCCColor(CC_COLORS.white.hex, undefined, {
    colourOptions: Object.values(CC_COLORS).map(c => c.hex),
    colourTitles: Object.keys(CC_COLORS),
    columns: 4,
    primaryColour: "#1e1e2e",
  });
}

export function SCREENS(): [string, string][] {
  const project = useProjectStore.getState().project;
  if (!project || project.screens.length === 0) {
    return [['(no screens)', '']];
  }
  return project.screens.map((s) => [s.name, s.name]);
}

export function ELEMENTS(elementType: UIElementType[] | UIElementType | "any" = "any", filters: (value: UIElement) => boolean = () => true): [string, string][] {
  const store = useProjectStore.getState();
  const screen = store.getActiveScreen();
  if (!screen) return [['(no elements)', '']];
  const elements = screen.uiElements.filter((el) => {
    if (Array.isArray(elementType)) {
      return elementType.includes(el.type) && filters(el);
    }
    return (elementType === "any" || el.type === elementType) && filters(el);
  });
  if (elements.length === 0) return [[`(no ${(elementType === "any" || Array.isArray(elementType)) ? "element" : elementType}s)`, '']];
  return elements.map((el) => [el.name, el.name]);
}

export function ELEMENT_COLOR_PROPS(elementName: string): [string, string][] {
  const screen = useProjectStore.getState().getActiveScreen();
  if (!screen) return [['', '']];
  const element = screen.uiElements.find((el) => el.name === elementName);
  if (!element) return [['', '']];
  return Object.keys(element)
    .filter((key) => Object.keys(UI_ELEMENT_COLORS_NAMES).includes(key as keyof UIElement))
    .map((key) => [UI_ELEMENT_COLORS_NAMES[key as keyof typeof UI_ELEMENT_COLORS_NAMES].replace(/\ /g, '') + "Color", key]);
}

export function ELEMENT_PROPS(elementName: string): [string, string][] {
  const screen = useProjectStore.getState().getActiveScreen();
  if (!screen) return [['', '']];
  const element = screen.uiElements.find((el) => el.name === elementName);
  if (!element) return [['', '']];
  return Object.keys(element)
    .filter((key) => Object.keys(UI_ELEMENT_PROPS_NAMES).includes(key as keyof UIElement))
    .map((key) => [UI_ELEMENT_PROPS_NAMES[key as keyof typeof UI_ELEMENT_PROPS_NAMES].replace(/\ /g, ''), key]);
}

export function valueToType(value: any) {
  if (typeof value === 'boolean') return 'Boolean';
  if (typeof value === 'number') return 'Number';
  if (typeof value !== 'string') return null;
  if (value in CC_COLORS) return 'Color';
  if ([...ALIGNS, ...TEXT_ALIGNS].map(v => v[0]).includes(value)) return 'Align';
  return 'String';
}