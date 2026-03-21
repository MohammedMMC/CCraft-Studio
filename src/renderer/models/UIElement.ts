import { CCColor } from './CCColors';

export type SizeUnit = 'px' | '%' | 'fill';
export type ContainerDisplay = 'flex' | 'grid';
export type FlexDirection = 'row' | 'column';
export type AlignItems = 'start' | 'center' | 'end';
export type JustifyContent = 'start' | 'center' | 'end' | 'space-between';

export interface BaseElement {
  id: string;
  type: UIElementType;
  name: string;
  parentId: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  widthUnit: SizeUnit;
  heightUnit: SizeUnit;
  bgColor: CCColor;
  visible: boolean;
  zIndex: number;
}

export type UIElementType =
  | 'label'
  | 'button'
  | 'container'
  | 'panel'
  | 'progressbar'
  | 'slider'
  | 'checkbox';

export interface LabelElement extends BaseElement {
  type: 'label';
  text: string;
  textAlign: 'left' | 'center' | 'right';
  fgColor: CCColor;
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  text: string;
  textAlign: 'left' | 'center' | 'right';
  focusBgColor: CCColor;
  focusTextColor: CCColor;
  fgColor: CCColor;
}

export interface ContainerElement extends BaseElement {
  type: 'container';
  display: ContainerDisplay;
  flexDirection: FlexDirection;
  gap: number;
  gapUnit: 'px' | '%';
  alignItems: AlignItems;
  justifyContent: JustifyContent;
  gridTemplateCols: number;
  gridTemplateRows: number;
  padding: number;
  paddingUnit: 'px' | '%';
  fgColor: CCColor;
}

export interface PanelElement extends BaseElement {
  type: 'panel';
  text: string;
  textAlign: 'left' | 'center' | 'right';
  borderColor: CCColor;
  titleBgColor: CCColor;
  display: ContainerDisplay;
  flexDirection: FlexDirection;
  gap: number;
  gapUnit: 'px' | '%';
  alignItems: AlignItems;
  justifyContent: JustifyContent;
  gridTemplateCols: number;
  gridTemplateRows: number;
  padding: number;
  paddingUnit: 'px' | '%';
  fgColor: CCColor;
}

export interface ProgressBarElement extends BaseElement {
  type: 'progressbar';
  text: string;
  textAlign: 'left' | 'center' | 'right';
  progressColor: CCColor;
  progress: number;
  fgColor: CCColor;
}

export interface SliderElement extends BaseElement {
  type: 'slider';
  handleColor: CCColor,
  filledColor: CCColor,
  to: number,
  from: number,
  value: number,
  orientation: 'hltr' | 'hrtl' | 'vttb' | 'vbtt',
}

export interface CheckboxElement extends BaseElement {
  type: 'checkbox';
  text: string;
  textColor: CCColor;
  boxColor: CCColor;
  checkColor: CCColor;
  checkIcon: string;
  checked: boolean;
  textAlign: 'left' | 'center' | 'right';
}

export type UIElement =
  | LabelElement
  | ButtonElement
  | ContainerElement
  | PanelElement
  | ProgressBarElement
  | SliderElement
  | CheckboxElement;

type OmitBase<T> = T extends UIElement ? Omit<T, 'id' | 'name' | 'zIndex'> : never;
type UIElementDefaults = { [K in UIElementType]: OmitBase<Extract<UIElement, { type: K }>> };

export const UI_ELEMENT_DEFAULTS: UIElementDefaults = {
  label: {
    type: 'label',
    parentId: null,
    x: 1, y: 1, width: 10, height: 1,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'black',
    visible: true, text: 'Label', textAlign: 'left',
  },
  button: {
    type: 'button',
    parentId: null,
    x: 1, y: 1, width: 10, height: 3,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'gray',
    visible: true, text: 'Button', textAlign: 'center',
    focusBgColor: 'lightGray', focusTextColor: 'white',
  },
  container: {
    type: 'container',
    parentId: null,
    x: 1, y: 1, width: 20, height: 10,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'gray',
    visible: true,
    display: 'flex',
    flexDirection: 'column',
    gap: 0, gapUnit: 'px',
    alignItems: 'start',
    justifyContent: 'start',
    gridTemplateCols: 2, gridTemplateRows: 2,
    padding: 0, paddingUnit: 'px',
  },
  panel: {
    type: 'panel',
    parentId: null,
    x: 1, y: 1, width: 20, height: 10,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'gray',
    visible: true,
    text: 'Panel',
    textAlign: 'left',
    borderColor: 'lightGray',
    titleBgColor: 'gray',
    display: 'flex',
    flexDirection: 'column',
    gap: 0, gapUnit: 'px',
    alignItems: 'start',
    justifyContent: 'start',
    gridTemplateCols: 2, gridTemplateRows: 2,
    padding: 0, paddingUnit: 'px',
  },
  progressbar: {
    type: 'progressbar',
    x: 1, y: 1, width: 20, height: 3,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'gray',
    visible: true,
    text: 'Progress Bar',
    textAlign: 'center',
    progressColor: 'lightGray',
    progress: 50,
    parentId: null,
  },
  slider: {
    type: 'slider',
    x: 1, y: 1, width: 20, height: 1,
    widthUnit: 'px', heightUnit: 'px',
    bgColor: 'gray',
    handleColor: 'white',
    filledColor: 'lightGray',
    visible: true,
    from: 0,
    to: 100,
    value: 50,
    orientation: 'hltr',
    parentId: null,
  },
  checkbox: {
    type: 'checkbox',
    x: 1, y: 1, width: 10, height: 1,
    widthUnit: 'px', heightUnit: 'px',
    bgColor: 'black', textColor: 'white',
    text: 'CheckBox',
    boxColor: 'gray', checkColor: 'white',
    checkIcon: 'x',
    textAlign: 'left',
    checked: false,
    visible: true, parentId: null,
  }
};

export const UI_ELEMENT_LABELS: Record<UIElementType, { label: string; icon: string; description: string }> = {
  label: { label: 'Label', icon: 'T', description: 'Display Text' },
  button: { label: 'Button', icon: 'B', description: 'Clickable Button' },
  container: { label: 'Container', icon: 'C', description: 'Group Elements' },
  panel: { label: 'Panel', icon: 'P', description: 'Titled Container' },
  progressbar: { label: 'Progress Bar', icon: 'G', description: 'Show Progress' },
  slider: { label: 'Slider', icon: 'S', description: 'Value Control' },
  checkbox: { label: 'CheckBox', icon: 'X', description: 'Toggle Option' },
};

/**
 * Resolve an element's width/height to actual character cells given the reference dimensions.
 */
export function resolveSize(
  el: UIElement,
  refWidth: number,
  refHeight: number,
): { width: number; height: number } {
  let w = el.width;
  let h = el.height;

  if (el.widthUnit === 'fill') {
    w = refWidth;
  } else if (el.widthUnit === '%') {
    w = Math.max(1, Math.round((el.width / 100) * refWidth));
  }

  if (el.heightUnit === 'fill') {
    h = refHeight;
  } else if (el.heightUnit === '%') {
    h = Math.max(1, Math.round((el.height / 100) * refHeight));
  }

  return { width: w, height: h };
}

// ── Container Layout Engine ────────────────────────────────────────

export interface ResolvedChildPosition {
  id: string;
  x: number;   // absolute 1-based screen column
  y: number;   // absolute 1-based screen row
  width: number;
  height: number;
}

/**
 * Resolve absolute screen positions for all children inside a container.
 */
/** Type guard: is this element a container-like type (container or panel)? */
export function isContainerLike(el: UIElement): el is ContainerElement | PanelElement {
  return el.type === 'container' || el.type === 'panel';
}

export function resolveContainerLayout(
  container: ContainerElement | PanelElement,
  children: UIElement[],
  containerX: number,
  containerY: number,
  containerWidth: number,
  containerHeight: number,
  displayWidth: number,
  displayHeight: number,
): ResolvedChildPosition[] {
  // Panel border acts as 1-char inset on all sides
  const borderInset = container.type === 'panel' ? 1 : 0;
  const bx = containerX + borderInset;
  const by = containerY + borderInset;
  const bw = Math.max(1, containerWidth - borderInset * 2);
  const bh = Math.max(1, containerHeight - borderInset * 2);

  // Resolve padding (applied inside the border)
  let pad = container.padding;
  if (container.paddingUnit === '%') {
    const ref = Math.min(bw, bh);
    pad = Math.max(0, Math.round((container.padding / 100) * ref));
  }
  const innerX = bx + pad;
  const innerY = by + pad;
  const innerW = Math.max(1, bw - pad * 2);
  const innerH = Math.max(1, bh - pad * 2);

  // Resolve gap
  let gap = container.gap;
  if (container.gapUnit === '%') {
    const ref = container.display === 'flex' && container.flexDirection === 'row' ? innerW : innerH;
    gap = Math.max(0, Math.round((container.gap / 100) * ref));
  }

  // Resolve each child's size relative to the container inner area
  const childSizes = children.map(child => resolveSize(child, innerW, innerH));

  if (container.display === 'grid') {
    return resolveGridLayout(container, children, childSizes, innerX, innerY, innerW, innerH, gap);
  }
  return resolveFlexLayout(container, children, childSizes, innerX, innerY, innerW, innerH, gap);
}

function resolveFlexLayout(
  container: ContainerElement | PanelElement,
  children: UIElement[],
  childSizes: { width: number; height: number }[],
  innerX: number, innerY: number,
  innerW: number, innerH: number,
  gap: number,
): ResolvedChildPosition[] {
  const isRow = container.flexDirection === 'row';
  const results: ResolvedChildPosition[] = [];

  const mainSpace = isRow ? innerW : innerH;
  const crossSpace = isRow ? innerH : innerW;
  const totalGap = gap * Math.max(0, children.length - 1);

  // Shrink children proportionally if they overflow the main axis
  const totalChildMain = childSizes.reduce(
    (sum, s) => sum + (isRow ? s.width : s.height), 0
  );
  if (totalChildMain > 0 && totalChildMain + totalGap > mainSpace) {
    const availableForChildren = Math.max(children.length, mainSpace - totalGap);
    const ratio = availableForChildren / totalChildMain;
    for (const s of childSizes) {
      if (isRow) {
        s.width = Math.max(1, Math.floor(s.width * ratio));
      } else {
        s.height = Math.max(1, Math.floor(s.height * ratio));
      }
    }
  }

  const totalMain = childSizes.reduce(
    (sum, s) => sum + (isRow ? s.width : s.height), 0
  ) + totalGap;

  let mainOffset = 0;
  let spaceBetween = gap;

  switch (container.justifyContent) {
    case 'center':
      mainOffset = Math.floor((mainSpace - totalMain) / 2);
      break;
    case 'end':
      mainOffset = mainSpace - totalMain;
      break;
    case 'space-between':
      if (children.length > 1) {
        const childMainSum = childSizes.reduce((s, c) => s + (isRow ? c.width : c.height), 0);
        spaceBetween = Math.floor((mainSpace - childMainSum) / Math.max(1, children.length - 1));
      }
      mainOffset = 0;
      break;
    default: // 'start'
      mainOffset = 0;
  }

  let cursor = mainOffset;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const size = childSizes[i];
    const childMain = isRow ? size.width : size.height;
    const childCross = isRow ? size.height : size.width;

    let crossOffset = 0;
    switch (container.alignItems) {
      case 'center':
        crossOffset = Math.floor((crossSpace - childCross) / 2);
        break;
      case 'end':
        crossOffset = crossSpace - childCross;
        break;
      default: // 'start'
        crossOffset = 0;
    }

    const absX = isRow ? innerX + cursor : innerX + crossOffset;
    const absY = isRow ? innerY + crossOffset : innerY + cursor;

    results.push({
      id: child.id,
      x: absX,
      y: absY,
      width: size.width,
      height: size.height,
    });

    cursor += childMain + (container.justifyContent === 'space-between' ? spaceBetween : gap);
  }

  return results;
}

function resolveGridLayout(
  container: ContainerElement | PanelElement,
  children: UIElement[],
  childSizes: { width: number; height: number }[],
  innerX: number, innerY: number,
  innerW: number, innerH: number,
  gap: number,
): ResolvedChildPosition[] {
  const cols = Math.max(1, container.gridTemplateCols);
  const rows = Math.max(1, container.gridTemplateRows);

  const totalGapX = gap * (cols - 1);
  const totalGapY = gap * (rows - 1);
  const cellW = Math.max(1, Math.floor((innerW - totalGapX) / cols));
  const cellH = Math.max(1, Math.floor((innerH - totalGapY) / rows));

  const results: ResolvedChildPosition[] = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const size = childSizes[i];
    const col = i % cols;
    const row = Math.floor(i / cols);

    if (row >= rows) break;

    const cellX = innerX + col * (cellW + gap);
    const cellY = innerY + row * (cellH + gap);

    const w = Math.min(size.width, cellW);
    const h = Math.min(size.height, cellH);

    results.push({
      id: child.id,
      x: cellX + Math.floor((cellW - w) / 2),
      y: cellY + Math.floor((cellH - h) / 2),
      width: w,
      height: h,
    });
  }

  return results;
}
