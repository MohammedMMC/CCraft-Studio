import { CCColor } from './CCColors';
import { UIElement } from './UIElement';

export type DeviceType =
  | 'computer'
  | 'advanced_computer'
  | 'pocket_computer'
  | 'monitor'
  | 'turtle'
  | 'advanced_turtle';

export interface DevicePreset {
  label: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  supportsColor: boolean;
  supportsTouch: boolean;
  sizeEditable: boolean;
}

export const DEVICE_PRESETS: Record<DeviceType, DevicePreset> = {
  monitor: {
    label: 'Custom Advanced Monitor',
    description: 'External monitor (changeable size)',
    defaultWidth: 15, defaultHeight: 10,
    supportsColor: true, supportsTouch: true, sizeEditable: true,
  },
  advanced_computer: {
    label: 'Advanced Computer',
    description: 'Advanced computer with color and touch (51x19)',
    defaultWidth: 51, defaultHeight: 19,
    supportsColor: true, supportsTouch: true, sizeEditable: false,
  },
  computer: {
    label: 'Computer',
    description: 'Standard computer (51x19)',
    defaultWidth: 51, defaultHeight: 19,
    supportsColor: false, supportsTouch: false, sizeEditable: false,
  },
  pocket_computer: {
    label: 'Advanced Pocket Computer',
    description: 'Portable pocket computer (26x20)',
    defaultWidth: 26, defaultHeight: 20,
    supportsColor: true, supportsTouch: true, sizeEditable: false,
  },
  turtle: {
    label: 'Turtle',
    description: 'Standard turtle (39x13)',
    defaultWidth: 39, defaultHeight: 13,
    supportsColor: false, supportsTouch: false, sizeEditable: false,
  },
  advanced_turtle: {
    label: 'Advanced Turtle',
    description: 'Advanced turtle with color (39x13)',
    defaultWidth: 39, defaultHeight: 13,
    supportsColor: true, supportsTouch: false, sizeEditable: false,
  },
};

export interface Plugin {
  name: string;
  id: string;
  version: string;
  color: string;
}

export interface PluginStore {
  id: string;
  version: string;
}

export const PLUGINS: Plugin[] = [
  { name: 'Create Mod', id: "create-mod", version: '1.0.0', color: '#be5f4f' },
];

export interface GlobalVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'table';
  defaultValue: string;
}

export interface Screen {
  id: string;
  name: string;
  isWorkingScreen: boolean;
  displayType: 'terminal' | 'monitor' | 'any';
  monitorsWidthSize: number;
  monitorsHeightSize: number;
  monitorsWidthUnit: '=' | '>' | '<';
  monitorsHeightUnit: '=' | '>' | '<';
  bgColor?: CCColor;
  uiElements: UIElement[];
  blocklyXml?: string;
}

export interface CCProject {
  id: string;
  name: string;
  author: string;
  description: string;
  device: DeviceType;
  displayWidth: number;
  displayHeight: number;
  colorMode: 'color' | 'grayscale';
  screens: Screen[];
  variables: GlobalVariable[];
  createdAt: string;
  modifiedAt: string;
  version: string;
  plugins: PluginStore[];
  customMonitors: { blocks: string; width: number; height: number }[];
}

export function createDefaultProject(overrides: Partial<CCProject> = {}): CCProject {
  const id = crypto.randomUUID();
  const screenId = crypto.randomUUID();
  return {
    id,
    name: 'Untitled Project',
    author: '',
    description: '',
    plugins: [],
    device: 'advanced_computer',
    displayWidth: 51,
    displayHeight: 19,
    colorMode: 'color',
    screens: [
      {
        id: screenId,
        name: 'Screen 1',
        isWorkingScreen: true,
        displayType: 'any',
        monitorsWidthSize: 5,
        monitorsHeightSize: 3,
        monitorsWidthUnit: '=',
        monitorsHeightUnit: '=',
        bgColor: 'black',
        uiElements: [],
      },
    ],
    variables: [],
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    version: '1.0.0',
    customMonitors: [],
    ...overrides,
  };
}

export const MONITOR_SIZES: { blocks: string; width: number; height: number }[] = [
  { blocks: '1x1', width: 7, height: 5 },
  { blocks: '2x2', width: 18, height: 12 },
  { blocks: '2x3', width: 18, height: 19 },
  { blocks: '3x2', width: 29, height: 12 },
  { blocks: '3x3', width: 29, height: 19 },
  { blocks: '4x3', width: 39, height: 19 },
  { blocks: '4x4', width: 39, height: 29 },
  { blocks: '5x3', width: 50, height: 19 },
  { blocks: '5x4', width: 50, height: 26 },
];

export function getMonitorSize(blocks: string): { blocks: string; width: number; height: number } {
  const [cols, rows] = blocks.split('x').map(Number);
  return {
    blocks,
    width: 7 + (cols - 1) * 11 - Math.floor((cols - 1) / 3),
    height: 5 + (rows - 1) * 7 + Math.floor((rows - 1) / 3) * 3 - Math.floor((rows - 1) / 4) * 3,
  };
}