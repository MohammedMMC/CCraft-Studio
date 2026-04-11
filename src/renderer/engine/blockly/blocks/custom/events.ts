import { GeneratorFunc } from "../../luaGenerator";

export const eventsBlocksGenerators: Record<string, GeneratorFunc> = {
    'event_screen_load': (block, gen) => {
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:screen_load]\n${body}\n-- [/EVENT:screen_load]`;
    },
    'event_button_click': (block, gen) => {
        const btn = block.getFieldValue('BUTTON');
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:button_click:${btn}]\n${body}\n-- [/EVENT:button_click:${btn}]`;
    },
    'event_button_focus': (block, gen) => {
        const btn = block.getFieldValue('BUTTON');
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:button_focus:${btn}]\n${body}\n-- [/EVENT:button_focus:${btn}]`;
    },
    'event_button_release': (block, gen) => {
        const btn = block.getFieldValue('BUTTON');
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:button_release:${btn}]\n${body}\n-- [/EVENT:button_release:${btn}]`;
    },
    'event_key_press': (block, gen) => {
        const key = block.getFieldValue('KEY');
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:key_press:${key}]\n${body}\n-- [/EVENT:key_press:${key}]`;
    },
    'event_timer': (block, gen) => {
        const interval = block.getFieldValue('INTERVAL');
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:timer:${interval}]\n${body}\n-- [/EVENT:timer:${interval}]`;
    },
    'event_redstone': (block, gen) => {
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:redstone]\n${body}\n-- [/EVENT:redstone]`;
    },
    'event_modem_message': (block, gen) => {
        const ch = block.getFieldValue('CHANNEL');
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:modem_message:${ch}]\n${body}\n-- [/EVENT:modem_message:${ch}]`;
    },
    'event_any': (block, gen) => {
        const body = gen.statementToCode(block, 'DO');
        return `-- [EVENT:any]\n${body}\n-- [/EVENT:any]`;
    }
};