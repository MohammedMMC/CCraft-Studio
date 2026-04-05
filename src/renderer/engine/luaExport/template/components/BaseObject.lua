-- =============================================
-- BaseObject
-- =============================================

BaseObject = {}
BaseObject.__index = BaseObject

function BaseObject:new(name, props)
    local obj = setmetatable({}, self)
    obj.name = name
    obj.monitor = nil
    obj.screen = nil

    for pn, pi in pairs(props) do
        obj[pn] = pi
    end

    return obj
end

function BaseObject:isVisible()
    return self.visible
end

function BaseObject:setVisible(visible)
    self.visible = visible
end

function BaseObject:getScreen()
    return getScreen(self.screenName)
end

function BaseObject:getMonitor()
    local scn = self:getScreen()
    return scn and scn.monitor or nil
end

function BaseObject.tokenizeText(text)
    if type(text) == "table" then
        local tokens = {}
        for i, token in ipairs(text) do
            tokens[i] = token
        end
        return tokens
    end

    local tokens = {}
    local i = 1
    while i <= #text do
        local match = text:match("^(\\%d+)", i)
        if match then
            tokens[#tokens + 1] = match
            i = i + #match
        else
            tokens[#tokens + 1] = text:sub(i, i)
            i = i + 1
        end
    end

    return tokens
end

function BaseObject.trimStartArr(arr)
    local idx = 1
    while idx <= #arr and arr[idx] == " " do
        idx = idx + 1
    end
    if idx > #arr then return {} end
    local result = {}
    for i = idx, #arr do
        result[#result + 1] = arr[i]
    end
    return result
end

function BaseObject.trimEndArr(arr)
    local idx = #arr
    while idx >= 1 and arr[idx] == " " do
        idx = idx - 1
    end
    if idx < 1 then return {} end
    local result = {}
    for i = 1, idx do
        result[#result + 1] = arr[i]
    end
    return result
end

function BaseObject.alignText(text, width, align)
    local tokens = BaseObject.tokenizeText(text)
    local len = #tokens

    if len >= width then
        local clipped = {}
        for i = 1, width do
            clipped[#clipped + 1] = tokens[i]
        end
        return type(text) == "table" and clipped or table.concat(clipped)
    end

    local pad = width - len
    local isArray = type(text) == "table"
    
    if align == "center" then
        local left = math.floor(pad / 2)
        local right = pad - left
        if isArray then
            local result = {}
            for i = 1, left do result[#result + 1] = " " end
            for _, token in ipairs(tokens) do result[#result + 1] = token end
            for i = 1, right do result[#result + 1] = " " end
            return result
        else
            return string.rep(" ", left) .. text .. string.rep(" ", right)
        end
    elseif align == "right" then
        if isArray then
            local result = {}
            for i = 1, pad do result[#result + 1] = " " end
            for _, token in ipairs(tokens) do result[#result + 1] = token end
            return result
        else
            return string.rep(" ", pad) .. text
        end
    else
        if isArray then
            local result = {}
            for _, token in ipairs(tokens) do result[#result + 1] = token end
            for i = 1, pad do result[#result + 1] = " " end
            return result
        else
            return text .. string.rep(" ", pad)
        end
    end
end

function BaseObject:checkTouch(x, y)
    if not self:isVisible() then return false end
    return x >= self.x and x < self.x + self.width and y >= self.y and y < self.y + self.height
end

-- function BaseObject:onEvent(event, p1, p2, p3, p4, p5)end
-- function BaseObject:onReleaseEvent(x,y)end
-- function BaseObject:onClickEvent(x,y)end
-- function BaseObject:onDragEvent(x,y)end
-- function BaseObject:onkeyEvent(key)end
-- function BaseObject:onCharEvent(char)end


function BaseObject:draw()
    if not self:isVisible() then return end
    self.screen = getScreen(self.screenName)
    self.monitor = self:getMonitor()

    if self.type ~= 'container' and self.type ~= 'slider' then
        self.textArr = BaseObject.tokenizeText(self.text)
    end
    if self.type == 'input' then
        self.placeholderArr = BaseObject.tokenizeText(self.placeholder)
    end

    self:drawElement()

    for _, child in ipairs(self.children or {}) do
        child:draw()
    end
end

-- Resolve responsive layout based on actual screen size
function resolveLayout()
    -- Helper: resolve a single component's size against a reference area
    local function resolveSize(comp, refW, refH)
        local w = comp.width
        local h = comp.height
        if comp.widthUnit == "fill" then
            w = refW
        elseif comp.widthUnit == "%" and comp.rawWidth then
            w = math.max(1, math.floor(comp.rawWidth / 100 * refW + 0.5))
        end
        if comp.heightUnit == "fill" then
            h = refH
        elseif comp.heightUnit == "%" and comp.rawHeight then
            h = math.max(1, math.floor(comp.rawHeight / 100 * refH + 0.5))
        end
        return w, h
    end

    -- Helper: get visible children sorted by zIndex
    local function getVisibleChildren(container)
        local children = {}
        if container.children then
            for _, child in ipairs(container.children) do
                if child.visible ~= false then
                    table.insert(children, child)
                end
            end
        end
        table.sort(children, function(a, b) return (a.zIndex or 0) < (b.zIndex or 0) end)
        return children
    end

    -- Helper: run flex layout on children
    local function resolveFlexLayout(container, children, innerX, innerY, innerW, innerH, gap)
        local isRow = container.flexDirection == "row"
        local sizes = {}

        for i, child in ipairs(children) do
            local cw, ch = resolveSize(child, innerW, innerH)
            sizes[i] = { w = cw, h = ch }
        end

        local mainSpace = isRow and innerW or innerH
        local crossSpace = isRow and innerH or innerW
        local totalGap = gap * math.max(0, #children - 1)

        local pxChildIndexes = {}
        local percentChildIndexes = {}

        for i, child in ipairs(children) do
            local unit = isRow and child.widthUnit or child.heightUnit
            if unit == "px" then
                table.insert(pxChildIndexes, i)
            elseif unit == "%" or unit == "fill" then
                table.insert(percentChildIndexes, i)
            end
        end

        local totalPxMain = 0
        for _, idx in ipairs(pxChildIndexes) do
            totalPxMain = totalPxMain + (isRow and sizes[idx].w or sizes[idx].h)
        end

        local mainLayoutSpace = math.max(0, mainSpace - totalGap)
        local percentSpace = math.max(0, mainLayoutSpace - totalPxMain)
        local totalPercentMain = 0

        if #percentChildIndexes > 0 then
            local weights = {}
            local totalWeight = 0

            for i, idx in ipairs(percentChildIndexes) do
                local unit = isRow and children[idx].widthUnit or children[idx].heightUnit
                local raw = unit == "fill" and 100 or (isRow and (children[idx].rawWidth or children[idx].width) or
                    (children[idx].rawHeight or children[idx].height))
                local weight = math.max(0, raw)
                weights[i] = weight
                totalWeight = totalWeight + weight
            end

            if totalWeight <= 0 then
                totalWeight = 0
                for i = 1, #weights do
                    weights[i] = 1
                    totalWeight = totalWeight + 1
                end
            end

            local resolved = {}
            for i, weight in ipairs(weights) do
                local denominator = totalWeight > 100 and totalWeight or 100
                local exact = (weight / denominator) * percentSpace
                local floored = math.max(1, math.floor(exact))
                resolved[i] = {
                    floored = floored,
                    fraction = exact - floored,
                }
            end

            if totalWeight >= 100 then
                local distributed = 0
                for i = 1, #resolved do
                    distributed = distributed + resolved[i].floored
                end

                local remaining = percentSpace - distributed
                if remaining > 0 and #resolved > 0 then
                    local byRemainderDesc = {}
                    for i = 1, #resolved do byRemainderDesc[i] = i end
                    table.sort(byRemainderDesc, function(a, b)
                        return resolved[a].fraction > resolved[b].fraction
                    end)
                    for i = 1, remaining do
                        local idx = byRemainderDesc[((i - 1) % #byRemainderDesc) + 1]
                        resolved[idx].floored = resolved[idx].floored + 1
                    end
                end
            end

            for i, childIndex in ipairs(percentChildIndexes) do
                sizes[childIndex][isRow and 'w' or 'h'] = resolved[i].floored
                totalPercentMain = totalPercentMain + resolved[i].floored
            end
        end

        local totalMain = 0
        for i, s in ipairs(sizes) do totalMain = totalMain + (isRow and s.w or s.h) end
        totalMain = totalMain + totalGap

        local mainOffset = 0
        local gapSpaces = {}

        local jc = container.justifyContent or "start"
        if jc == "center" then
            mainOffset = math.floor((mainSpace - totalMain) / 2)
        elseif jc == "end" then
            mainOffset = mainSpace - totalMain
        elseif jc == "space-between" and #children > 1 then
            local childMainSum = 0
            for i, s in ipairs(sizes) do childMainSum = childMainSum + (isRow and s.w or s.h) end
            for i = 1, #children - 1 do
                gapSpaces[i] = math.floor((mainSpace - childMainSum) / (#children - 1)) +
                    ((i <= ((mainSpace - childMainSum) % (#children - 1))) and 1 or 0)
            end
            mainOffset = 0
        end

        local cursor = mainOffset
        for i, child in ipairs(children) do
            local s = sizes[i]
            local childMain = isRow and s.w or s.h
            local childCross = isRow and s.h or s.w
            local crossOffset = 0
            local ai = container.alignItems or "start"
            if ai == "center" then
                crossOffset = math.floor((crossSpace - childCross) / 2)
            elseif ai == "end" then
                crossOffset = crossSpace - childCross
            end
            child.x = isRow and (innerX + cursor) or (innerX + crossOffset)
            child.y = isRow and (innerY + crossOffset) or (innerY + cursor)
            child.width = s.w
            child.height = s.h

            if i < #children then
                local space = (jc == "space-between" and #gapSpaces > 0) and gapSpaces[i] or gap
                cursor = cursor + childMain + space
            end
        end
    end

    -- Helper: run grid layout on children
    local function resolveGridLayout(container, children, innerX, innerY, innerW, innerH, gap)
        local cols = math.max(1, container.gridTemplateCols or 2)
        local rows = math.max(1, container.gridTemplateRows or 2)
        local totalGapX = gap * (cols - 1)
        local totalGapY = gap * (rows - 1)
        local cellW = math.max(1, math.floor((innerW - totalGapX) / cols))
        local cellH = math.max(1, math.floor((innerH - totalGapY) / rows))

        local childData = {}
        for i, child in ipairs(children) do
            childData[i] = {
                index = i,
                isAbsoluteW = child.widthUnit ~= "px",
                isAbsoluteH = child.heightUnit ~= "px",
                mainWidth = children[i].width,
                mainHeight = children[i].height,
            }
        end

        for i, child in ipairs(children) do
            local cData = childData[i]
            local w = children[i].width
            local h = children[i].height

            if cData.isAbsoluteW then
                children[i].width = math.max(1, math.floor(w * (cellW / math.max(1, cData.mainWidth))))
            else
                children[i].width = math.min(cData.mainWidth, cellW)
            end

            if cData.isAbsoluteH then
                children[i].height = math.max(1, math.floor(h * (cellH / math.max(1, cData.mainHeight))))
            else
                children[i].height = math.min(cData.mainHeight, cellH)
            end
        end

        for i, child in ipairs(children) do
            local col = (i - 1) % cols
            local row = math.floor((i - 1) / cols)
            if row >= rows then break end

            local w = math.min(child.width, cellW)
            local h = math.min(child.height, cellH)
            local cellX = innerX + col * (cellW + gap)
            local cellY = innerY + row * (cellH + gap)
            child.x = cellX + math.floor((cellW - w) / 2)
            child.y = cellY + math.floor((cellH - h) / 2)
            child.width = w
            child.height = h
        end
    end

    -- Recursive: resolve a container and its children
    local function resolveContainer(container, cx, cy, cw, ch)
        -- Panel border acts as 1-char inset on all sides
        local borderInset = (container.type == "panel") and 1 or 0
        local bx = cx + borderInset
        local by = cy + borderInset
        local bw = math.max(1, cw - borderInset * 2)
        local bh = math.max(1, ch - borderInset * 2)

        local pad = container.padding or 0
        if container.paddingUnit == "%" then
            local ref = math.min(bw, bh)
            pad = math.max(0, math.floor(pad / 100 * ref + 0.5))
        end
        local innerX = bx + pad
        local innerY = by + pad
        local innerW = math.max(1, bw - pad * 2)
        local innerH = math.max(1, bh - pad * 2)

        local gap = container.gap or 0
        if container.gapUnit == "%" then
            local ref = (container.display == "flex" and container.flexDirection == "row") and innerW or innerH
            gap = math.max(0, math.floor(gap / 100 * ref + 0.5))
        end

        local children = getVisibleChildren(container)
        for _, child in ipairs(children) do
            child.width, child.height = resolveSize(child, innerW, innerH)
        end

        if container.display == "grid" then
            resolveGridLayout(container, children, innerX, innerY, innerW, innerH, gap)
        else
            resolveFlexLayout(container, children, innerX, innerY, innerW, innerH, gap)
        end

        -- Recurse into child containers
        for _, child in ipairs(children) do
            if child.children then
                resolveContainer(child, child.x, child.y, child.width, child.height)
            end
        end
    end

    -- Step 1: For each screen, resolve all components
    for _, screen in pairs(screens) do
        -- Resolve top-level component sizes
        for key, comp in pairs(screen.children) do
            if type(comp) == "table" and comp.name and not comp.parentName then
                comp.width, comp.height = resolveSize(comp, screen.width, screen.height)
            end
        end

        -- Resolve container children recursively
        for key, comp in pairs(screen.children) do
            if type(comp) == "table" and comp.children and not comp.parentName then
                resolveContainer(comp, comp.x, comp.y, comp.width, comp.height)
            end
        end
    end
end
