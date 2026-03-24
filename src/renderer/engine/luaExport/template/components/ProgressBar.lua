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
    local progressWidth = math.floor(self.width / 100 * self.progress)
    local progressHeight = math.floor(self.height / 100 * self.progress)

    self.monitor.setBackgroundColor(self.progressColor)
    for j = 0, (self.orientation:match("^" .. "v") and progressHeight or self.height) - 1 do
        self.monitor.setCursorPos(self.x + (self.orientation == "hrtl" and self.width - progressWidth or 0),
            self.y + (self.orientation == "vbtt" and self.height - progressHeight or 0) + j)
        self.monitor.write(string.rep(" ", (self.orientation:match("^" .. "v") and self.width or progressWidth)))
    end

    -- Draw text
    if self.orientation:match("^" .. "v") then
        self.monitor.setCursorPos(self.x, self.y + math.floor(self.height / 2))
        self.monitor.setTextColor(self.fgColor)
        self.monitor.setBackgroundColor(50 <= self.progress and self.progressColor or self.bgColor)
        self.monitor.write(alignedText)
    else
        for i = 1, #alignedText do
            local char = alignedText:sub(i, i)
            self.monitor.setCursorPos(self.x + i - 1, self.y + math.floor(self.height / 2))
            self.monitor.setTextColor(self.fgColor)
            self.monitor.setBackgroundColor(
                (self.orientation == "hrtl"
                    and ((i - 1) >= (self.width - progressWidth))
                    or ((self.orientation ~= "hrtl") and ((i - 1) < progressWidth)))
                and self.progressColor or self.bgColor)
            self.monitor.write(char)
        end
    end
end
