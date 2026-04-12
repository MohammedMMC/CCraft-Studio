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
    if(self.events["button_click"]) then
        self.events["button_click"](x, y)
    end
    if(self.events["button_focus"]) then
        self.events["button_focus"](x, y)
    end
end

function Button:onReleaseEvent(x, y)
    self.isFocused = false
    if(self.events["button_release"]) then
        self.events["button_release"](x, y)
    end
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
