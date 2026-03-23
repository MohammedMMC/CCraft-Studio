-- =============================================
-- Screen
-- =============================================

Screen = {}
Screen.__index = Screen

function Screen:new(name, props)
    local obj = setmetatable({}, self)

    obj.name = name
    obj.autoMonitor = false
    obj.drawOrder = {}
    obj.children = {}
    obj.bgColor = props.bgColor or colors.black

    obj.isWorkingScreen = props.isWorkingScreen or false
    obj.displayType = props.displayType or 'any'
    obj.monitorsWidthSize = props.monitorsWidthSize
    obj.monitorsHeightSize = props.monitorsHeightSize
    obj.monitorsWidthUnit = props.monitorsWidthUnit
    obj.monitorsHeightUnit = props.monitorsHeightUnit

    obj.width, obj.height = 0, 0

    obj.monitor = props.displayType == 'terminal' and term or nil

    if props.displayType == 'terminal' then
        obj.width, obj.height = term.getSize()
    end
    
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
    self.monitor.setBackgroundColor(self.bgColor)
    for j = 0, self.height - 1 do
        self.monitor.setCursorPos(1, 1 + j)
        self.monitor.write(string.rep(" ", self.width))
    end

    for _, name in ipairs(self.drawOrder) do
        self:getChild(name):draw()
    end
end
