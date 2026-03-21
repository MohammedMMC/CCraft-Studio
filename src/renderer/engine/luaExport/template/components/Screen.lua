-- =============================================
-- Screen
-- =============================================

Screen = {}
Screen.__index = Screen

function Screen:new(name)
    local obj = setmetatable({}, self)

    obj.name = name
    obj.visible = false
    obj.autoMonitor = false
    obj.children = {}

    return obj
end

function Container:addChild(child)
    table.insert(self.children, child)
end

function Screen:draw()
    for _, child in ipairs(self.children or {}) do
        child:draw()
    end
end
