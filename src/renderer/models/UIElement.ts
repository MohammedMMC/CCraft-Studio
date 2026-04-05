import { CCColor } from './CCColors';

export type SizeUnit = 'px' | '%' | 'fill';
export type SizeConstraintUnit = '=' | '>' | '<';
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
  | 'checkbox'
  | 'input';

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
  orientation: 'hltr' | 'hrtl' | 'vttb' | 'vbtt',
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

export interface InputElement extends BaseElement {
  type: 'input';
  text: string;
  placeholder: string;
  textColor: CCColor;
  placeholderColor: CCColor;
  textAlign: 'left' | 'center' | 'right';
}

export type UIElement =
  | LabelElement
  | ButtonElement
  | ContainerElement
  | PanelElement
  | ProgressBarElement
  | SliderElement
  | CheckboxElement
  | InputElement;

type OmitBase<T> = T extends UIElement ? Omit<T, 'id' | 'name' | 'zIndex'> : never;
type UIElementDefaults = { [K in UIElementType]: OmitBase<Extract<UIElement, { type: K }>> };

export const UI_ELEMENT_DEFAULTS: UIElementDefaults = {
  label: {
    type: 'label',
    x: 1, y: 1, width: 10, height: 1,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'black',
    text: 'Label', textAlign: 'left',
    visible: true, parentId: null,
  },
  button: {
    type: 'button',
    x: 1, y: 1, width: 10, height: 3,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'gray',
    text: 'Button', textAlign: 'center',
    focusBgColor: 'lightGray', focusTextColor: 'white',
    visible: true, parentId: null,
  },
  container: {
    type: 'container',
    x: 1, y: 1, width: 20, height: 10,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'gray',
    display: 'flex',
    flexDirection: 'column',
    gap: 0, gapUnit: 'px',
    alignItems: 'start',
    justifyContent: 'start',
    gridTemplateCols: 2, gridTemplateRows: 2,
    padding: 0, paddingUnit: 'px',
    visible: true, parentId: null,
  },
  panel: {
    type: 'panel',
    x: 1, y: 1, width: 20, height: 10,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'gray',
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
    visible: true, parentId: null,
  },
  progressbar: {
    type: 'progressbar',
    x: 1, y: 1, width: 20, height: 3,
    widthUnit: 'px', heightUnit: 'px',
    fgColor: 'white', bgColor: 'gray',
    text: 'Progress Bar',
    textAlign: 'center',
    progressColor: 'lightGray',
    progress: 50,
    orientation: 'hltr',
    visible: true, parentId: null,
  },
  slider: {
    type: 'slider',
    x: 1, y: 1, width: 20, height: 1,
    widthUnit: 'px', heightUnit: 'px',
    bgColor: 'gray',
    handleColor: 'white',
    filledColor: 'lightGray',
    from: 0,
    to: 100,
    value: 50,
    orientation: 'hltr',
    visible: true, parentId: null,
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
  },
  input: {
    type: 'input',
    x: 1, y: 1, width: 10, height: 1,
    widthUnit: 'px', heightUnit: 'px',
    bgColor: 'black', textColor: 'white',
    text: '',
    placeholder: 'Input',
    placeholderColor: 'gray',
    textAlign: 'left',
    visible: true, parentId: null,
  },
};

export const UI_ELEMENT_LABELS: Record<UIElementType, { label: string; icon: string; description: string }> = {
  label: { label: 'Label', icon: 'T', description: 'Display Text' },
  button: { label: 'Button', icon: 'B', description: 'Clickable Button' },
  container: { label: 'Container', icon: 'C', description: 'Group Elements' },
  panel: { label: 'Panel', icon: 'P', description: 'Titled Container' },
  progressbar: { label: 'Progress Bar', icon: 'G', description: 'Show Progress' },
  slider: { label: 'Slider', icon: 'S', description: 'Value Control' },
  checkbox: { label: 'CheckBox', icon: 'X', description: 'Toggle Option' },
  input: { label: 'Input', icon: 'I', description: 'Text Input' },
};

export function resolveSize(
  el: UIElement,
  refWidth: number,
  refHeight: number,
): { width: number; height: number } {
  let w = el.width;
  let h = el.height;
  const rawWidth = (el as UIElement & { rawWidth?: number }).rawWidth ?? el.width;
  const rawHeight = (el as UIElement & { rawHeight?: number }).rawHeight ?? el.height;

  if (el.widthUnit === 'fill') {
    w = refWidth;
  } else if (el.widthUnit === '%') {
    w = Math.max(1, Math.round((rawWidth / 100) * refWidth));
  }

  if (el.heightUnit === 'fill') {
    h = refHeight;
  } else if (el.heightUnit === '%') {
    h = Math.max(1, Math.round((rawHeight / 100) * refHeight));
  }

  return { width: w, height: h };
}


export interface ResolvedChildPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

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

  let gap = container.gap;
  if (container.gapUnit === '%') {
    const ref = container.display === 'flex' && container.flexDirection === 'row' ? innerW : innerH;
    gap = Math.max(0, Math.round((container.gap / 100) * ref));
  }

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

  const pxChildIndexes = children
    .map((child, i) => ({ index: i, unit: isRow ? child.widthUnit : child.heightUnit }))
    .filter(m => m.unit === 'px')
    .map(m => m.index);

  const percentChildIndexes = children
    .map((child, i) => ({ index: i, unit: isRow ? child.widthUnit : child.heightUnit }))
    .filter(m => m.unit === '%' || m.unit === 'fill')
    .map(m => m.index);

  const fillChildIndexes = children
    .map((child, i) => ({ index: i, unit: isRow ? child.widthUnit : child.heightUnit }))
    .filter(m => m.unit === 'fill')
    .map(m => m.index);

  const totalPxMain = pxChildIndexes.reduce(
    (sum, idx) => sum + (isRow ? childSizes[idx].width : childSizes[idx].height),
    0,
  );

  const mainLayoutSpace = Math.max(0, mainSpace - totalGap);
  const percentSpace = Math.max(0, mainLayoutSpace - totalPxMain);
  let totalPercentMain = 0;

  if (percentChildIndexes.length > 0) {
    const weights = percentChildIndexes.map((idx) => {
      const unit = isRow ? children[idx].widthUnit : children[idx].heightUnit;
      const raw = unit === 'fill'
        ? 100
        : (isRow
          ? ((children[idx] as UIElement & { rawWidth?: number }).rawWidth ?? children[idx].width)
          : ((children[idx] as UIElement & { rawHeight?: number }).rawHeight ?? children[idx].height));
      return Math.max(0, raw);
    });
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const useNormalization = totalWeight > 100;
    const denominator = useNormalization
      ? (totalWeight > 0 ? totalWeight : 1)
      : 100;

    const resolved = weights.map((w) => {
      const exact = (w / denominator) * percentSpace;
      const floored = Math.max(1, Math.floor(exact));
      return { floored, fraction: exact - floored };
    });

    if (totalWeight >= 100) {
      let distributed = resolved.reduce((sum, s) => sum + s.floored, 0);
      const remaining = percentSpace - distributed;

      if (remaining > 0 && resolved.length > 0) {
        const byRemainderDesc = [...resolved.keys()].sort(
          (a, b) => resolved[b].fraction - resolved[a].fraction
        );
        for (let i = 0; i < remaining; i++) {
          const idx = byRemainderDesc[i % byRemainderDesc.length];
          resolved[idx].floored += 1;
        }
      }
    }

    for (let i = 0; i < percentChildIndexes.length; i++) {
      const idx = percentChildIndexes[i];
      childSizes[idx][isRow ? 'width' : 'height'] = resolved[i].floored;
      totalPercentMain += resolved[i].floored;
    }
  }

  let totalMain = childSizes.reduce(
    (sum, s) => sum + (isRow ? s.width : s.height), 0
  ) + totalGap;

  if (totalMain > mainSpace && fillChildIndexes.length > 0) {
    let overflow = totalMain - mainSpace;
    for (let i = fillChildIndexes.length - 1; i >= 0 && overflow > 0; i--) {
      const idx = fillChildIndexes[i];
      const currentSize = isRow ? childSizes[idx].width : childSizes[idx].height;
      const shrinkSize = Math.min(overflow, Math.max(0, currentSize - 1));
      if (shrinkSize > 0) {
        childSizes[idx][isRow ? 'width' : 'height'] = currentSize - shrinkSize;
        overflow -= shrinkSize;
      }
    }
    totalMain = childSizes.reduce(
      (sum, s) => sum + (isRow ? s.width : s.height), 0
    ) + totalGap;
  }

  let mainOffset = 0;
  const gapSpaces: number[] = [];

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

        for (let i = 0; i < children.length - 1; i++) {
          gapSpaces.push(
            Math.floor((mainSpace - childMainSum) / (children.length - 1))
            + (i < ((mainSpace - childMainSum) % (children.length - 1)) ? 1 : 0)
          );
        }
      }
      mainOffset = 0;
      break;
    default:
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
      default:
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

    if (i < children.length - 1) {
      cursor += childMain + (container.justifyContent === 'space-between' && gapSpaces.length > 0 ? gapSpaces[i] : gap);
    }
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

  const totalGapX = gap * Math.max(0, cols - 1);
  const totalGapY = gap * Math.max(0, rows - 1);

  const cellW = Math.max(1, Math.floor((innerW - totalGapX) / cols));
  const cellH = Math.max(1, Math.floor((innerH - totalGapY) / rows));

  const childData = children.map((child, i) => ({
    index: i,
    isAbsoluteW: child.widthUnit !== 'px',
    isAbsoluteH: child.heightUnit !== 'px',
    mainWidth: childSizes[i].width,
    mainHeight: childSizes[i].height,
  }));

  for (let i = 0; i < children.length; i++) {
    const cData = childData[i];

    childSizes[i].width = cData.isAbsoluteW
      ? Math.max(1, Math.floor(childSizes[i].width * (cellW / Math.max(1, cData.mainWidth))))
      : Math.min(cData.mainWidth, cellW);

    childSizes[i].height = cData.isAbsoluteH
      ? Math.max(1, Math.floor(childSizes[i].height * (cellH / Math.max(1, cData.mainHeight))))
      : Math.min(cData.mainHeight, cellH);
  }

  const results: ResolvedChildPosition[] = [];

  for (let i = 0; i < children.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    if (row >= rows) break;

    const cellX = innerX + col * (cellW + gap);
    const cellY = innerY + row * (cellH + gap);

    const w = Math.min(childSizes[i].width, cellW);
    const h = Math.min(childSizes[i].height, cellH);

    results.push({
      id: children[i].id,
      x: cellX + Math.floor((cellW - w) / 2),
      y: cellY + Math.floor((cellH - h) / 2),
      width: w,
      height: h,
    });
  }

  return results;
}
