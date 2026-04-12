import * as Blockly from 'blockly';
import { Block } from "../../blocksRegistery";
import { Order } from "../../luaGenerator";
import { SIDES } from '../../ccBlocks';

export const diskBlocks: Block = {
    'disk_eject': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('eject disk')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('disk_blocks');
                this.setTooltip('Eject a disk from a disk drive on the given side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return `${gen.getIndent()}disk.eject("${side}")`;
        }
    },
    'disk_setLabel': {
        block: {
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
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            const label = gen.valueToCode(block, 'LABEL', Order.NONE);
            return `${gen.getIndent()}disk.setLabel("${side}", ${label})`;
        }
    },
    'disk_isPresent': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('disk in')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('?');
                this.setOutput(true, 'Boolean');
                this.setStyle('disk_blocks');
                this.setTooltip('Check if a disk is present in the drive on the given side');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.isPresent("${side}")`, Order.ATOMIC];
        }
    },
    'disk_hasData': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('disk')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('has data?');
                this.setOutput(true, 'Boolean');
                this.setStyle('disk_blocks');
                this.setTooltip('Check if a disk has data (is a floppy disk)');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.hasData("${side}")`, Order.ATOMIC];
        }
    },
    'disk_hasAudio': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('disk')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('has audio?');
                this.setOutput(true, 'Boolean');
                this.setStyle('disk_blocks');
                this.setTooltip('Check if a disk is a music disc');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.hasAudio("${side}")`, Order.ATOMIC];
        }
    },
    'disk_getLabel': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('disk')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('label');
                this.setOutput(true, 'String');
                this.setStyle('disk_blocks');
                this.setTooltip('Get the label of a disk');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.getLabel("${side}")`, Order.ATOMIC];
        }
    },
    'disk_getMountPath': {
        block: {
            init() {
                this.appendDummyInput()
                    .appendField('disk')
                    .appendField(new Blockly.FieldDropdown(SIDES), 'SIDE')
                    .appendField('mount path');
                this.setOutput(true, 'String');
                this.setStyle('disk_blocks');
                this.setTooltip('Get the mount path of a disk');
            },
        },
        generator: (block, gen) => {
            const side = block.getFieldValue('SIDE');
            return [`disk.getMountPath("${side}")`, Order.ATOMIC];
        }
    }
};