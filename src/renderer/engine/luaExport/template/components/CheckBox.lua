-- =============================================
-- CheckBox
-- =============================================

CheckBox = setmetatable({}, { __index = BaseObject })
CheckBox.__index = CheckBox

function CheckBox:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.type = "checkbox"
    obj.checked = false

    return obj
end

function CheckBox:onClickEvent(checkBox, x, y)
    self.checked = not self.checked
end

function CheckBox:drawElement()
    local boxSize = math.min(self.width, self.height);
    local checkedIcon = self.checkIcon or 'x';

    term.setBackgroundColor(self.bgColor)

    for row = 0, self.height - 1 do
        term.setCursorPos(self.x, self.y + row)
        term.write(string.rep(" ", self.width))
    end

    term.setTextColor(self.checkColor)
    term.setBackgroundColor(self.boxColor)

    for row = 0, boxSize - 1 do
        term.setCursorPos(self.x, self.y + row)
        term.write(string.rep(" ", boxSize))
    end

    term.setCursorPos(self.x + math.floor((boxSize - 1) / 2), self.y + math.floor((boxSize - 1) / 2))
    if self.checked then term.write(checkedIcon) end

    term.setTextColor(self.textColor)
    term.setBackgroundColor(self.bgColor)

    term.setCursorPos(self.x + boxSize + 1, self.y + math.floor(self.height / 2))
    term.write(self:alignText(self.text, (self.width - boxSize - 1), self.textAlign))
end
