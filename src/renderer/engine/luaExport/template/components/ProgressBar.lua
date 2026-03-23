-- =============================================
-- ProgressBar
-- =============================================

ProgressBar = setmetatable({}, { __index = BaseObject })
ProgressBar.__index = ProgressBar

function ProgressBar:new(name, props)
    local obj = BaseObject.new(self, name, props)
    
    return obj
end

function ProgressBar:setProgress(progress)
    self.progress = progress
end

function ProgressBar:drawElement()
    local alignedText = self:alignText(self.text, self.width, self.textAlign)

    -- Draw background
    self.monitor.setBackgroundColor(self.bgColor)
    for j = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x, self.y + j)
        self.monitor.write(string.rep(" ", self.width))
    end

    -- Draw progress
    if self.progress then
        local progressWidth = math.floor(self.width / 100 * self.progress)
        self.monitor.setBackgroundColor(self.progressColor)
        for j = 0, self.height - 1 do
            self.monitor.setCursorPos(self.x, self.y + j)
            self.monitor.write(string.rep(" ", progressWidth))
        end
    end

    -- Draw text
    for i = 1, #alignedText do
        local char = alignedText:sub(i, i)
        self.monitor.setCursorPos(self.x + i - 1, self.y + math.floor(self.height / 2))
        if i <= math.floor(self.width / 100 * self.progress) then
            self.monitor.setTextColor(self.fgColor)
            self.monitor.setBackgroundColor(self.progressColor)
        else
            self.monitor.setTextColor(self.fgColor)
            self.monitor.setBackgroundColor(self.bgColor)
        end
        self.monitor.write(char)
    end
end
