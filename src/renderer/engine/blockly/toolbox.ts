import { CCProject, PLUGINS } from '@/models/Project';
import * as Blockly from 'blockly';
import { blocksData } from './BlocksDataGen';

export function generateToolBox(project: CCProject | null): Blockly.utils.toolbox.ToolboxDefinition {
  return {
    kind: 'categoryToolbox',
    contents: [
      // Category: Events
      {
        kind: 'category', name: 'Events', categorystyle: 'events_category',
        contents: [
          { kind: 'block', type: 'event_screen_load' },
          { kind: 'block', type: 'event_screen_update' },
          { kind: 'block', type: 'event_components_events' },
          { kind: 'block', type: 'event_key_press' },
          { kind: 'block', type: 'event_timer' },
          { kind: 'block', type: 'event_redstone' },
          { kind: 'block', type: 'event_modem_message' },
          { kind: 'block', type: 'event_any' },
        ],
      },

      // Category: Interfaces
      {
        kind: 'category', name: 'Interfaces', categorystyle: 'ui_category',
        contents: [
          { kind: 'label', text: '--- Screen ---' },
          { kind: 'block', type: 'ui_navigate', inputs: { SCREEN: { block: { type: 'ui_screen_select' } } } },
          { kind: 'block', type: 'ui_screen_select' },
          { kind: 'label', text: '--- Element ---' },
          { kind: 'block', type: 'ui_set_prop' },
          { kind: 'block', type: 'ui_get_prop' },
          { kind: 'label', text: '--- Options ---' },
          { kind: 'block', type: 'color_picker' },
          { kind: 'block', type: 'helpers_onoff' },
          { kind: 'block', type: 'helpers_sides' },
          { kind: 'block', type: 'helpers_units' },
          { kind: 'block', type: 'helpers_align' },
          { kind: 'block', type: 'helpers_display' },
          { kind: 'block', type: 'helpers_flexDirection' },
          { kind: 'block', type: 'helpers_orientation' },
        ],
      },

      { kind: 'sep' },

      // Category: Control (built-in Blockly blocks)
      {
        kind: 'category', name: 'Control', categorystyle: 'loop_category',
        contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'controls_if', extraState: { hasElse: true } },
          { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: { block: { type: 'math_number', fields: { NUM: 10 } } } } },
          { kind: 'block', type: 'controls_whileUntil' },
          {
            kind: 'block', type: 'controls_for', fields: { VAR: 'i' }, inputs: {
              FROM: { block: { type: 'math_number', fields: { NUM: 1 } } },
              TO: { block: { type: 'math_number', fields: { NUM: 10 } } },
              BY: { block: { type: 'math_number', fields: { NUM: 1 } } },
            }
          },
          { kind: 'block', type: 'controls_forEach' },
          { kind: 'block', type: 'controls_flow_statements' },
        ],
      },

      // Category: Logic
      {
        kind: 'category', name: 'Logic', categorystyle: 'logic_category',
        contents: [
          { kind: 'block', type: 'logic_compare' },
          { kind: 'block', type: 'logic_operation' },
          { kind: 'block', type: 'logic_negate' },
          { kind: 'block', type: 'logic_boolean' },
          { kind: 'block', type: 'logic_ternary' },
        ],
      },

      // Category: Math
      {
        kind: 'category', name: 'Math', categorystyle: 'math_category',
        contents: [
          { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'math_single' },
          { kind: 'block', type: 'math_trig' },
          { kind: 'block', type: 'math_number_property' },
          { kind: 'block', type: 'math_round' },
          { kind: 'block', type: 'math_on_list' },
          { kind: 'block', type: 'math_modulo' },
          { kind: 'block', type: 'math_random_float' },
          {
            kind: 'block', type: 'math_constrain', inputs: {
              LOW: { block: { type: 'math_number', fields: { NUM: 1 } } },
              HIGH: { block: { type: 'math_number', fields: { NUM: 100 } } },
            }
          },
          {
            kind: 'block', type: 'math_random_int', inputs: {
              FROM: { block: { type: 'math_number', fields: { NUM: 1 } } },
              TO: { block: { type: 'math_number', fields: { NUM: 100 } } },
            }
          },
        ],
      },

      // Category: Text
      {
        kind: 'category', name: 'Text', categorystyle: 'text_category',
        contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_join' },
          { kind: 'block', type: 'text_length' },
          { kind: 'block', type: 'text_isEmpty' },
          { kind: 'block', type: 'text_reverse' },
          { kind: 'block', type: 'text_changeCase' },
          { kind: 'block', type: 'text_trim' },
          { kind: 'block', type: 'text_charAt' },
          { kind: 'block', type: 'text_replace' },
          { kind: 'label', text: '--- Utilities ---' },
          { kind: 'block', type: 'textutils_serialize' },
          { kind: 'block', type: 'textutils_unserialize' },
          { kind: 'block', type: 'textutils_serializeJSON' },
          { kind: 'block', type: 'textutils_unserializeJSON' },
          { kind: 'block', type: 'textutils_urlEncode' },
        ],
      },

      // Category: Lists
      {
        kind: 'category', name: 'Lists', categorystyle: 'list_category',
        contents: [
          { kind: 'block', type: 'lists_create_with' },
          { kind: 'block', type: 'lists_repeat' },
          { kind: 'block', type: 'lists_length' },
          { kind: 'block', type: 'lists_reverse' },
          { kind: 'block', type: 'lists_isEmpty' },
          { kind: 'block', type: 'lists_getIndex' },
          { kind: 'block', type: 'lists_setIndex' },
          { kind: 'block', type: 'lists_indexOf' },
          { kind: 'block', type: 'lists_getSublist' },
          { kind: 'block', type: 'lists_split' },
          { kind: 'block', type: 'lists_sort' },
        ],
      },

      // Category: Variables (lexical variables plugin blocks)
      {
        kind: 'category', name: 'Variables', categorystyle: 'variable_category',
        contents: [
          { kind: 'block', type: 'global_declaration' },
          { kind: 'block', type: 'lexical_variable_get' },
          { kind: 'block', type: 'lexical_variable_set' },
          { kind: 'label', text: '--- Local Scope ---' },
          { kind: 'block', type: 'local_declaration_statement' },
          { kind: 'block', type: 'local_declaration_expression' },
        ],
      },

      // Category: Functions (built-in PROCEDURE flyout, overridden by lexical variables plugin)
      { kind: 'category', name: 'Functions', categorystyle: 'procedure_category', custom: 'PROCEDURE' },

      { kind: 'sep' },

      // ============= CC:Tweaked APIs =============

      // Category: Terminal
      {
        kind: 'category', name: 'Terminal', categorystyle: 'terminal_category',
        contents: [
          { kind: 'label', text: '--- Write & Clear ---' },
          { kind: 'block', type: 'term_write', inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'monitor' } } } } },
          { kind: 'block', type: 'term_print', inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'monitor' } } } } },
          { kind: 'block', type: 'term_read' },
          { kind: 'block', type: 'term_redirect' },
          { kind: 'block', type: 'term_clear' },
          { kind: 'block', type: 'term_clearLine' },
          { kind: 'block', type: 'term_scroll', inputs: { NUMBER: { block: { type: 'math_number', fields: { NUM: 1 } } } } },
          { kind: 'label', text: '--- Cursor ---' },
          { kind: 'block', type: 'term_setCursorPos', inputs: { X: { block: { type: 'math_number', fields: { NUM: 1 } } }, Y: { block: { type: 'math_number', fields: { NUM: 1 } } } } },
          { kind: 'block', type: 'term_setCursorBlink', inputs: { BOOL: { block: { type: 'helpers_onoff' } } } },
          { kind: 'block', type: 'term_getCursorX' },
          { kind: 'block', type: 'term_getCursorY' },
          { kind: 'label', text: '--- Colors ---' },
          { kind: 'block', type: 'term_setTextColor', inputs: { COLOR: { block: { type: 'color_picker' } } } },
          { kind: 'block', type: 'term_getTextColor' },
          { kind: 'block', type: 'term_setBgColor', inputs: { COLOR: { block: { type: 'color_picker' } } } },
          { kind: 'block', type: 'term_getBgColor' },
          { kind: 'label', text: '--- Advanced ---' },
          { kind: 'block', type: 'term_blit', inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'Hello, World!' } } }, FG: { block: { type: 'color_picker' } }, BG: { block: { type: 'color_picker' } } } },
          { kind: 'block', type: 'term_getWidth' },
          { kind: 'block', type: 'term_getHeight' },
          { kind: 'block', type: 'term_isColor' },
          { kind: 'label', text: '--- Text Utilities ---' },
          { kind: 'block', type: 'textutils_slowPrint', inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'Hello, World!' } } }, RATE: { block: { type: 'math_number', fields: { NUM: 10 } } } } },
          { kind: 'block', type: 'textutils_slowWrite', inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'Hello, World!' } } }, RATE: { block: { type: 'math_number', fields: { NUM: 10 } } } } },
        ],
      },

      // Category: Turtle (large - use subcategory-like labels)
      {
        kind: 'category', name: 'Turtle', categorystyle: 'turtle_category',
        contents: [
          { kind: 'label', text: '--- Movement ---' },
          { kind: 'block', type: 'turtle_forward' },
          { kind: 'block', type: 'turtle_back' },
          { kind: 'block', type: 'turtle_up' },
          { kind: 'block', type: 'turtle_down' },
          { kind: 'block', type: 'turtle_turnLeft' },
          { kind: 'block', type: 'turtle_turnRight' },
          { kind: 'label', text: '--- Dig ---' },
          { kind: 'block', type: 'turtle_dig' },
          { kind: 'block', type: 'turtle_digUp' },
          { kind: 'block', type: 'turtle_digDown' },
          { kind: 'label', text: '--- Place ---' },
          { kind: 'block', type: 'turtle_place' },
          { kind: 'block', type: 'turtle_placeUp' },
          { kind: 'block', type: 'turtle_placeDown' },
          { kind: 'label', text: '--- Drop & Suck ---' },
          { kind: 'block', type: 'turtle_drop' },
          { kind: 'block', type: 'turtle_dropUp' },
          { kind: 'block', type: 'turtle_dropDown' },
          { kind: 'block', type: 'turtle_suck' },
          { kind: 'block', type: 'turtle_suckUp' },
          { kind: 'block', type: 'turtle_suckDown' },
          { kind: 'label', text: '--- Combat ---' },
          { kind: 'block', type: 'turtle_attack' },
          { kind: 'block', type: 'turtle_attackUp' },
          { kind: 'block', type: 'turtle_attackDown' },
          { kind: 'label', text: '--- Detection ---' },
          { kind: 'block', type: 'turtle_detect' },
          { kind: 'block', type: 'turtle_detectUp' },
          { kind: 'block', type: 'turtle_detectDown' },
          { kind: 'block', type: 'turtle_compare' },
          { kind: 'block', type: 'turtle_compareUp' },
          { kind: 'block', type: 'turtle_compareDown' },
          { kind: 'block', type: 'turtle_inspect' },
          { kind: 'block', type: 'turtle_inspectUp' },
          { kind: 'block', type: 'turtle_inspectDown' },
          { kind: 'label', text: '--- Inventory ---' },
          { kind: 'block', type: 'turtle_select' },
          { kind: 'block', type: 'turtle_getSelectedSlot' },
          { kind: 'block', type: 'turtle_getItemCount' },
          { kind: 'block', type: 'turtle_getItemSpace' },
          { kind: 'block', type: 'turtle_getItemDetail' },
          { kind: 'block', type: 'turtle_transferTo' },
          { kind: 'block', type: 'turtle_craft' },
          { kind: 'label', text: '--- Fuel ---' },
          { kind: 'block', type: 'turtle_refuel' },
          { kind: 'block', type: 'turtle_getFuelLevel' },
          { kind: 'block', type: 'turtle_getFuelLimit' },
          { kind: 'label', text: '--- Equipment ---' },
          { kind: 'block', type: 'turtle_equipLeft' },
          { kind: 'block', type: 'turtle_equipRight' },
        ],
      },

      // Category: Rednet
      {
        kind: 'category', name: 'Rednet', categorystyle: 'rednet_category',
        contents: [
          { kind: 'block', type: 'rednet_open' },
          { kind: 'block', type: 'rednet_close' },
          { kind: 'block', type: 'rednet_closeAll' },
          { kind: 'block', type: 'rednet_isOpen' },
          { kind: 'label', text: '--- Send & Receive ---' },
          { kind: 'block', type: 'rednet_send' },
          { kind: 'block', type: 'rednet_broadcast' },
          { kind: 'block', type: 'rednet_receive' },
          { kind: 'label', text: '--- DNS ---' },
          { kind: 'block', type: 'rednet_host' },
          { kind: 'block', type: 'rednet_unhost' },
          { kind: 'block', type: 'rednet_lookup' },
        ],
      },

      // Category: Redstone
      {
        kind: 'category', name: 'Redstone', categorystyle: 'redstone_category',
        contents: [
          { kind: 'label', text: '--- Digital ---' },
          { kind: 'block', type: 'rs_setOutput', inputs: { VALUE: { block: { type: 'helpers_onoff' } } } },
          { kind: 'block', type: 'rs_getOutput' },
          { kind: 'block', type: 'rs_getInput' },
          { kind: 'label', text: '--- Analog ---' },
          { kind: 'block', type: 'rs_setAnalogOutput', inputs: { VALUE: { block: { type: 'math_number', fields: { NUM: 15 } } } } },
          { kind: 'block', type: 'rs_getAnalogOutput' },
          { kind: 'block', type: 'rs_getAnalogInput' },
          { kind: 'label', text: '--- Bundled ---' },
          { kind: 'block', type: 'rs_setBundledOutput', inputs: { VALUE: { block: { type: 'math_number', fields: { NUM: 0 } } } } },
          { kind: 'block', type: 'rs_getBundledOutput' },
          { kind: 'block', type: 'rs_getBundledInput' },
          { kind: 'block', type: 'rs_testBundledInput', inputs: { COLOR: { block: { type: 'color_picker' } } } },
        ],
      },

      // Category: Filesystem
      {
        kind: 'category', name: 'Files', categorystyle: 'filesystem_category',
        contents: [
          { kind: 'label', text: '--- Read / Write ---' },
          { kind: 'block', type: 'fs_readFile' },
          { kind: 'block', type: 'fs_writeFile' },
          { kind: 'block', type: 'fs_appendFile' },
          { kind: 'label', text: '--- File Operations ---' },
          { kind: 'block', type: 'fs_exists' },
          { kind: 'block', type: 'fs_isDir' },
          { kind: 'block', type: 'fs_delete' },
          { kind: 'block', type: 'fs_makeDir' },
          { kind: 'block', type: 'fs_move' },
          { kind: 'block', type: 'fs_copy' },
          { kind: 'label', text: '--- Info ---' },
          { kind: 'block', type: 'fs_list' },
          { kind: 'block', type: 'fs_getSize' },
          { kind: 'block', type: 'fs_getFreeSpace' },
        ],
      },

      // Category: PaintUtils
      {
        kind: 'category', name: 'Paint Utils', categorystyle: 'paintutils_category',
        contents: [
          { kind: 'block', type: 'paint_drawPixel', inputs: { COLOR: { block: { type: 'color_picker' } } } },
          { kind: 'block', type: 'paint_drawLine', inputs: { COLOR: { block: { type: 'color_picker' } } } },
          { kind: 'block', type: 'paint_drawBox', inputs: { COLOR: { block: { type: 'color_picker' } } } },
          { kind: 'block', type: 'paint_drawFilledBox', inputs: { COLOR: { block: { type: 'color_picker' } } } },
          { kind: 'block', type: 'paint_drawImage' },
          { kind: 'block', type: 'paint_loadImage' },
        ],
      },

      // Category: Window
      {
        kind: 'category', name: 'Window', categorystyle: 'window_category',
        contents: [
          { kind: 'block', type: 'window_create' },
          { kind: 'block', type: 'window_setVisible' },
          { kind: 'block', type: 'window_isVisible' },
          { kind: 'block', type: 'window_reposition' },
          { kind: 'block', type: 'window_redraw' },
          { kind: 'block', type: 'window_getWidth' },
          { kind: 'block', type: 'window_getHeight' },
          { kind: 'block', type: 'window_getPositionX' },
          { kind: 'block', type: 'window_getPositionY' },
        ],
      },

      // Category: HTTP
      {
        kind: 'category', name: 'HTTP', categorystyle: 'http_category',
        contents: [
          { kind: 'block', type: 'http_get' },
          { kind: 'block', type: 'http_postRequest' },
          { kind: 'block', type: 'http_checkURL' },
        ],
      },

      // Category: Utility
      {
        kind: 'category', name: 'Utility', categorystyle: 'utility_category',
        contents: [
          { kind: 'label', text: '--- Conversion ---' },
          { kind: 'block', type: 'tonumber_val' },
          { kind: 'block', type: 'tostring_val' },
          { kind: 'block', type: 'type_of' },
          { kind: 'label', text: '--- Error Handling ---' },
          { kind: 'block', type: 'pcall_wrap' },
          { kind: 'label', text: '--- Settings ---' },
          { kind: 'block', type: 'settings_get' },
          { kind: 'block', type: 'settings_set' },
          { kind: 'block', type: 'settings_unset' },
          { kind: 'block', type: 'settings_save' },
          { kind: 'block', type: 'settings_load' },
        ],
      },


      // Category: System
      {
        kind: 'category', name: 'System', categorystyle: 'os_category',
        contents: [
          { kind: 'block', type: 'os_sleep' },
          { kind: 'block', type: 'os_wait_secs' },
          { kind: 'label', text: '--- Timers & Alarms ---' },
          { kind: 'block', type: 'os_startTimer' },
          { kind: 'block', type: 'os_cancelTimer' },
          { kind: 'block', type: 'os_setAlarm' },
          { kind: 'block', type: 'os_cancelAlarm' },
          { kind: 'label', text: '--- Date & Time ---' },
          { kind: 'block', type: 'os_time' },
          { kind: 'block', type: 'os_day' },
          { kind: 'block', type: 'os_epoch' },
          { kind: 'block', type: 'os_clock' },
          { kind: 'label', text: '--- Computer ---' },
          { kind: 'block', type: 'os_getComputerID' },
          { kind: 'block', type: 'os_getComputerLabel' },
          { kind: 'block', type: 'os_setComputerLabel' },
          { kind: 'block', type: 'os_version' },
          { kind: 'block', type: 'os_queueEvent' },
          { kind: 'block', type: 'os_shutdown' },
          { kind: 'block', type: 'os_reboot' },
          { kind: 'label', text: '--- GPS ---' },
          { kind: 'block', type: 'gps_locate' },
        ],
      },


      { kind: 'sep' },

      // Category: Peripheral
      {
        kind: 'category', name: 'Peripheral', categorystyle: 'peripheral_category',
        contents: [
          { kind: 'block', type: 'peripheral_wrap' },
          { kind: 'block', type: 'peripheral_find', inputs: { TYPE: { block: { type: 'text', fields: { TEXT: 'monitor' } } } } },
          { kind: 'block', type: 'peripheral_isPresent', inputs: { PERIPHERAL: { block: { type: 'text', fields: { TEXT: 'monitor' } } } } },
          { kind: 'block', type: 'peripheral_getType', inputs: { PERIPHERAL: { block: { type: 'text', fields: { TEXT: 'monitor' } } } } },
          { kind: 'block', type: 'peripheral_hasType', inputs: { TYPE: { block: { type: 'text', fields: { TEXT: 'monitor' } } } } },
          { kind: 'block', type: 'peripheral_getNames' },
          { kind: 'block', type: 'peripheral_getName' },
          { kind: 'block', type: 'peripheral_getMethods' },
          { kind: 'block', type: 'peripheral_call' },
        ],
      },

      // Category: Disk
      {
        kind: 'category', name: 'Disk', categorystyle: 'disk_category',
        contents: [
          { kind: 'block', type: 'disk_isPresent' },
          { kind: 'block', type: 'disk_hasData' },
          { kind: 'block', type: 'disk_hasAudio' },
          { kind: 'block', type: 'disk_getLabel' },
          { kind: 'block', type: 'disk_setLabel' },
          { kind: 'block', type: 'disk_getMountPath' },
          { kind: 'block', type: 'disk_eject' },
        ],
      },
      {
        kind: 'category', name: 'Modem', categorystyle: 'modem_category',
        contents: [
          { kind: 'block', type: 'modem_open' },
          { kind: 'block', type: 'modem_isOpen' },
          { kind: 'block', type: 'modem_close' },
          { kind: 'block', type: 'modem_closeAll' },
          { kind: 'block', type: 'modem_transmit' },
          { kind: 'block', type: 'modem_isWireless' },
          { kind: 'block', type: 'modem_getNamesRemote' },
        ],
      },

      ...generatePluginsToolbox(project),
    ],
  }
};

function generatePluginsToolbox(project: CCProject | null): Array<Blockly.utils.toolbox.ToolboxItemInfo> {
  if (!project || (project?.plugins?.length ?? 0) === 0) return [];

  const infoArray = [];
  infoArray.push({ kind: 'sep' });

  for (const plugin of project.plugins) {
    const pluginData = PLUGINS.find(p => p.id === plugin.id);
    if (!pluginData) continue;

    const blockData = blocksData.find(b => b.category === "plugins" && b.type === plugin.id);
    if (!blockData) continue;

    const blocksContent = [];

    for (const blockType of Object.keys(blockData.blocks)) {
      switch (blockType) {
        case "createmod_getStress":
          blocksContent.push({ kind: 'label', text: '--- Stressometer ---' });
          break;
        case "createmod_getSpeed":
          blocksContent.push({ kind: 'label', text: '--- Speedometer ---' });
          break;
        case "createmod_setGeneratedSpeed":
          blocksContent.push({ kind: 'label', text: '--- Creative Motor ---' });
          break;
        case "createmod_setTargetSpeed":
          blocksContent.push({ kind: 'label', text: '--- Rotational Speed Controller ---' });
          break;
        case "createmod_gearshift_rotate":
          blocksContent.push({ kind: 'label', text: '--- Sequenced Gearshift ---' });
          break;
        case "createmod_isExtended":
          blocksContent.push({ kind: 'label', text: '--- Sticker ---' });
          break;
        case "createmod_display_setCursorPos":
          blocksContent.push({ kind: 'label', text: '--- Display Link ---' });
          break;
        case "createmod_nixie_setText":
          blocksContent.push({ kind: 'label', text: '--- Nixie Tube ---' });
          break;
        case "createmod_train_isTrainPassing":
          blocksContent.push({ kind: 'label', text: '--- Train Observer ---' });
          break;
        case "createmod_train_getState":
          blocksContent.push({ kind: 'label', text: '--- Train Signal ---' });
          break;
        case "createmod_train_assemble":
          blocksContent.push({ kind: 'label', text: '--- Train Station ---' });
          break;
        case "createmod_logistics_getAddress":
          blocksContent.push({ kind: 'label', text: '--- Logistics ---' });
          break;
      }
      blocksContent.push({ kind: 'block', type: blockType });
    }

    infoArray.push({
      kind: 'category', name: pluginData.name, categorystyle: `${pluginData.id}_category`,
      contents: blocksContent,
    });
  }

  return infoArray;
}