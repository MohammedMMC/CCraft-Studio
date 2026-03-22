-- =============================================
-- Screen
-- =============================================

Screen = {}
Screen.__index = Screen

function Screen:new(name)
    local obj = setmetatable({}, self)

    obj.name = name
    obj.autoMonitor = false
    obj.drawOrder = {}
    obj.children = {}

    return obj
end

function Screen:addChild(child)
    table.insert(self.children, child)
end

function Screen:getChild(name)
    for _, child in ipairs(self.children) do
        if child.name == name then
            return child
        end
    end
    return nil
end

function Screen:addDrawOrder(child)
    table.insert(self.drawOrder, child)
end

function Screen:draw()
    for _, name in ipairs(self.drawOrder) do
        self:getChild(name):draw()
    end
end
