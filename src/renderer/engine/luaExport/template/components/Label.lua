-- =============================================
-- Label
-- =============================================

Label = setmetatable({}, { __index = BaseObject })
Label.__index = Label

function Label:new(name, props)
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
    obj.fgColor = props.fgColor
    obj.bgColor = props.bgColor
    obj.visible = props.visible
    obj.zIndex = props.zIndex
    obj.type = props.type
    obj.parentName = props.parentName
    return obj
end

function Label:draw()
    if not self:isVisible() then return end
    local fg = self:prop("fgColor")
    local bg = self:prop("bgColor")
    local x = self:prop("x")
    local y = self:prop("y")
    local w = self:prop("width")
    local text = self:prop("text") or ""
    local align = self:prop("textAlign") or "left"

    term.setTextColor(fg)
    term.setBackgroundColor(bg)
    term.setCursorPos(x, y)
    term.write(self:alignText(text, w, align))
end
