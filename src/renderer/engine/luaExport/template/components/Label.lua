-- =============================================
-- Label
-- =============================================

Label = setmetatable({}, { __index = BaseObject })
Label.__index = Label

function Label:new(name, props)
    local obj = BaseObject.new(self, name, props)
    
    obj.type = "label"
    
    return obj
end

function Label:drawElement()
    term.setTextColor(self.fgColor)
    term.setBackgroundColor(self.bgColor)

    for row = 0, self.height - 1 do
        term.setCursorPos(self.x, self.y + row)
        term.write(string.rep(" ", self.width))
    end

    term.setCursorPos(self.x, self.y)
    term.write(self:alignText(self.text, self.width, self.textAlign))
end
