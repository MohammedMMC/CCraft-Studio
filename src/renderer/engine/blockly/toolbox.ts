export const TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    // Category: Events
    {
      kind: 'category', name: 'Events', categorystyle: 'events_category',
      contents: [
        { kind: 'block', type: 'event_screen_load' },
        { kind: 'block', type: 'event_button_click' },
        { kind: 'block', type: 'event_key_press' },
        { kind: 'block', type: 'event_timer' },
        { kind: 'block', type: 'event_redstone' },
        { kind: 'block', type: 'event_modem_message' },
        { kind: 'block', type: 'event_any' },
      ],
    },

    // Category: UI Actions
    {
      kind: 'category', name: 'UI Actions', categorystyle: 'ui_category',
      contents: [
        { kind: 'block', type: 'ui_draw_screen' },
        { kind: 'block', type: 'ui_navigate' },
        { kind: 'block', type: 'ui_clear' },
        { kind: 'label', text: '--- Element Properties ---' },
        { kind: 'block', type: 'ui_set_text' },
        { kind: 'block', type: 'ui_set_color' },
        { kind: 'block', type: 'ui_set_progress' },
        { kind: 'block', type: 'ui_set_visible' },
        { kind: 'block', type: 'ui_show' },
        { kind: 'block', type: 'ui_hide' },
        { kind: 'label', text: '--- Get Values ---' },
        { kind: 'block', type: 'ui_get_text' },
        { kind: 'block', type: 'ui_get_value' },
        { kind: 'label', text: '--- Direct Drawing ---' },
        { kind: 'block', type: 'ui_write_at' },
      ],
    },

    { kind: 'sep' },

    // Category: Control (built-in Blockly blocks)
    {
      kind: 'category', name: 'Control', categorystyle: 'loop_category',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'controls_if', extraState: { hasElse: true } },
        { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for', fields: { VAR: 'i' }, inputs: {
          FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
          TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
          BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
        }},
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
      ],
    },

    // Category: Math
    {
      kind: 'category', name: 'Math', categorystyle: 'math_category',
      contents: [
        { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_random_int', inputs: {
          FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
          TO: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
        }},
        { kind: 'block', type: 'math_change' },
      ],
    },

    // Category: Text
    {
      kind: 'category', name: 'Text', categorystyle: 'text_category',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_length' },
      ],
    },

    // Category: Variables (custom Blockly built-in)
    { kind: 'category', name: 'Variables', categorystyle: 'variable_category', custom: 'VARIABLE' },

    // Category: Lists
    {
      kind: 'category', name: 'Lists', categorystyle: 'list_category',
      contents: [
        { kind: 'block', type: 'lists_create_with' },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_getIndex' },
      ],
    },

    // Category: Functions (custom Blockly built-in)
    { kind: 'category', name: 'Functions', categorystyle: 'procedure_category', custom: 'PROCEDURE' },

    { kind: 'sep' },

    // ============= CC:Tweaked APIs =============

    // Category: Terminal
    {
      kind: 'category', name: 'Terminal', categorystyle: 'terminal_category',
      contents: [
        { kind: 'label', text: '--- Write & Clear ---' },
        { kind: 'block', type: 'term_write' },
        { kind: 'block', type: 'print_text' },
        { kind: 'block', type: 'term_clear' },
        { kind: 'block', type: 'term_clearLine' },
        { kind: 'block', type: 'term_scroll' },
        { kind: 'label', text: '--- Cursor ---' },
        { kind: 'block', type: 'term_setCursorPos' },
        { kind: 'block', type: 'term_setCursorBlink' },
        { kind: 'block', type: 'term_getCursorX' },
        { kind: 'block', type: 'term_getCursorY' },
        { kind: 'label', text: '--- Colors ---' },
        { kind: 'block', type: 'term_setTextColor' },
        { kind: 'block', type: 'term_setBgColor' },
        { kind: 'block', type: 'term_getTextColor' },
        { kind: 'block', type: 'term_getBgColor' },
        { kind: 'label', text: '--- Advanced ---' },
        { kind: 'block', type: 'term_blit' },
        { kind: 'block', type: 'term_getWidth' },
        { kind: 'block', type: 'term_getHeight' },
        { kind: 'block', type: 'term_isColor' },
      ],
    },

    // Category: Redstone
    {
      kind: 'category', name: 'Redstone', categorystyle: 'redstone_category',
      contents: [
        { kind: 'label', text: '--- Digital ---' },
        { kind: 'block', type: 'rs_setOutput' },
        { kind: 'block', type: 'rs_getInput' },
        { kind: 'block', type: 'rs_getOutput' },
        { kind: 'label', text: '--- Analog ---' },
        { kind: 'block', type: 'rs_setAnalogOutput' },
        { kind: 'block', type: 'rs_getAnalogInput' },
        { kind: 'block', type: 'rs_getAnalogOutput' },
        { kind: 'label', text: '--- Bundled ---' },
        { kind: 'block', type: 'rs_setBundledOutput' },
        { kind: 'block', type: 'rs_getBundledInput' },
        { kind: 'block', type: 'rs_testBundledInput' },
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

    // Category: HTTP
    {
      kind: 'category', name: 'HTTP', categorystyle: 'http_category',
      contents: [
        { kind: 'block', type: 'http_get' },
        { kind: 'block', type: 'http_postRequest' },
        { kind: 'block', type: 'http_checkURL' },
      ],
    },

    // Category: Peripheral
    {
      kind: 'category', name: 'Peripheral', categorystyle: 'peripheral_category',
      contents: [
        { kind: 'block', type: 'peripheral_wrap' },
        { kind: 'block', type: 'peripheral_find' },
        { kind: 'block', type: 'peripheral_isPresent' },
        { kind: 'block', type: 'peripheral_getType' },
        { kind: 'block', type: 'peripheral_getNames' },
        { kind: 'block', type: 'peripheral_getMethods' },
        { kind: 'block', type: 'peripheral_call' },
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

    // Category: OS
    {
      kind: 'category', name: 'OS / System', categorystyle: 'os_category',
      contents: [
        { kind: 'block', type: 'os_sleep' },
        { kind: 'block', type: 'sleep_secs' },
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
      ],
    },

    // Category: Rednet
    {
      kind: 'category', name: 'Rednet', categorystyle: 'rednet_category',
      contents: [
        { kind: 'block', type: 'rednet_open' },
        { kind: 'block', type: 'rednet_close' },
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

    // Category: TextUtils
    {
      kind: 'category', name: 'Text Utils', categorystyle: 'textutils_category',
      contents: [
        { kind: 'block', type: 'textutils_serialize' },
        { kind: 'block', type: 'textutils_unserialize' },
        { kind: 'block', type: 'textutils_serializeJSON' },
        { kind: 'block', type: 'textutils_unserializeJSON' },
        { kind: 'block', type: 'textutils_urlEncode' },
        { kind: 'block', type: 'textutils_slowPrint' },
        { kind: 'block', type: 'textutils_slowWrite' },
      ],
    },

    // Category: PaintUtils
    {
      kind: 'category', name: 'Paint Utils', categorystyle: 'paintutils_category',
      contents: [
        { kind: 'block', type: 'paint_drawPixel' },
        { kind: 'block', type: 'paint_drawLine' },
        { kind: 'block', type: 'paint_drawBox' },
        { kind: 'block', type: 'paint_drawFilledBox' },
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

    // Category: Settings
    {
      kind: 'category', name: 'Settings', categorystyle: 'settings_category',
      contents: [
        { kind: 'block', type: 'settings_get' },
        { kind: 'block', type: 'settings_set' },
        { kind: 'block', type: 'settings_unset' },
        { kind: 'block', type: 'settings_save' },
        { kind: 'block', type: 'settings_load' },
      ],
    },

    // Category: GPS
    {
      kind: 'category', name: 'GPS', categorystyle: 'gps_category',
      contents: [
        { kind: 'block', type: 'gps_locate' },
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

    { kind: 'sep' },

    // Category: Utility
    {
      kind: 'category', name: 'Utility', categorystyle: 'utility_category',
      contents: [
        { kind: 'block', type: 'print_text' },
        { kind: 'block', type: 'sleep_secs' },
        { kind: 'block', type: 'read_input' },
        { kind: 'label', text: '--- Conversion ---' },
        { kind: 'block', type: 'tonumber_val' },
        { kind: 'block', type: 'tostring_val' },
        { kind: 'block', type: 'type_of' },
        { kind: 'label', text: '--- Error Handling ---' },
        { kind: 'block', type: 'pcall_wrap' },
      ],
    },
  ],
};
