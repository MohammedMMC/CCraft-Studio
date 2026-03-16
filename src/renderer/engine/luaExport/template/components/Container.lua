-- =============================================
-- Container - Layout container component
-- =============================================

Container = setmetatable({}, { __index = BaseObject })
Container.__index = Container

function Container:new(name, props)
    local obj = BaseObject.new(self, name)
    obj.x = props.x
    obj.y = props.y
    obj.width = props.width
    obj.height = props.height
    obj.widthUnit = props.widthUnit
    obj.heightUnit = props.heightUnit
    obj.rawWidth = props.rawWidth
    obj.rawHeight = props.rawHeight
    obj.bgColor = props.bgColor
    obj.fgColor = props.fgColor
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

function Container:addChild(child)
    table.insert(self.children, child)
end

function Container:draw()
    if not self:isVisible() then return end
    local bg = self:prop("bgColor")
    local x = self:prop("x")
    local y = self:prop("y")
    local w = self:prop("width")
    local h = self:prop("height")

    term.setBackgroundColor(bg)
    for row = 0, h - 1 do
        term.setCursorPos(x, y + row)
        term.write(string.rep(" ", w))
    end

    for _, child in ipairs(self.children) do
        child:draw()
    end
end
