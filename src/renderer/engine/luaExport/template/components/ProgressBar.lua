-- =============================================
-- ProgressBar
-- =============================================

ProgressBar = setmetatable({}, { __index = BaseObject })
ProgressBar.__index = ProgressBar

function ProgressBar:new(name, props)
    local obj = BaseObject.new(self, name, props)
    
    obj.type = "progressbar"

    return obj
end

function ProgressBar:drawElement()
    if not self:isVisible() then return end

    local alignedText = self:alignText(self.text, self.width, self.textAlign)

    -- Draw background
    term.setBackgroundColor(self.bgColor)
    for j = 0, self.height - 1 do
        term.setCursorPos(self.x, self.y + j)
        term.write(string.rep(" ", self.width))
    end

    -- Draw progress
    if self.progress then
        local progressWidth = math.floor(self.width / 100 * self.progress)
        term.setBackgroundColor(self.progressColor)
        for j = 0, self.height - 1 do
            term.setCursorPos(self.x, self.y + j)
            term.write(string.rep(" ", progressWidth))
        end
    end

    -- Draw text
    for i = 1, #alignedText do
        local char = alignedText:sub(i, i)
        term.setCursorPos(self.x + i - 1, self.y + math.floor(self.height / 2))
        if i <= math.floor(self.width / 100 * self.progress) then
            term.setTextColor(self.fgColor)
            term.setBackgroundColor(self.progressColor)
        else
            term.setTextColor(self.fgColor)
            term.setBackgroundColor(self.bgColor)
        end
        term.write(char)
    end
end
