-- =============================================
-- Button
-- =============================================

Button = setmetatable({}, { __index = BaseObject })
Button.__index = Button

function Button:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.isFocused = false

    return obj
end

function Button:onClickEvent(x, y)
    self.isFocused = true
    -- local h = handlers[currentScreen]
    -- if h and h.onButtonFocus[self.name] then
    --     h.onButtonFocus[self.name](mx, my, button)
    -- end
    -- if h and h.onButtonClick[self.name] then
    --     h.onButtonClick[self.name](mx, my, button)
    -- end
end

function Button:onReleaseEvent(x, y)
    self.isFocused = false
    -- local h = handlers[currentScreen]
    -- if h and h.onButtonRelease[self.name] then
    --     h.onButtonRelease[self.name](mx, my, button)
    -- end
end

function Button:drawElement()
    self.monitor.setTextColor(self.isFocused and self.focusTextColor or self.textColor)
    self.monitor.setBackgroundColor(self.isFocused and self.focusBgColor or self.bgColor)

    for row = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x, self.y + row)
        self.monitor.write(string.rep(" ", self.width))
    end

    self.monitor.setCursorPos(self.x, self.y + math.floor(self.height / 2))
    Screen.cPrint(self.monitor, self.textArr, self.width, self.textAlign)
end
