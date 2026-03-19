-- =============================================
-- Slider
-- =============================================

Slider = setmetatable({}, { __index = BaseObject })
Slider.__index = Slider

function Slider:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.type = "slider"

    return obj
end

function Slider:drawElement()
    local percentValue = math.floor(((self.value - self.from) * 100 / (self.to - self.from)) + 0.5);

    if self.orientation:match("^" .. "v") then
        --      Filled Part
        -- if self.width > 1 then
        --     for i = 0, (self.orientation == "vbtt" and (self.height - math.floor((self.height / 100 * (100 - percentValue)) + 0.5)) or math.floor((self.height / 100 * percentValue) + 0.5)) - 1 do
        --         term.setCursorPos(self.x,
        --             self.y +
        --             (self.orientation == "vbtt" and math.floor((self.height / 100 * (100 - percentValue)) + 0.5) or 0) +
        --             i)
        --         term.setTextColor(self.filledColor)
        --         term.setBackgroundColor(self.bgColor)
        --         term.write("\138");
        --     end
        --     for iw = 0, self.width - 2 do
        --         for i = 0, (self.orientation == "vbtt" and self.height - math.floor((self.height / 100 * (100 - percentValue)) + 0.5) or math.floor((self.height / 100 * percentValue) + 0.5)) - 1 do
        --             term.setCursorPos(self.x + iw + 1,
        --                 self.y +
        --                 (self.orientation == "vbtt" and math.floor((self.height / 100 * (100 - percentValue)) + 0.5) or 0) +
        --                 i)
        --             term.setTextColor(self.filledColor)
        --             term.setBackgroundColor(self.bgColor)
        --             term.write("\138");
        --         end
        --     end
        --     for i = 0, (self.orientation == "vbtt" and self.height - math.floor(self.height / 100 * (100 - percentValue)) or math.floor(self.height / 100 * percentValue)) - 1 do
        --         term.setCursorPos(self.x + self.width - 1,
        --             self.y + (self.orientation == "vbtt" and math.floor(self.height / 100 * (100 - percentValue)) or 0) +
        --             i)
        --         term.setTextColor(self.filledColor)
        --         term.setBackgroundColor(self.bgColor)
        --         term.write("\149");
        --     end
        -- else
        --     for i = 0, (self.orientation == "vbtt" and (self.height - math.floor((self.height / 100 * (100 - percentValue)) + 0.5)) or math.floor((self.height / 100 * percentValue) + 0.5)) - 1 do
        --         term.setCursorPos(self.x,
        --             self.y +
        --             (self.orientation == "vbtt" and math.floor((self.height / 100 * (100 - percentValue)) + 0.5) or 0) +
        --             i)
        --         term.setTextColor(self.filledColor)
        --         term.setBackgroundColor(self.bgColor)
        --         term.write(self:alignText(self.style == "thick" and 'F' or '|', self.width, 'center'));
        --     end
        -- end

        --     // UnFilled Part
        --     if (width > 1) {
        --       for (let i = 0; i < Math.round(height / 100 * (100 - percentValue)); i++) {
        --         buffer.writeText(x, y + (el.orientation == "vbtt" ? 0 : Math.round(height / 100 * percentValue)) + i, TELETEXT_USED_CHARS.rightDash, el.sliderColor, el.bgColor);
        --       }
        --       for (let iw = 0; iw < width - 2; iw++) {

        --         for (let i = 0; i < Math.round(height / 100 * (100 - percentValue)); i++) {
        --           buffer.writeText(x + iw + 1, y + (el.orientation == "vbtt" ? 0 : Math.round(height / 100 * percentValue)) + i, TELETEXT_USED_CHARS.full, el.sliderColor, el.bgColor);
        --         }

        --       }
        --       for (let i = 0; i < Math.round(height / 100 * (100 - percentValue)); i++) {
        --         buffer.writeText(x + width - 1, y + (el.orientation == "vbtt" ? 0 : Math.round(height / 100 * percentValue)) + i, TELETEXT_USED_CHARS.leftDash, el.sliderColor, el.bgColor);
        --       }
        --     } else {
        --       for (let i = 0; i < height - Math.round(height / 100 * percentValue); i++) {
        --         buffer.writeText(x, y + (el.orientation == "vbtt" ? 0 : Math.round(height / 100 * percentValue)) + i, alignText(el.style === "thick" ? TELETEXT_USED_CHARS.full : '|', width, 'center'), el.sliderColor, el.bgColor);
        --       }
        --     }
        --     // Handle
        --     buffer.fillRect(x, y + (el.orientation == "vbtt" ? height - Math.round((height - 1) / 100 * percentValue) - 1 : Math.round((height - 1) / 100 * percentValue)), width, 1, ' ', el.handleColor, el.handleColor);
    else
        --     // Filled Part
        if self.height > 1 then
            --       buffer.writeText(
            --         x + (el.orientation === "hrtl" ? Math.round(width / 100 * (100 - percentValue)) : 0), y,
            --         TELETEXT_USED_CHARS[el.style == "thick" ? "bottomBigDash" : "bottomDash"].repeat(width - Math.round(width / 100 * (100 - percentValue))),
            --         el.filledColor, el.bgColor
            --       );
            --       for (let i = 1; i <= height - 2; i++) {
            --         buffer.writeText(
            --           x + (el.orientation === "hrtl" ? Math.round(width / 100 * (100 - percentValue)) : 0), y + i,
            --           TELETEXT_USED_CHARS.full.repeat(width - Math.round(width / 100 * (100 - percentValue))),
            --           el.filledColor, el.bgColor
            --         );
            --       }
            --       buffer.writeText(
            --         x + (el.orientation === "hrtl" ? Math.round(width / 100 * (100 - percentValue)) : 0), y + height - 1,
            --         TELETEXT_USED_CHARS[el.style == "thick" ? "topBigDash" : "topDash"].repeat(width - Math.round(width / 100 * (100 - percentValue))),
            --         el.filledColor, el.bgColor
            --       );
        else
            term.setCursorPos(self.x + (self.orientation == "hrtl" and math.round(self.width / 100 * (100 - percentValue)) or 0),
                self.y + math.floor(self.height / 2))
            term.setTextColor(self.filledColor)
            term.setBackgroundColor(self.bgColor)
            term.write(string.rep("\140", math.floor((self.width / 100 * percentValue) + 0.5)));
        end

        --     // UnFilled Part
        --     if (height > 1) {
        --       buffer.writeText(
        --         x + (el.orientation === "hrtl" ? 0 : Math.round(width / 100 * percentValue)), y,
        --         TELETEXT_USED_CHARS[el.style == "thick" ? "bottomBigDash" : "bottomDash"].repeat(width - Math.round(width / 100 * percentValue)),
        --         el.sliderColor, el.bgColor
        --       );
        --       for (let i = 1; i <= height - 2; i++) {
        --         buffer.writeText(
        --           x + (el.orientation === "hrtl" ? 0 : Math.round(width / 100 * percentValue)), y + i,
        --           TELETEXT_USED_CHARS.full.repeat(width - Math.round(width / 100 * percentValue)),
        --           el.sliderColor, el.bgColor
        --         );
        --       }
        --       buffer.writeText(
        --         x + (el.orientation === "hrtl" ? 0 : Math.round(width / 100 * percentValue)), y + height - 1,
        --         TELETEXT_USED_CHARS[el.style == "thick" ? "topBigDash" : "topDash"].repeat(width - Math.round(width / 100 * percentValue)),
        --         el.sliderColor, el.bgColor
        --       );
        --     } else {
        --       buffer.writeText(
        --         x + (el.orientation === "hrtl" ? 0 : Math.round(width / 100 * percentValue)), y + Math.floor(height / 2),
        --         TELETEXT_USED_CHARS.middleDash.repeat(width - Math.round(width / 100 * percentValue)),
        --         el.sliderColor, el.bgColor
        --       );
        --     }

        --     // Handle
        --     if (el.style === "thick" || height <= 1) {
        --       buffer.fillRect(x + (el.orientation === "hrtl" ? width - Math.round((width - 1) / 100 * percentValue) - 1 : Math.round((width - 1) / 100 * percentValue)), y, 1, height, ' ', el.handleColor, el.handleColor);
        --     } else {
        --       buffer.writeText(
        --         x + (el.orientation === "hrtl" ? width - Math.round((width - 1) / 100 * percentValue) - 1 : Math.round((width - 1) / 100 * percentValue)), y,
        --         TELETEXT_USED_CHARS.bottomBigDash,
        --         el.handleColor, el.bgColor
        --       );
        --       for (let i = 1; i <= height - 2; i++) {
        --         buffer.writeText(
        --           x + (el.orientation === "hrtl" ? width - Math.round((width - 1) / 100 * percentValue) - 1 : Math.round((width - 1) / 100 * percentValue)), y + i,
        --           TELETEXT_USED_CHARS.full,
        --           el.handleColor, el.bgColor
        --         );
        --       }
        --       buffer.writeText(
        --         x + (el.orientation === "hrtl" ? width - Math.round((width - 1) / 100 * percentValue) - 1 : Math.round((width - 1) / 100 * percentValue)), y + height - 1,
        --         TELETEXT_USED_CHARS.topBigDash,
        --         el.handleColor, el.bgColor
        --       );
        --     }
    end
end
