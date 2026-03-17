-- =============================================
-- Button
-- =============================================

Button = setmetatable({}, { __index = BaseObject })
Button.__index = Button

function Button:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.type = "button"
    obj.isFocused = false

    return obj
end

function Button:drawElement()
    if not self:isVisible() then return end
    local fg = self.isFocused and self.focusTextColor or self.fgColor
    local bg = self.isFocused and self.focusBgColor or self.bgColor
    local text = self.text or ""
    local align = self.textAlign or "center"

    term.setTextColor(fg)
    term.setBackgroundColor(bg)

    for row = 0, self.height - 1 do
        term.setCursorPos(self.x, self.y + row)
        term.write(string.rep(" ", self.width))
    end

    local midY = self.y + math.floor(self.height / 2)
    term.setCursorPos(self.x, midY)
    term.write(self:alignText(text, self.width, align))
end
