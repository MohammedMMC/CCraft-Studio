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

export function defineAllBlocks() {
  // =====================================================================
  // Blocks: Extra
  // =====================================================================

  Blockly.Blocks['helpers_onoff'] = {
    init() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['on', 'true'], ['off', 'false'],
        ]), 'BOOL');
      this.setOutput(true, 'Boolean');
      this.setStyle('logic_blocks');
      this.setTooltip(Blockly.Msg['LOGIC_BOOLEAN_TOOLTIP']);
    },
  };

  Blockly.Blocks['helpers_sides'] = {
    init() {
      this.appendDummyInput()
        .appendField('side')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
      this.setOutput(true, 'Side');
      this.setStyle('text_blocks');
      this.setTooltip('Select side field');
    },
  };

  Blockly.Blocks['helpers_units'] = {
    init() {
      this.appendDummyInput()
        .appendField('unit')
        .appendField(new Blockly.FieldDropdown([
          ['px', 'px'], ['%', '%'], ['full', 'fill'],
        ]), 'SIZE_UNIT');
      this.setOutput(true, 'SizeUnit');
      this.setStyle('text_blocks');
      this.setTooltip('Select size unit field');
    },
  };

  Blockly.Blocks['helpers_display'] = {
    init() {
      this.appendDummyInput()
        .appendField('display')
        .appendField(new Blockly.FieldDropdown([
          ['flex', 'flex'], ['grid', 'grid'],
        ]), 'DISPLAY');
      this.setOutput(true, 'Display');
      this.setStyle('text_blocks');
      this.setTooltip('Select display type field');
    },
  };

  Blockly.Blocks['helpers_flexDirection'] = {
    init() {
      this.appendDummyInput()
        .appendField('flex direction')
        .appendField(new Blockly.FieldDropdown([
          ['row', 'row'], ['column', 'column'],
        ]), 'FLEX_DIRECTION');
      this.setOutput(true, 'FlexDirection');
      this.setStyle('text_blocks');
      this.setTooltip('Select flex direction field');
    },
  };

  Blockly.Blocks['helpers_orientation'] = {
    init() {
      this.appendDummyInput()
        .appendField('orientation')
        .appendField(new Blockly.FieldDropdown([
          ['Horizontal LTR', 'hltr'], ['Horizontal RTL', 'hrtl'], ['Vertical TTB', 'vttb'], ['Vertical BTT', 'vbtt'],
        ]), 'ORIENTATION');
      this.setOutput(true, 'Orientation');
      this.setStyle('text_blocks');
      this.setTooltip('Select orientation field');
    },
  };

  Blockly.Blocks['helpers_align'] = {
    init() {
      this.appendDummyInput()
        .appendField('align')
        .appendField(new Blockly.FieldDropdown([...new Map([...ALIGNS, ...TEXT_ALIGNS])]), 'ALIGN');
      this.setOutput(true, 'Align');
      this.setStyle('text_blocks');
      this.setTooltip('Select align field');
    },
    onchange(event: Abstract) {
      if (![Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE].includes(event.type as any)) return;
      if ((event as any).reason && (event as any).reason[0] !== "connect") return;

      const propField = this.getParent()?.getField('PROP')?.getValue();
      const alignField = this.getField('ALIGN') as Blockly.FieldDropdown | null;

      if (!propField || !alignField) return;

      const currentOption = alignField.getValue();
      const oldOptions = alignField.getOptions();
      let newOptions: [string, string][] | null = null;

      if (propField === 'alignItems') {
        newOptions = ALIGNS.filter(([_, v]) => v !== 'space-between');
      } else if (propField === 'justifyContent') {
        newOptions = ALIGNS;
      } else if (propField === 'textAlign') {
        newOptions = TEXT_ALIGNS;
      }

      if (!newOptions) return;

      if (!(oldOptions.length === newOptions.length
        && oldOptions.every((item, index) =>
          item[0] === newOptions[index][0] && item[1] === newOptions[index][1]
        )
      )) alignField.setOptions(newOptions);

      if (typeof currentOption === 'string' && newOptions.flat().includes(currentOption) && !(alignField.getValue() === currentOption)) {
        alignField.setValue(currentOption);
      }
    }
  };

  // =====================================================================
  // 10. REDNET API
  // =====================================================================

  Blockly.Blocks['rednet_open'] = {
    init() {
      this.appendDummyInput()
        .appendField('open rednet on')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('rednet_blocks');
      this.setTooltip('Open a modem on the given side for rednet communication');
    },
  };

  Blockly.Blocks['rednet_close'] = {
    init() {
      this.appendDummyInput()
        .appendField('close rednet on')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('rednet_blocks');
      this.setTooltip('Close a modem on the given side');
    },
  };

  Blockly.Blocks['rednet_send'] = {
    init() {
      this.appendValueInput('MESSAGE')
        .appendField('send');
      this.appendValueInput('ID').setCheck('Number')
        .appendField('to computer');
      this.appendDummyInput()
        .appendField('protocol')
        .appendField(new Blockly.FieldTextInput(''), 'PROTOCOL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('rednet_blocks');
      this.setInputsInline(true);
      this.setTooltip('Send a message to a specific computer via rednet');
    },
  };

  Blockly.Blocks['rednet_broadcast'] = {
    init() {
      this.appendValueInput('MESSAGE')
        .appendField('broadcast');
      this.appendDummyInput()
        .appendField('protocol')
        .appendField(new Blockly.FieldTextInput(''), 'PROTOCOL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('rednet_blocks');
      this.setInputsInline(true);
      this.setTooltip('Broadcast a message to all computers on the network');
    },
  };

  Blockly.Blocks['rednet_host'] = {
    init() {
      this.appendDummyInput()
        .appendField('host protocol')
        .appendField(new Blockly.FieldTextInput('myProtocol'), 'PROTOCOL')
        .appendField('as')
        .appendField(new Blockly.FieldTextInput('myHost'), 'HOSTNAME');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('rednet_blocks');
      this.setTooltip('Register this computer as a host for a protocol');
    },
  };

  Blockly.Blocks['rednet_unhost'] = {
    init() {
      this.appendDummyInput()
        .appendField('unhost protocol')
        .appendField(new Blockly.FieldTextInput('myProtocol'), 'PROTOCOL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('rednet_blocks');
      this.setTooltip('Stop hosting a protocol');
    },
  };

  Blockly.Blocks['rednet_receive'] = {
    init() {
      this.appendDummyInput()
        .appendField('receive message timeout')
        .appendField(new Blockly.FieldNumber(10, 0), 'TIMEOUT');
      this.setOutput(true, null);
      this.setStyle('rednet_blocks');
      this.setTooltip('Wait for a rednet message with an optional timeout');
    },
  };

  Blockly.Blocks['rednet_lookup'] = {
    init() {
      this.appendDummyInput()
        .appendField('lookup')
        .appendField(new Blockly.FieldTextInput('myProtocol'), 'PROTOCOL')
        .appendField('host')
        .appendField(new Blockly.FieldTextInput(''), 'HOSTNAME');
      this.setOutput(true, 'Number');
      this.setStyle('rednet_blocks');
      this.setTooltip('Look up computers hosting a specific protocol');
    },
  };

  Blockly.Blocks['rednet_isOpen'] = {
    init() {
      this.appendDummyInput()
        .appendField('rednet open on')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
        .appendField('?');
      this.setOutput(true, 'Boolean');
      this.setStyle('rednet_blocks');
      this.setTooltip('Check if rednet is open on a given side');
    },
  };

  // =====================================================================
  // 11. TEXTUTILS API
  // =====================================================================

  Blockly.Blocks['textutils_serialize'] = {
    init() {
      this.appendValueInput('VALUE')
        .appendField('serialize');
      this.setOutput(true, 'String');
      this.setStyle('text_blocks');
      this.setTooltip('Convert a Lua value to a string representation');
    },
  };

  Blockly.Blocks['textutils_unserialize'] = {
    init() {
      this.appendValueInput('TEXT').setCheck('String')
        .appendField('unserialize');
      this.setOutput(true, null);
      this.setStyle('text_blocks');
      this.setTooltip('Convert a serialized string back to a Lua value');
    },
  };

  Blockly.Blocks['textutils_serializeJSON'] = {
    init() {
      this.appendValueInput('VALUE')
        .appendField('to JSON');
      this.setOutput(true, 'String');
      this.setStyle('text_blocks');
      this.setTooltip('Convert a Lua value to a JSON string');
    },
  };

  Blockly.Blocks['textutils_unserializeJSON'] = {
    init() {
      this.appendValueInput('TEXT').setCheck('String')
        .appendField('from JSON');
      this.setOutput(true, null);
      this.setStyle('text_blocks');
      this.setTooltip('Parse a JSON string into a Lua value');
    },
  };

  Blockly.Blocks['textutils_urlEncode'] = {
    init() {
      this.appendValueInput('TEXT').setCheck('String')
        .appendField('URL encode');
      this.setOutput(true, 'String');
      this.setStyle('text_blocks');
      this.setTooltip('URL-encode a string for safe use in URLs');
    },
  };

  Blockly.Blocks['textutils_slowPrint'] = {
    init() {
      this.appendValueInput('TEXT').setCheck('String')
        .appendField('slow print');
      this.appendValueInput('RATE').setCheck('Number')
        .appendField('rate');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('text_blocks');
      this.setInputsInline(true);
      this.setTooltip('Print text character by character at the given rate');
    },
  };

  Blockly.Blocks['textutils_slowWrite'] = {
    init() {
      this.appendValueInput('TEXT').setCheck('String')
        .appendField('slow write');
      this.appendValueInput('RATE').setCheck('Number')
        .appendField('rate');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('text_blocks');
      this.setInputsInline(true);
      this.setTooltip('Write text character by character at the given rate (no newline)');
    },
  };

  // =====================================================================
  // 12. PAINTUTILS API
  // =====================================================================

  Blockly.Blocks['paint_drawPixel'] = {
    init() {
      this.appendValueInput('X').setCheck('Number')
        .appendField('draw pixel at x:');
      this.appendValueInput('Y').setCheck('Number')
        .appendField('y:');
      this.appendValueInput('COLOR').setCheck('Color')
        .appendField('color');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('paintutils_blocks');
      this.setInputsInline(true);
      this.setTooltip('Draw a single pixel at the given coordinates');
    },
  };

  Blockly.Blocks['paint_drawLine'] = {
    init() {
      this.appendValueInput('X1').setCheck('Number')
        .appendField('draw line from x:');
      this.appendValueInput('Y1').setCheck('Number')
        .appendField('y:');
      this.appendValueInput('X2').setCheck('Number')
        .appendField('to x:');
      this.appendValueInput('Y2').setCheck('Number')
        .appendField('y:');
      this.appendValueInput('COLOR').setCheck('Color')
        .appendField('color');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('paintutils_blocks');
      this.setInputsInline(true);
      this.setTooltip('Draw a line between two points');
    },
  };

  Blockly.Blocks['paint_drawBox'] = {
    init() {
      this.appendValueInput('X1').setCheck('Number')
        .appendField('draw box from x:');
      this.appendValueInput('Y1').setCheck('Number')
        .appendField('y:');
      this.appendValueInput('X2').setCheck('Number')
        .appendField('to x:');
      this.appendValueInput('Y2').setCheck('Number')
        .appendField('y:');
      this.appendValueInput('COLOR').setCheck('Color')
        .appendField('color');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('paintutils_blocks');
      this.setInputsInline(true);
      this.setTooltip('Draw a box outline between two corners');
    },
  };

  Blockly.Blocks['paint_drawFilledBox'] = {
    init() {
      this.appendValueInput('X1').setCheck('Number')
        .appendField('draw filled box from x1:');
      this.appendValueInput('Y1').setCheck('Number')
        .appendField('y1:');
      this.appendValueInput('X2').setCheck('Number')
        .appendField('to x2:');
      this.appendValueInput('Y2').setCheck('Number')
        .appendField('y2:');
      this.appendValueInput('COLOR').setCheck('Color')
        .appendField('color');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('paintutils_blocks');
      this.setInputsInline(true);
      this.setTooltip('Draw a filled box between two corners');
    },
  };

  Blockly.Blocks['paint_drawImage'] = {
    init() {
      this.appendValueInput('IMAGE')
        .appendField('draw image');
      this.appendValueInput('X').setCheck('Number')
        .appendField('at x:');
      this.appendValueInput('Y').setCheck('Number')
        .appendField('y:');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('paintutils_blocks');
      this.setInputsInline(true);
      this.setTooltip('Draw a loaded image at the given coordinates');
    },
  };

  Blockly.Blocks['paint_loadImage'] = {
    init() {
      this.appendValueInput('PATH').setCheck('String')
        .appendField('load image from');
      this.setOutput(true, null);
      this.setStyle('paintutils_blocks');
      this.setTooltip('Load a paint image from a file');
    },
  };

  // =====================================================================
  // 13. WINDOW API
  // =====================================================================

  Blockly.Blocks['window_create'] = {
    init() {
      this.appendValueInput('X').setCheck('Number')
        .appendField('create window at x:');
      this.appendValueInput('Y').setCheck('Number')
        .appendField('y:');
      this.appendValueInput('W').setCheck('Number')
        .appendField('w:');
      this.appendValueInput('H').setCheck('Number')
        .appendField('h:');
      this.setOutput(true, null);
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Create a new window on the current terminal');
    },
  };

  Blockly.Blocks['window_setVisible'] = {
    init() {
      this.appendValueInput('WIN')
        .appendField('set window');
      this.appendValueInput('BOOL').setCheck('Boolean')
        .appendField('visible');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Show or hide a window');
    },
  };

  Blockly.Blocks['window_reposition'] = {
    init() {
      this.appendValueInput('WIN')
        .appendField('move window');
      this.appendValueInput('X').setCheck('Number')
        .appendField('to x:');
      this.appendValueInput('Y').setCheck('Number')
        .appendField('y:');
      this.appendValueInput('W').setCheck('Number')
        .appendField('w:');
      this.appendValueInput('H').setCheck('Number')
        .appendField('h:');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Reposition and resize a window');
    },
  };

  Blockly.Blocks['window_redraw'] = {
    init() {
      this.appendValueInput('WIN')
        .appendField('redraw window');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Redraw a window to the screen');
    },
  };

  Blockly.Blocks['window_getWidth'] = {
    init() {
      this.appendValueInput('WIN')
        .appendField('window');
      this.appendDummyInput()
        .appendField('width');
      this.setOutput(true, 'Number');
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Get the width of a window');
    },
  };

  Blockly.Blocks['window_getHeight'] = {
    init() {
      this.appendValueInput('WIN')
        .appendField('window');
      this.appendDummyInput()
        .appendField('height');
      this.setOutput(true, 'Number');
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Get the height of a window');
    },
  };

  Blockly.Blocks['window_getPositionX'] = {
    init() {
      this.appendValueInput('WIN')
        .appendField('window');
      this.appendDummyInput()
        .appendField('x position');
      this.setOutput(true, 'Number');
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Get the x position of a window');
    },
  };

  Blockly.Blocks['window_getPositionY'] = {
    init() {
      this.appendValueInput('WIN')
        .appendField('window');
      this.appendDummyInput()
        .appendField('y position');
      this.setOutput(true, 'Number');
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Get the y position of a window');
    },
  };

  Blockly.Blocks['window_isVisible'] = {
    init() {
      this.appendValueInput('WIN')
        .appendField('window');
      this.appendDummyInput()
        .appendField('visible?');
      this.setOutput(true, 'Boolean');
      this.setStyle('window_blocks');
      this.setInputsInline(true);
      this.setTooltip('Check if a window is currently visible');
    },
  };

  // =====================================================================
  // 14. SETTINGS API
  // =====================================================================

  Blockly.Blocks['settings_set'] = {
    init() {
      this.appendValueInput('VALUE')
        .appendField('set setting')
        .appendField(new Blockly.FieldTextInput('settingName'), 'NAME')
        .appendField('to');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('settings_blocks');
      this.setInputsInline(true);
      this.setTooltip('Set a setting to a value');
    },
  };

  Blockly.Blocks['settings_unset'] = {
    init() {
      this.appendDummyInput()
        .appendField('remove setting')
        .appendField(new Blockly.FieldTextInput('settingName'), 'NAME');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('settings_blocks');
      this.setTooltip('Remove a setting');
    },
  };

  Blockly.Blocks['settings_save'] = {
    init() {
      this.appendDummyInput()
        .appendField('save settings to')
        .appendField(new Blockly.FieldTextInput('.settings'), 'PATH');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('settings_blocks');
      this.setTooltip('Save all settings to a file');
    },
  };

  Blockly.Blocks['settings_load'] = {
    init() {
      this.appendDummyInput()
        .appendField('load settings from')
        .appendField(new Blockly.FieldTextInput('.settings'), 'PATH');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('settings_blocks');
      this.setTooltip('Load settings from a file');
    },
  };

  Blockly.Blocks['settings_get'] = {
    init() {
      this.appendValueInput('DEFAULT')
        .appendField('get setting')
        .appendField(new Blockly.FieldTextInput('settingName'), 'NAME')
        .appendField('default');
      this.setOutput(true, null);
      this.setStyle('settings_blocks');
      this.setInputsInline(true);
      this.setTooltip('Get a setting value, or a default if not set');
    },
  };

  // =====================================================================
  // 15. GPS API
  // =====================================================================

  Blockly.Blocks['gps_locate'] = {
    init() {
      this.appendDummyInput()
        .appendField('GPS locate');
      this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('timeout')
        .appendField(new Blockly.FieldNumber(2, 0), 'TIMEOUT');
      this.setOutput(true, null);
      this.setStyle('gps_blocks');
      this.setTooltip('Locate the computer using GPS. Returns x, y, z coordinates as a table.');
    },
  };

  // =====================================================================
  // 16. DISK API
  // =====================================================================

  Blockly.Blocks['disk_eject'] = {
    init() {
      this.appendDummyInput()
        .appendField('eject disk')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('disk_blocks');
      this.setTooltip('Eject a disk from a disk drive on the given side');
    },
  };

  Blockly.Blocks['disk_setLabel'] = {
    init() {
      this.appendValueInput('LABEL').setCheck('String')
        .appendField('set disk')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
        .appendField('label to');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('disk_blocks');
      this.setInputsInline(true);
      this.setTooltip('Set the label of a disk in a disk drive');
    },
  };

  Blockly.Blocks['disk_isPresent'] = {
    init() {
      this.appendDummyInput()
        .appendField('disk in')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
        .appendField('?');
      this.setOutput(true, 'Boolean');
      this.setStyle('disk_blocks');
      this.setTooltip('Check if a disk is present in the drive on the given side');
    },
  };

  Blockly.Blocks['disk_hasData'] = {
    init() {
      this.appendDummyInput()
        .appendField('disk')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
        .appendField('has data?');
      this.setOutput(true, 'Boolean');
      this.setStyle('disk_blocks');
      this.setTooltip('Check if a disk has data (is a floppy disk)');
    },
  };

  Blockly.Blocks['disk_hasAudio'] = {
    init() {
      this.appendDummyInput()
        .appendField('disk')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
        .appendField('has audio?');
      this.setOutput(true, 'Boolean');
      this.setStyle('disk_blocks');
      this.setTooltip('Check if a disk is a music disc');
    },
  };

  Blockly.Blocks['disk_getLabel'] = {
    init() {
      this.appendDummyInput()
        .appendField('disk')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
        .appendField('label');
      this.setOutput(true, 'String');
      this.setStyle('disk_blocks');
      this.setTooltip('Get the label of a disk');
    },
  };

  Blockly.Blocks['disk_getMountPath'] = {
    init() {
      this.appendDummyInput()
        .appendField('disk')
        .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
        .appendField('mount path');
      this.setOutput(true, 'String');
      this.setStyle('disk_blocks');
      this.setTooltip('Get the mount path of a disk');
    },
  };

  // =====================================================================
  // 17. UTILITY
  // =====================================================================

  Blockly.Blocks['tonumber_val'] = {
    init() {
      this.appendValueInput('TEXT').setCheck('String')
        .appendField('text to number');
      this.setOutput(true, 'Number');
      this.setStyle('utility_blocks');
      this.setTooltip('Convert a text string to a number');
    },
  };

  Blockly.Blocks['tostring_val'] = {
    init() {
      this.appendValueInput('VALUE')
        .appendField('to text');
      this.setOutput(true, 'String');
      this.setStyle('utility_blocks');
      this.setTooltip('Convert any value to a text string');
    },
  };

  Blockly.Blocks['type_of'] = {
    init() {
      this.appendValueInput('VALUE')
        .appendField('type of');
      this.setOutput(true, 'String');
      this.setStyle('utility_blocks');
      this.setTooltip('Get the type of a value (string, number, boolean, table, nil)');
    },
  };

  Blockly.Blocks['pcall_wrap'] = {
    init() {
      this.appendDummyInput()
        .appendField('try');
      this.appendStatementInput('DO')
        .setCheck(null);
      this.appendDummyInput()
        .appendField('on error');
      this.appendStatementInput('CATCH')
        .setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('utility_blocks');
      this.setTooltip('Try running code and catch any errors');
    },
  };
}
