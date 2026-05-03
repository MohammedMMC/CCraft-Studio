import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";
import { SIDES } from '../../ccBlocks';

export const diskBlocks: Block = {
    'disk_eject': {
        block: {
            init() {
                this.appendValueInput('DISK').setCheck('String')
                    .appendField('eject disk');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('disk_blocks');
                this.setTooltip('Eject a disk from a disk drive on the given side');
            },
        },
        generator: (block, gen) => {
            const disk = gen.valueToCode(block, 'DISK', Order.NONE);
            return `${gen.getIndent()}disk.eject(${disk})`;
        }
    },
    'disk_setLabel': {
        block: {
            init() {
                this.appendValueInput('DISK').setCheck('String')
                    .appendField('set disk');
                this.appendValueInput('LABEL').setCheck(['String', 'Null'])
                    .appendField('label to');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('disk_blocks');
                this.setInputsInline(true);
                this.setTooltip('Set the label of a disk in a disk drive');
            },
        },
        generator: (block, gen) => {
            const disk = gen.valueToCode(block, 'DISK', Order.NONE);
            const label = gen.valueToCode(block, 'LABEL', Order.NONE);
            return `${gen.getIndent()}disk.setLabel(${disk}, ${label})`;
        }
    },
    'disk_isPresent': {
        block: {
            init() {
                this.appendValueInput('DISK').setCheck('String')
                    .appendField('is disk present?');
                this.setOutput(true, 'Boolean');
                this.setStyle('disk_blocks');
                this.setTooltip('Checks whether any item at all is in the disk drive');
            },
        },
        generator: (block, gen) => {
            const disk = gen.valueToCode(block, 'DISK', Order.NONE);
            return [`disk.isPresent(${disk})`, Order.ATOMIC];
        }
    },
    'disk_hasData': {
        block: {
            init() {
                this.appendValueInput('DISK').setCheck('String')
                    .appendField('disk has data?')
                this.setOutput(true, 'Boolean');
                this.setStyle('disk_blocks');
                this.setTooltip('Check whether the current disk provides a mount');
            },
        },
        generator: (block, gen) => {
            const disk = gen.valueToCode(block, 'DISK', Order.NONE);
            return [`disk.hasData(${disk})`, Order.ATOMIC];
        }
    },
    'disk_hasAudio': {
        block: {
            init() {
                this.appendValueInput('DISK').setCheck('String')
                    .appendField('disk has audio?')
                this.setOutput(true, 'Boolean');
                this.setStyle('disk_blocks');
                this.setTooltip('Check if a disk is a music disc');
            },
        },
        generator: (block, gen) => {
            const disk = gen.valueToCode(block, 'DISK', Order.NONE);
            return [`disk.hasAudio(${disk})`, Order.ATOMIC];
        }
    },
    'disk_getLabel': {
        block: {
            init() {
                this.appendValueInput('DISK').setCheck('String')
                    .appendField('get disk label');
                this.setOutput(true, ['String', 'Null']);
                this.setStyle('disk_blocks');
                this.setTooltip('Get the label of a disk');
            },
        },
        generator: (block, gen) => {
            const disk = gen.valueToCode(block, 'DISK', Order.NONE);
            return [`disk.getLabel(${disk})`, Order.ATOMIC];
        }
    },
    'disk_getMountPath': {
        block: {
            init() {
                this.appendValueInput('DISK').setCheck('String')
                    .appendField('get disk mount path');
                this.setOutput(true, ['String', 'Null']);
                this.setStyle('disk_blocks');
                this.setTooltip('Get the mount path of a disk');
            },
        },
        generator: (block, gen) => {
            const disk = gen.valueToCode(block, 'DISK', Order.NONE);
            return [`disk.getMountPath(${disk})`, Order.ATOMIC];
        }
    }
};