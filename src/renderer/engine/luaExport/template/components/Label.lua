-- =============================================
-- Label
-- =============================================

Label = setmetatable({}, { __index = BaseObject })
Label.__index = Label

function Label:new(name, props)
    local obj = BaseObject.new(self, name, props)

    return obj
end

function Label:drawElement()
    self.monitor.setTextColor(self.textColor)
    self.monitor.setBackgroundColor(self.bgColor)

    for row = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x, self.y + row)
        self.monitor.write(string.rep(" ", self.width))
    end

    self.monitor.setCursorPos(self.x, self.y)
    Screen.cPrint(self.monitor, self.textArr, self.width, self.textAlign)
end
