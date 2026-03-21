-- =============================================
-- Container
-- =============================================

Container = setmetatable({}, { __index = BaseObject })
Container.__index = Container

function Container:new(name, props)
    local obj = BaseObject.new(self, name, props)
    
    obj.children = {}

    return obj
end

function Container:addChild(child)
    table.insert(self.children, child)
end

function Container:drawElement()
    term.setBackgroundColor(self.bgColor)
    for row = 0, self.height - 1 do
        term.setCursorPos(self.x, self.y + row)
        term.write(string.rep(" ", self.width))
    end
end
