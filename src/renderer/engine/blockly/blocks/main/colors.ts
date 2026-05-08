import { CC_COLORS } from "@/models/CCColors";
import { Blocks } from "../../blocksRegistery";
import { createColorField } from "../../ccBlocks";
import { Order } from "../../luaGenerator";

export const colorsBlocks: Blocks = {
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
            return [Object.values(CC_COLORS).filter((color) => color.hex.toLowerCase() == block.getFieldValue('COLOR')?.toLowerCase())[0]?.luaName || CC_COLORS.gray.luaName, Order.ATOMIC];
        }
    }
};