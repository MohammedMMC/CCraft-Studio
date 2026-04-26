-- =============================================
-- Screen
-- =============================================

Screen = {}
Screen.__index = Screen

function Screen:new(name, props)
    local obj = setmetatable({}, self)

    obj.events = {
        -- Main Events
        onUpdate = function() end,
        onceLoaded = null,
        onceLoadedRunned = false,
        -- Other Events
        onKeyPress = {},
        onTimer = {},
        onRedstone = function() end,
        onModemMessage = {}
    }

    obj.name = name
    obj.autoMonitor = false
    obj.drawOrder = {}
    obj.children = {}
    obj.bgColor = props.bgColor or colors.black

    obj.isBlinking = false
    obj.blinkingPosition = { x = 1, y = 1 }

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

function Screen:setBlinking(state, x, y)
    self.isBlinking = state == true
    self.blinkingPosition = {
        x = x or self.blinkingPosition.x,
        y = y or self.blinkingPosition.y
    }
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

function Screen.cPrint(monitor, textArr, width, textAlign)
    for _, text in ipairs(BaseObject.alignText(textArr, width and width or #textArr, textAlign and textAlign or "left")) do
        local num = tonumber(text:match("\\(%d+)"))
        if num then
            monitor.write(string.char(num))
        else
            monitor.write(text)
        end
    end
end

function Screen:addDrawOrder(child)
    table.insert(self.drawOrder, child)
end

function Screen:getTopTouchedElement(x, y)
    local function getSortedChildren(children)
        local sorted = {}
        for i, child in ipairs(children or {}) do
            sorted[i] = child
        end

        table.sort(sorted, function(a, b)
            return (a.zIndex or 0) > (b.zIndex or 0)
        end)

        return sorted
    end

    local function findTouched(comp)
        if not comp or not comp.checkTouch or not comp:checkTouch(x, y) then
            return nil
        end

        local children = getSortedChildren(comp.children)
        for _, child in ipairs(children) do
            local touched = findTouched(child)
            if touched then
                return touched
            end
        end

        return comp
    end

    if self.drawOrder and #self.drawOrder > 0 then
        for i = #self.drawOrder, 1, -1 do
            local comp = self:getChild(self.drawOrder[i])
            local touched = findTouched(comp)
            if touched then
                return touched
            end
        end
        return nil
    end

    local topLevel = getSortedChildren(self.children)
    for _, comp in ipairs(topLevel) do
        local touched = findTouched(comp)
        if touched then
            return touched
        end
    end

    return nil
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

    self.events.onUpdate()
    if (not self.events.onceLoadedRunned and self.events.onceLoaded) then
        self.events.onceLoadedRunned = true
        self.events.onceLoaded()
    end
end
