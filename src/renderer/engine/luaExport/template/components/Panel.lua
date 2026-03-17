-- =============================================
-- Panel
-- =============================================

Panel = setmetatable({}, { __index = BaseObject })
Panel.__index = Panel

function Panel:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.type = "panel"
    obj.children = {}
    
    return obj
end

function Panel:addChild(child)
    table.insert(self.children, child)
end

function Panel:drawElement()
    local alignedText = self:alignText(self.text, self.width, self.textAlign)
    local lead = #(alignedText:match("^%s*") or "")
    local trail = #(alignedText:match("%s*$") or "")
    local textsp = { lead, trail }

    local plus2 = self.width < (#self.text + 4) and 0 or 2

    local textpos
    if textsp[2] == 0 then
        textpos = lead - 4 + (lead == 4 and 1 or 0) + (plus2 == 0 and 3 or 0) + (lead == 5 and 1 or 0)
    else
        if lead == 0 then
            textpos = ((self.width == (plus2 + (trail == 5 and 1 or 0) + #self.text + 2)) and 1 or 0)
            if textpos == 0 then
                textpos = plus2 ~= 0 and plus2 or 1
            end
        else
            textpos = lead - (plus2 == 2 and 1 or 0)
        end
    end

    term.setBackgroundColor(self.titleBgColor)
    term.setTextColor(self.fgColor)

    local title = self.text:match("^%s*(.-)%s*$")
    if plus2 == 2 then
        title = " " .. title .. " "
    end

    term.setCursorPos(self.x + textpos, self.y)
    term.write(title)

    term.setBackgroundColor(self.borderColor)
    term.setTextColor(self.fgColor)
    term.setCursorPos(self.x, self.y)
    term.write(string.rep(" ", textpos))

    local rightStart = self.x + (textpos + #self.text + 2) + ((textsp[1] ~= 2 and plus2 == 0) and -2 or 0)
    local rightWidth = self.width - (textpos + #self.text + 2) + ((textsp[1] ~= 2 and plus2 == 0) and 1 or 0)

    term.setCursorPos(rightStart, self.y)
    term.write(string.rep(" ", rightWidth))

    term.setCursorPos(self.x, self.y + self.height - 1)
    term.write(string.rep(" ", self.width))

    for i = 0, self.height - 1 do
        term.setCursorPos(self.x, self.y + i)
        term.write(" ")
    end

    for i = 0, self.height - 1 do
        term.setCursorPos(self.x + self.width - 1, self.y + i)
        term.write(" ")
    end

    if self.bgColor and self.width > 2 and self.height > 2 then
        term.setBackgroundColor(self.bgColor)
        for row = 1, self.height - 2 do
            term.setCursorPos(self.x + 1, self.y + row)
            term.write(string.rep(" ", self.width - 2))
        end
    end
end
