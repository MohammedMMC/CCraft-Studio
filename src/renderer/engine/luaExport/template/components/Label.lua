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
    self.monitor.setTextColor(self.fgColor)
    self.monitor.setBackgroundColor(self.bgColor)

    for row = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x, self.y + row)
        self.monitor.write(string.rep(" ", self.width))
    end

    self.monitor.setCursorPos(self.x, self.y)
    self.monitor.write(self:alignText(self.text, self.width, self.textAlign))
end
