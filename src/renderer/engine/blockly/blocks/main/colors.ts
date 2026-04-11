import { Block } from "../../blocksRegistery";
import { createColorField } from "../../ccBlocks";
import { GeneratorFunc, Order } from "../../luaGenerator";

export const colorsBlocks: Block = {
    'color_picker': {
        block: {
            init() {
                this.appendDummyInput('COLOR')
                    .appendField(createColorField(), 'COLOR');
                this.setOutput(true, "Color");
                this.setStyle('color_blocks');
                this.setTooltip('Color Picker block');
            },
        },
        generator: (block, gen) => {
            return [block.getFieldValue('COLOR') || 'white', Order.ATOMIC];
        }
    }
};