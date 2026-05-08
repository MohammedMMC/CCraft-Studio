import * as Blockly from 'blockly';
import { Blocks } from "../../blocksRegistery";
import { ELEMENTS } from '../../ccBlocks';
import { UI_ELEMENT_WITH_TEXT, UIElementType } from '@/models/UIElement';
import { useProjectStore } from '@/stores/projectStore';
import { sanitize } from '@/utils/luaHelpers';

const componentsEvents: Record<UIElementType, string[]> = {
    'button': ['clicked', 'focused', 'released'],
    'label': [],
    'container': [],
    'panel': [],
    'progressbar': ['progress_changed'],
    'slider': ['value_changed'],
    'checkbox': ['toggled', 'checked', 'unchecked'],
    'input': ['key_pressed', 'focused'],
};

function sharedComponentsEvents(compName: UIElementType): string[] {
    let eventsNames: string[] = [];

    if (UI_ELEMENT_WITH_TEXT.includes(compName)) {
        eventsNames.push('text_changed');
    }

    return eventsNames;
}


export const eventsBlocks: Blocks = {
    'event_components_events': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when')
                    .appendField(new Blockly.FieldDropdown(ELEMENTS), 'ELEMENT')
                    .appendField(new Blockly.FieldDropdown(function (this: Blockly.FieldDropdown) {
                        const elementName = this.getSourceBlock()?.getFieldValue('ELEMENT') || ELEMENTS()[0][0];
                        const element = useProjectStore.getState().getActiveScreen()?.uiElements.find(el => el.name === elementName);

                        const newOptions = elementName !== "(no elements)"
                            ? [
                                ...componentsEvents[element?.type as UIElementType]?.map(ev => [ev.replace(/_/g, ' '), ev]),
                                ...sharedComponentsEvents(element?.type as UIElementType)?.map(ev => [ev.replace(/_/g, ' '), ev])
                            ] as [string, string][]
                            : [];

                        return newOptions.length > 0 ? newOptions : [['(no events)', '']];
                    }), 'EVENT');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip(`Runs when the specified event occurs on the selected UI element`);
            },
            onchange(event) {
                if (event.type !== Blockly.Events.BLOCK_CHANGE) return;
                const eventField = this.getField('EVENT') as Blockly.FieldDropdown | null;
                const currentEventName = eventField?.getValue();
                if (typeof currentEventName !== 'string') return;

                // Update EVENT dropdown options
                const propOptions = eventField?.getOptions() || [];
                eventField?.setValue(propOptions.flat().includes(currentEventName) ? currentEventName : propOptions[0][1]);
            }
        },
        generator: (block, gen) => {
            const elName = block.getFieldValue('ELEMENT');
            const evName = block.getFieldValue('EVENT');
            const body = gen.statementToCode(block, 'DO');
            return `screen:getChild("${sanitize(elName)}").events["${evName}"] = function()\n${body}\nend`;
        }
    },
    'event_screen_load': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when this screen loads');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when this screen is first displayed (runs once)');
            },
        },
        generator: (block, gen) => {
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:screen_load]\n${body}\n-- [/EVENT:screen_load]`;
        }
    },
    'event_screen_update': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when this screen updates');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when this screen is updated');
            },
        },
        generator: (block, gen) => {
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:screen_update]\n${body}\n-- [/EVENT:screen_update]`;
        }
    },
    'event_key_press': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when key')
                    .appendField(new Blockly.FieldDropdown([
                        ['any', 'any'], ['enter', 'enter'], ['space', 'space'],
                        ['up', 'up'], ['down', 'down'], ['left', 'left'], ['right', 'right'],
                        ['backspace', 'backspace'], ['tab', 'tab'],
                        ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'],
                        ['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'],
                        ['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'],
                        ['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'],
                        ['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'],
                        ['z', 'z'],
                        ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                        ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['0', '0'],
                    ]), 'KEY')
                    .appendField('is pressed');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when a keyboard key is pressed');
            },
        },
        generator: (block, gen) => {
            const key = block.getFieldValue('KEY');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:key_press:${key}]\n${body}\n-- [/EVENT:key_press:${key}]`;
        }
    },
    'event_timer': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('Every')
                    .appendField(new Blockly.FieldNumber(1, 0.05), 'INTERVAL')
                    .appendField('seconds');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs repeatedly at a timed interval');
            },
        },
        generator: (block, gen) => {
            const interval = block.getFieldValue('INTERVAL');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:timer:${interval}]\n${body}\n-- [/EVENT:timer:${interval}]`;
        }
    },
    'event_redstone': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when redstone input changes');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when any redstone signal changes');
            },
        },
        generator: (block, gen) => {
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:redstone]\n${body}\n-- [/EVENT:redstone]`;
        }
    },
    'event_modem_message': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when modem receives message');
                this.appendDummyInput()
                    .setAlign(Blockly.inputs.Align.RIGHT)
                    .appendField('channel')
                    .appendField(new Blockly.FieldNumber(1, 0, 65535), 'CHANNEL');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when a modem message is received on the specified channel');
            },
        },
        generator: (block, gen) => {
            const ch = block.getFieldValue('CHANNEL');
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:modem_message:${ch}]\n${body}\n-- [/EVENT:modem_message:${ch}]`;
        }
    },
    'event_any': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('when any event occurs');
                this.appendStatementInput('DO')
                    .appendField("do");
                this.setStyle('events_blocks');
                this.setTooltip('Runs when any OS event occurs. Use os.pullEvent() inside to get event details.');
            },
        },
        generator: (block, gen) => {
            const body = gen.statementToCode(block, 'DO');
            return `-- [EVENT:any]\n${body}\n-- [/EVENT:any]`;
        }
    }
};