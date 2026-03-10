import { CCColor } from './CCColors';

export interface BaseElement {
  id: string;
  type: UIElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fgColor: CCColor;
  bgColor: CCColor;
  visible: boolean;
  zIndex: number;
}

export type UIElementType =
  | 'label'
  | 'button';

export interface LabelElement extends BaseElement {
  type: 'label';
  text: string;
  textAlign: 'left' | 'center' | 'right';
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  text: string;
  textAlign: 'left' | 'center' | 'right';
  hoverBgColor: CCColor;
  hoverFgColor: CCColor;
}

export type UIElement =
  | LabelElement
  | ButtonElement;

type OmitBase<T> = T extends UIElement ? Omit<T, 'id' | 'name' | 'zIndex'> : never;
type UIElementDefaults = { [K in UIElementType]: OmitBase<Extract<UIElement, { type: K }>> };

export const UI_ELEMENT_DEFAULTS: UIElementDefaults = {
  label: {
    type: 'label',
    x: 1, y: 1, width: 10, height: 1,
    fgColor: 'white', bgColor: 'black',
    visible: true, text: 'Label', textAlign: 'left',
  },
  button: {
    type: 'button',
    x: 1, y: 1, width: 10, height: 3,
    fgColor: 'white', bgColor: 'gray',
    visible: true, text: 'Button', textAlign: 'center',
    hoverBgColor: 'lightGray', hoverFgColor: 'white',
  },
};

export const UI_ELEMENT_LABELS: Record<UIElementType, { label: string; icon: string; description: string }> = {
  label:       { label: 'Label',        icon: 'T',  description: 'Static text display' },
  button:      { label: 'Button',       icon: 'B',  description: 'Clickable button with text' },
};
