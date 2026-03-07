import { CCColor } from './CCColors';

export type AnchorMode = 'fixed' | 'left' | 'right' | 'center' | 'stretch';
export type AnchorModeV = 'fixed' | 'top' | 'bottom' | 'center' | 'stretch';

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
  // Responsive anchoring
  anchorH: AnchorMode;    // horizontal anchor relative to screen width
  anchorV: AnchorModeV;   // vertical anchor relative to screen height
  marginLeft: number;     // margin from left edge (for stretch/left)
  marginRight: number;    // margin from right edge (for stretch/right)
  marginTop: number;      // margin from top edge (for stretch/top)
  marginBottom: number;   // margin from bottom edge (for stretch/bottom)
}

export type UIElementType =
  | 'label'
  | 'button'
  | 'textInput'
  | 'progressBar'
  | 'list'
  | 'panel'
  | 'image'
  | 'statusBar'
  | 'scrollView'
  | 'tabBar'
  | 'divider'
  | 'checkbox'
  | 'dropdown';

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

export interface TextInputElement extends BaseElement {
  type: 'textInput';
  placeholder: string;
  defaultValue: string;
  maxLength: number;
  cursorColor: CCColor;
}

export interface ProgressBarElement extends BaseElement {
  type: 'progressBar';
  value: number;
  maxValue: number;
  fillColor: CCColor;
  emptyColor: CCColor;
  showPercentage: boolean;
  fillChar: string;
  emptyChar: string;
}

export interface ListElement extends BaseElement {
  type: 'list';
  items: string[];
  selectedIndex: number;
  scrollOffset: number;
  selectedBgColor: CCColor;
  selectedFgColor: CCColor;
  showScrollbar: boolean;
}

export interface PanelElement extends BaseElement {
  type: 'panel';
  title: string;
  borderStyle: 'none' | 'single' | 'double' | 'rounded';
  borderColor: CCColor;
  filled: boolean;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  nfpData: string;
}

export interface StatusBarElement extends BaseElement {
  type: 'statusBar';
  text: string;
  textAlign: 'left' | 'center' | 'right';
  position: 'top' | 'bottom';
}

export interface ScrollViewElement extends BaseElement {
  type: 'scrollView';
  contentHeight: number;  // total content height (can be > height)
  scrollOffset: number;
  showScrollbar: boolean;
  borderStyle: 'none' | 'single';
  borderColor: CCColor;
}

export interface TabBarElement extends BaseElement {
  type: 'tabBar';
  tabs: string[];
  activeTab: number;
  activeBgColor: CCColor;
  activeFgColor: CCColor;
  inactiveBgColor: CCColor;
  inactiveFgColor: CCColor;
  position: 'top' | 'bottom';
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  orientation: 'horizontal' | 'vertical';
  style: 'thin' | 'thick' | 'dashed' | 'double';
  dividerColor: CCColor;
}

export interface CheckboxElement extends BaseElement {
  type: 'checkbox';
  text: string;
  checked: boolean;
  checkedChar: string;
  uncheckedChar: string;
  checkColor: CCColor;
}

export interface DropdownElement extends BaseElement {
  type: 'dropdown';
  items: string[];
  selectedIndex: number;
  expanded: boolean;
  maxVisibleItems: number;
  dropdownBgColor: CCColor;
  dropdownFgColor: CCColor;
  selectedBgColor: CCColor;
  selectedFgColor: CCColor;
}

export type UIElement =
  | LabelElement
  | ButtonElement
  | TextInputElement
  | ProgressBarElement
  | ListElement
  | PanelElement
  | ImageElement
  | StatusBarElement
  | ScrollViewElement
  | TabBarElement
  | DividerElement
  | CheckboxElement
  | DropdownElement;

type OmitBase<T> = T extends UIElement ? Omit<T, 'id' | 'name' | 'zIndex'> : never;
type UIElementDefaults = { [K in UIElementType]: OmitBase<Extract<UIElement, { type: K }>> };

export const UI_ELEMENT_DEFAULTS: UIElementDefaults = {
  label: {
    type: 'label',
    x: 1, y: 1, width: 10, height: 1,
    fgColor: 'white', bgColor: 'black',
    visible: true, text: 'Label', textAlign: 'left',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  button: {
    type: 'button',
    x: 1, y: 1, width: 10, height: 3,
    fgColor: 'white', bgColor: 'gray',
    visible: true, text: 'Button', textAlign: 'center',
    hoverBgColor: 'lightGray', hoverFgColor: 'white',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  textInput: {
    type: 'textInput',
    x: 1, y: 1, width: 20, height: 1,
    fgColor: 'white', bgColor: 'gray',
    visible: true, placeholder: 'Type here...', defaultValue: '',
    maxLength: 50, cursorColor: 'white',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  progressBar: {
    type: 'progressBar',
    x: 1, y: 1, width: 20, height: 1,
    fgColor: 'white', bgColor: 'black',
    visible: true, value: 50, maxValue: 100,
    fillColor: 'lime', emptyColor: 'gray',
    showPercentage: false, fillChar: '\u2588', emptyChar: '\u2591',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  list: {
    type: 'list',
    x: 1, y: 1, width: 15, height: 5,
    fgColor: 'white', bgColor: 'black',
    visible: true, items: ['Item 1', 'Item 2', 'Item 3'],
    selectedIndex: 0, scrollOffset: 0,
    selectedBgColor: 'blue', selectedFgColor: 'white',
    showScrollbar: true,
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  panel: {
    type: 'panel',
    x: 1, y: 1, width: 20, height: 10,
    fgColor: 'white', bgColor: 'black',
    visible: true, title: '', borderStyle: 'single',
    borderColor: 'white', filled: true,
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  image: {
    type: 'image',
    x: 1, y: 1, width: 10, height: 5,
    fgColor: 'white', bgColor: 'black',
    visible: true, nfpData: '',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  statusBar: {
    type: 'statusBar',
    x: 1, y: 1, width: 51, height: 1,
    fgColor: 'black', bgColor: 'lightGray',
    visible: true, text: 'Status', textAlign: 'left',
    position: 'bottom',
    anchorH: 'stretch', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  scrollView: {
    type: 'scrollView',
    x: 1, y: 1, width: 20, height: 8,
    fgColor: 'white', bgColor: 'black',
    visible: true, contentHeight: 20, scrollOffset: 0,
    showScrollbar: true, borderStyle: 'single', borderColor: 'gray',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  tabBar: {
    type: 'tabBar',
    x: 1, y: 1, width: 30, height: 1,
    fgColor: 'white', bgColor: 'gray',
    visible: true, tabs: ['Tab 1', 'Tab 2', 'Tab 3'], activeTab: 0,
    activeBgColor: 'blue', activeFgColor: 'white',
    inactiveBgColor: 'gray', inactiveFgColor: 'lightGray',
    position: 'top',
    anchorH: 'stretch', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  divider: {
    type: 'divider',
    x: 1, y: 1, width: 20, height: 1,
    fgColor: 'white', bgColor: 'black',
    visible: true, orientation: 'horizontal', style: 'thin',
    dividerColor: 'gray',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  checkbox: {
    type: 'checkbox',
    x: 1, y: 1, width: 15, height: 1,
    fgColor: 'white', bgColor: 'black',
    visible: true, text: 'Option', checked: false,
    checkedChar: '[x]', uncheckedChar: '[ ]',
    checkColor: 'lime',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
  dropdown: {
    type: 'dropdown',
    x: 1, y: 1, width: 15, height: 1,
    fgColor: 'white', bgColor: 'gray',
    visible: true, items: ['Option 1', 'Option 2', 'Option 3'],
    selectedIndex: 0, expanded: false, maxVisibleItems: 5,
    dropdownBgColor: 'black', dropdownFgColor: 'white',
    selectedBgColor: 'blue', selectedFgColor: 'white',
    anchorH: 'fixed', anchorV: 'fixed',
    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
  },
};

export const UI_ELEMENT_LABELS: Record<UIElementType, { label: string; icon: string; description: string }> = {
  label:       { label: 'Label',        icon: 'T',  description: 'Static text display' },
  button:      { label: 'Button',       icon: 'B',  description: 'Clickable button with text' },
  textInput:   { label: 'Text Input',   icon: 'I',  description: 'Editable text field' },
  progressBar: { label: 'Progress Bar', icon: 'P',  description: 'Horizontal progress indicator' },
  list:        { label: 'List',         icon: 'L',  description: 'Scrollable list of items' },
  panel:       { label: 'Panel',        icon: '#',  description: 'Container with optional border' },
  image:       { label: 'Image',        icon: 'M',  description: 'NFP/NFT image display' },
  statusBar:   { label: 'Status Bar',   icon: 'S',  description: 'Top or bottom bar with text' },
  scrollView:  { label: 'Scroll View',  icon: '\u2195', description: 'Scrollable content container' },
  tabBar:      { label: 'Tab Bar',      icon: '\u2261', description: 'Tab navigation strip' },
  divider:     { label: 'Divider',      icon: '\u2500', description: 'Horizontal or vertical separator' },
  checkbox:    { label: 'Checkbox',     icon: '\u2611', description: 'Toggle on/off option' },
  dropdown:    { label: 'Dropdown',     icon: '\u25BC', description: 'Expandable selection menu' },
};
