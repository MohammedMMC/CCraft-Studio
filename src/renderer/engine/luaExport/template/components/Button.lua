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

function Button:checkTouch(button, x, y)
    if not self:isVisible() then return false end

    return x >= self.x and x < self.x + self.width and y >= self.y and y < self.y + self.height
end

function Button:onClickEvent(button, x, y)
    self.isFocused = true
    local h = handlers[currentScreen]
    if h and h.onButtonFocus[self.name] then
        h.onButtonFocus[self.name](mx, my, button)
    end
    if h and h.onButtonClick[self.name] then
        h.onButtonClick[self.name](mx, my, button)
    end
end

function Button:onReleaseEvent(button, x, y)
    self.isFocused = false
    local h = handlers[currentScreen]
    if h and h.onButtonRelease[self.name] then
        h.onButtonRelease[self.name](mx, my, button)
    end
end

function Button:drawElement()
    term.setTextColor(self.isFocused and self.focusTextColor or self.fgColor)
    term.setBackgroundColor(self.isFocused and self.focusBgColor or self.bgColor)

    for row = 0, self.height - 1 do
        term.setCursorPos(self.x, self.y + row)
        term.write(string.rep(" ", self.width))
    end

    term.setCursorPos(self.x, self.y + math.floor(self.height / 2))
    term.write(self:alignText(self.text, self.width, self.textAlign))
end
