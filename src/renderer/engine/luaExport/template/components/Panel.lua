-- =============================================
-- Panel
-- =============================================

Panel = setmetatable({}, { __index = BaseObject })
Panel.__index = Panel

function Panel:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.children = {}

    return obj
end

function Panel:addChild(child)
    table.insert(self.children, child)
end

function Panel:drawElement()
    local alignedTextArr = BaseObject.alignText(self.textArr, self.width, self.textAlign)
    local trimStart = BaseObject.trimStartArr(alignedTextArr)
    local trimEnd = BaseObject.trimEndArr(alignedTextArr)

    local lead = #alignedTextArr - #trimStart
    local trail = #alignedTextArr - #trimEnd
    local textsp = { lead, trail }

    local plus2 = self.width < (#self.textArr + 4) and 0 or 2

    local textpos
    if textsp[2] == 0 then
        textpos = lead - 4 + (lead == 4 and 1 or 0) + (plus2 == 0 and 3 or 0) + (lead == 5 and 1 or 0)
    else
        if lead == 0 then
            textpos = ((self.width == (plus2 + (trail == 5 and 1 or 0) + #self.textArr + 2)) and 1 or 0)
            if textpos == 0 then
                textpos = plus2 ~= 0 and plus2 or 1
            end
        else
            textpos = lead - (plus2 == 2 and 1 or 0)
        end
    end

    self.monitor.setBackgroundColor(self.titleBgColor)
    self.monitor.setTextColor(self.textColor)

    local titleArr = BaseObject.trimStartArr(trimEnd)
    if plus2 == 2 then
        local result = { " " }
        for _, token in ipairs(titleArr) do
            result[#result + 1] = token
        end
        result[#result + 1] = " "
        titleArr = result
    end

    self.monitor.setCursorPos(self.x + textpos, self.y)
    Screen.cPrint(self.monitor, titleArr)

    self.monitor.setBackgroundColor(self.borderColor)
    self.monitor.setTextColor(self.textColor)
    self.monitor.setCursorPos(self.x, self.y)
    self.monitor.write(string.rep(" ", textpos))

    local rightStart = self.x + (textpos + #self.textArr + 2) + ((textsp[1] ~= 2 and plus2 == 0) and -2 or 0)
    local rightWidth = self.width - (textpos + #self.textArr + 2) + ((textsp[1] ~= 2 and plus2 == 0) and 1 or 0)

    self.monitor.setCursorPos(rightStart, self.y)
    self.monitor.write(string.rep(" ", rightWidth))

    self.monitor.setCursorPos(self.x, self.y + self.height - 1)
    self.monitor.write(string.rep(" ", self.width))

    for i = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x, self.y + i)
        self.monitor.write(" ")
    end

    for i = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x + self.width - 1, self.y + i)
        self.monitor.write(" ")
    end

    if self.bgColor and self.width > 2 and self.height > 2 then
        self.monitor.setBackgroundColor(self.bgColor)
        for row = 1, self.height - 2 do
            self.monitor.setCursorPos(self.x + 1, self.y + row)
            self.monitor.write(string.rep(" ", self.width - 2))
        end
    end
end
