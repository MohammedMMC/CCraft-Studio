-- =============================================
-- Panel
-- =============================================

Panel = setmetatable({}, { __index = BaseObject })
Panel.__index = Panel

function Panel:new(name, props)
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
    obj.borderColor = props.borderColor
    obj.titleBgColor = props.titleBgColor
    obj.visible = props.visible
    obj.zIndex = props.zIndex
    obj.type = props.type
    obj.parentName = props.parentName
    obj.display = props.display or "flex"
    obj.flexDirection = props.flexDirection or "column"
    obj.gap = props.gap or 0
    obj.gapUnit = props.gapUnit or "px"
    obj.alignItems = props.alignItems or "start"
    obj.justifyContent = props.justifyContent or "start"
    obj.gridTemplateCols = props.gridTemplateCols or 2
    obj.gridTemplateRows = props.gridTemplateRows or 2
    obj.padding = props.padding or 0
    obj.paddingUnit = props.paddingUnit or "px"
    obj.children = {}
    return obj
end

function Panel:addChild(child)
    table.insert(self.children, child)
end

function Panel:draw()
    if not self:isVisible() then return end
    local x = self:prop("x")
    local y = self:prop("y")
    local width = self:prop("width")
    local height = self:prop("height")
    local fg = self:prop("fgColor")
    local bg = self:prop("bgColor")
    local borderColor = self:prop("borderColor")
    local titleBg = self:prop("titleBgColor")
    local text = self:prop("text") or ""
    local align = self:prop("textAlign") or "left"
    local aligned = self:alignText(text, width, align)

    -- count leading/trailing spaces
    local lead = #(aligned:match("^%s*") or "")
    local trail = #(aligned:match("%s*$") or "")
    local textsp = { lead, trail }

    local plus2 = width < (#text + 4) and 0 or 2

    local textpos
    if textsp[2] == 0 then
        textpos = lead - 4 + (lead == 4 and 1 or 0) + (plus2 == 0 and 3 or 0) + (lead == 5 and 1 or 0)
    else
        if lead == 0 then
            textpos = ((width == (plus2 + (trail == 5 and 1 or 0) + #text + 2)) and 1 or 0)
            if textpos == 0 then
                textpos = plus2 ~= 0 and plus2 or 1
            end
        else
            textpos = lead - (plus2 == 2 and 1 or 0)
        end
    end

    -- title
    term.setBackgroundColor(titleBg)
    term.setTextColor(fg)

    local title = text:match("^%s*(.-)%s*$")
    if plus2 == 2 then
        title = " " .. title .. " "
    end

    term.setCursorPos(x + textpos, y)
    term.write(title)

    term.setBackgroundColor(borderColor)
    term.setTextColor(fg)
    term.setCursorPos(x, y)
    term.write(string.rep(" ", textpos))

    local rightStart = x + (textpos + #text + 2) + ((textsp[1] ~= 2 and plus2 == 0) and -2 or 0)
    local rightWidth = width - (textpos + #text + 2) + ((textsp[1] ~= 2 and plus2 == 0) and 1 or 0)

    term.setCursorPos(rightStart, y)
    term.write(string.rep(" ", rightWidth))

    term.setCursorPos(x, y + height - 1)
    term.write(string.rep(" ", width))

    for i = 0, height - 1 do
        term.setCursorPos(x, y + i)
        term.write(" ")
    end

    for i = 0, height - 1 do
        term.setCursorPos(x + width - 1, y + i)
        term.write(" ")
    end

    if bg and width > 2 and height > 2 then
        term.setBackgroundColor(bg)
        for row = 1, height - 2 do
            term.setCursorPos(x + 1, y + row)
            term.write(string.rep(" ", width - 2))
        end
    end

    for _, child in ipairs(self.children) do
        child:draw()
    end
end
