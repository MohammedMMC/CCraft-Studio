-- =============================================
-- CheckBox
-- =============================================

CheckBox = setmetatable({}, { __index = BaseObject })
CheckBox.__index = CheckBox

function CheckBox:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.checked = false

    return obj
end

function CheckBox:onClickEvent(checkBox, x, y)
    self.checked = not self.checked
end

function CheckBox:drawElement()
    local boxSize = math.min(self.width, self.height);
    local checkedIcon = self.checkIcon or 'x';

    self.monitor.setBackgroundColor(self.bgColor)

    for row = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x, self.y + row)
        self.monitor.write(string.rep(" ", self.width))
    end

    self.monitor.setTextColor(self.checkColor)
    self.monitor.setBackgroundColor(self.boxColor)

    for row = 0, boxSize - 1 do
        self.monitor.setCursorPos(self.x, self.y + row)
        self.monitor.write(string.rep(" ", boxSize))
    end

    self.monitor.setCursorPos(self.x + math.floor((boxSize - 1) / 2), self.y + math.floor((boxSize - 1) / 2))
    if self.checked then self.monitor.write(checkedIcon) end

    self.monitor.setTextColor(self.textColor)
    self.monitor.setBackgroundColor(self.bgColor)

    self.monitor.setCursorPos(self.x + boxSize + 1, self.y + math.floor(self.height / 2))
    self.monitor.write(self:alignText(self.text, (self.width - boxSize - 1), self.textAlign))
end
