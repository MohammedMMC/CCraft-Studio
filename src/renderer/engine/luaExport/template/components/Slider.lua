-- =============================================
-- Slider
-- =============================================

Slider = setmetatable({}, { __index = BaseObject })
Slider.__index = Slider

function Slider:new(name, props)
    local obj = BaseObject.new(self, name, props)

    return obj
end

function Slider:getValue() return self.value end

function Slider:setValue(val)
    self.value = math.max(self.from, math.min(self.to, math.floor(val + 0.5)))
end

function Slider:onDragEvent(x, y)
    self:setValue(self.from
        + (self.to - self.from)
        * ((self.orientation:match("^" .. "v")
            and (self.orientation == "vbtt" and 100 - math.floor((y - self.y) * 100 / (self.height - 1) + 0.5) or math.floor((y - self.y) * 100 / (self.height - 1) + 0.5))
            or (self.orientation == "hrtl" and 100 - math.floor((x - self.x) * 100 / (self.width - 1) + 0.5) or math.floor((x - self.x) * 100 / (self.width - 1) + 0.5))) / 100))
end

function Slider:drawElement()
    local percentValue = math.floor(((self.value - self.from) * 100 / (self.to - self.from)) + 0.5);

    self.monitor.setCursorPos(self.x, self.y)
    self.monitor.setBackgroundColor(self.bgColor)
    for j = 0, self.height - 1 do
        self.monitor.setCursorPos(self.x, self.y + j)
        self.monitor.write(string.rep(" ", self.width))
    end

    if self.orientation:match("^" .. "v") then
        self.monitor.setBackgroundColor(self.filledColor)
        for j = 0, math.floor(self.height * percentValue / 100 + 0.5) - 1 do
            self.monitor.setCursorPos(self.x,
                self.y + (self.orientation == "vbtt" and math.floor(self.height * (100 - percentValue) / 100 + 0.5) or 0) +
                j)
            self.monitor.write(string.rep(" ", self.width))
        end

        self.monitor.setCursorPos(self.x, self.y +
            math.floor((self.height - 1) * (self.orientation == "vbtt" and 100 - percentValue or percentValue) / 100 +
                0.5))
        self.monitor.setBackgroundColor(self.handleColor)
        self.monitor.write(string.rep(" ", self.width))
    else
        self.monitor.setBackgroundColor(self.filledColor)
        for j = 0, self.height - 1 do
            self.monitor.setCursorPos(
                self.x + (self.orientation == "hrtl" and math.floor(self.width * (100 - percentValue) / 100 + 0.5) or 0),
                self.y + j)
            self.monitor.write(string.rep(" ", math.floor(self.width * percentValue / 100 + 0.5)))
        end

        self.monitor.setBackgroundColor(self.handleColor)
        for j = 0, self.height - 1 do
            self.monitor.setCursorPos(
                self.x +
                math.floor((self.width - 1) * (self.orientation == "hrtl" and 100 - percentValue or percentValue) / 100 +
                    0.5),
                self.y + j)
            self.monitor.write(string.rep(" ", 1))
        end
    end
end
