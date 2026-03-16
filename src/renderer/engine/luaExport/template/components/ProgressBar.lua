-- =============================================
-- ProgressBar
-- =============================================

ProgressBar = setmetatable({}, { __index = BaseObject })
ProgressBar.__index = ProgressBar

function ProgressBar:new(name, props)
    local obj = BaseObject.new(self, name)
    obj.x = props.x
    obj.y = props.y
    obj.width = props.width
    obj.height = props.height
    obj.widthUnit = props.widthUnit
    obj.heightUnit = props.heightUnit
    obj.rawWidth = props.rawWidth
    obj.rawHeight = props.rawHeight
    obj.text = props.text or ""
    obj.textAlign = props.textAlign or "left"
    obj.bgColor = props.bgColor
    obj.fgColor = props.fgColor
    obj.progressColor = props.progressColor
    obj.progress = props.progress
    obj.visible = props.visible
    obj.zIndex = props.zIndex
    obj.type = props.type
    return obj
end

function ProgressBar:draw()
    if not self:isVisible() then return end
    local x = self:prop("x")
    local y = self:prop("y")
    local width = self:prop("width")
    local height = self:prop("height")
    local fg = self:prop("fgColor")
    local bg = self:prop("bgColor")
    local progressColor = self:prop("progressColor")
    local progress = self:prop("progress")
    local text = self:prop("text") or ""
    local align = self:prop("textAlign") or "left"
    local alignedText = self:alignText(text, width, align)

    -- Draw background
    term.setBackgroundColor(bg)
    for j = 0, height - 1 do
        term.setCursorPos(x, y + j)
        term.write(string.rep(" ", width))
    end

    -- Draw progress
    if self:prop("progress") then
        local progress = self:prop("progress")
        local progressWidth = math.floor(width / 100 * progress)
        term.setBackgroundColor(self:prop("progressColor"))
        for j = 0, height - 1 do
            term.setCursorPos(x, y + j)
            term.write(string.rep(" ", progressWidth))
        end
    end

    -- Draw text
    for i = 1, #alignedText do
        local char = alignedText:sub(i, i)
        term.setCursorPos(x + i - 1, y + math.floor(height / 2))
        if i <= math.floor(width / 100 * progress) then
            term.setTextColor(fg)
            term.setBackgroundColor(progressColor)
        else
            term.setTextColor(fg)
            term.setBackgroundColor(bg)
        end
        term.write(char)
    end
end
