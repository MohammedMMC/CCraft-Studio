-- =============================================
-- Input
-- =============================================

Input = setmetatable({}, { __index = BaseObject })
Input.__index = Input

function Input:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.isFocused = false

    return obj
end

function Input:onClickEvent(x, y)
    self.isFocused = true

    if self.events["focused"] then
        self.events["focused"]()
    end
end

function Input:onkeyEvent(key)
    if not self.isFocused then return end
    local keyName = keys.getName(key)

    if key == keys.backspace then
        self.text = self.text:sub(1, -2)
    elseif key == keys.enter then
        self.isFocused = false
    end

    if self.events["key_pressed"] then
        self.events["key_pressed"]()
    end
end

function Input:onCharEvent(char)
    if not self.isFocused then return end

    self.text = self.text .. char
end

function Input:drawElement()
    self.monitor.setTextColor(#self.textArr <= 0 and self.placeholderColor or self.textColor)
    self.monitor.setBackgroundColor(self.bgColor)

    for row = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x, self.y + row)
        self.monitor.write(string.rep(" ", self.width))
    end

    self.monitor.setCursorPos(self.x, self.y)
    Screen.cPrint(self.monitor, #self.textArr <= 0 and self.placeholderArr or self.textArr, self.width, self.textAlign)

    if self.isFocused then
        local blinkPosX = self.x + math.min(#self.textArr, self.width - 1)

        if self.textAlign == "right" then
            blinkPosX = self.x + self.width - 1
        elseif self.textAlign == "center" then
            blinkPosX = self.x +
            math.min(#self.textArr + math.abs(math.floor((self.width - #self.textArr) / 2)), self.width - 1)
        end

        self.screen:setBlinking(true, blinkPosX, self.y)
    end
end
