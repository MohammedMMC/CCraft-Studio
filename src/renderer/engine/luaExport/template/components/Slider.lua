-- =============================================
-- Slider
-- =============================================
Slider = setmetatable({}, {
    __index = BaseObject
})
Slider.__index = Slider

function Slider:new(name, props)
    local obj = BaseObject.new(self, name, props)

    obj.type = "slider"

    return obj
end

function Slider:drawElement()
    local percentValue = math.floor(((self.value - self.from) * 100 / (self.to - self.from)) + 0.5);

    term.setCursorPos(self.x, self.y)
    term.setBackgroundColor(self.bgColor)
    for j = 0, self.height - 1 do
        term.setCursorPos(self.x, self.y + j)
        term.write(string.rep(" ", self.width))
    end

    if self.orientation:match("^" .. "v") then
        term.setBackgroundColor(self.filledColor)
        for j = 0, math.floor(self.height * percentValue / 100 + 0.5) - 1 do
            term.setCursorPos(self.x, self.y + (self.orientation == "vbtt" and math.floor(self.height * (100 - percentValue) / 100 + 0.5) or 0) + j)
            term.write(string.rep(" ", self.width))
        end

        term.setCursorPos(self.x, self.y +
            math.floor((self.height - 1) * (self.orientation == "vbtt" and 100 - percentValue or percentValue) / 100 +
                0.5))
        term.setBackgroundColor(self.handleColor)
        term.write(string.rep(" ", self.width))
    else
        term.setBackgroundColor(self.filledColor)
        for j = 0, self.height - 1 do
            term.setCursorPos(
                self.x + (self.orientation == "hrtl" and math.floor(self.width * (100 - percentValue) / 100 + 0.5) or 0),
                self.y + j)
            term.write(string.rep(" ", math.floor(self.width * percentValue / 100 + 0.5)))
        end

        term.setBackgroundColor(self.handleColor)
        for j = 0, self.height - 1 do
            term.setCursorPos(
                self.x +
                math.floor((self.width - 1) * (self.orientation == "hrtl" and 100 - percentValue or percentValue) / 100 +
                    0.5),
                self.y + j)
            term.write(string.rep(" ", 1))
        end
    end
end
