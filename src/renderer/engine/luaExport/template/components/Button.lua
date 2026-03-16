-- =============================================
-- Button - Clickable button component
-- =============================================

Button = setmetatable({}, { __index = BaseObject })
Button.__index = Button

function Button:new(name, props)
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
    obj.textAlign = props.textAlign or "center"
    obj.fgColor = props.fgColor
    obj.bgColor = props.bgColor
    obj.focusTextColor = props.focusTextColor
    obj.focusBgColor = props.focusBgColor
    obj.visible = props.visible
    obj.zIndex = props.zIndex
    obj.type = props.type
    obj.parentName = props.parentName
    return obj
end

function Button:draw()
    if not self:isVisible() then return end
    local fg = self:prop("fgColor")
    local bg = self:prop("bgColor")
    local x = self:prop("x")
    local y = self:prop("y")
    local w = self:prop("width")
    local h = self:prop("height")
    local text = self:prop("text") or ""
    local align = self:prop("textAlign") or "center"

    term.setTextColor(fg)
    term.setBackgroundColor(bg)
    for row = 0, h - 1 do
        term.setCursorPos(x, y + row)
        term.write(string.rep(" ", w))
    end
    local midY = y + math.floor(h / 2)
    term.setCursorPos(x, midY)
    term.write(self:alignText(text, w, align))
end

function Button:drawFocused()
    if not self:isVisible() then return end
    local fg = self:prop("focusTextColor") or self:prop("fgColor")
    local bg = self:prop("focusBgColor") or self:prop("bgColor")
    local x = self:prop("x")
    local y = self:prop("y")
    local w = self:prop("width")
    local h = self:prop("height")
    local text = self:prop("text") or ""
    local align = self:prop("textAlign") or "center"

    term.setTextColor(fg)
    term.setBackgroundColor(bg)
    for row = 0, h - 1 do
        term.setCursorPos(x, y + row)
        term.write(string.rep(" ", w))
    end
    local midY = y + math.floor(h / 2)
    term.setCursorPos(x, midY)
    term.write(self:alignText(text, w, align))
end
