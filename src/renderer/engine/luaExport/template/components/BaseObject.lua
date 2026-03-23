-- =============================================
-- BaseObject
-- =============================================

BaseObject = {}
BaseObject.__index = BaseObject

function BaseObject:new(name, props)
    local obj = setmetatable({}, self)
    obj.name = name
    obj.monitor = nil

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

function BaseObject:alignText(text, width, align)
    local len = #text
    if len >= width then return text:sub(1, width) end
    if align == "center" then
        local pad = math.floor((width - len) / 2)
        return string.rep(" ", pad) .. text .. string.rep(" ", width - len - pad)
    elseif align == "right" then
        return string.rep(" ", width - len) .. text
    else
        return text .. string.rep(" ", width - len)
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


function BaseObject:draw()
    if not self:isVisible() then return end
    self.monitor = self:getMonitor()

    self:drawElement()

    for _, child in ipairs(self.children or {}) do
        child:draw()
    end
end

-- Resolve responsive layout based on actual screen size
function resolveLayout(screenW, screenH)
    -- Helper: resolve a single component's size against a reference area
    local function resolveSize(comp, refW, refH)
        local w = comp.width
        local h = comp.height
        if comp.widthUnit == "fill" then
            w = refW
        elseif comp.widthUnit == "%" and comp.rawWidth then
            w = math.max(1, math.floor(comp.rawWidth / 100 * refW))
        end
        if comp.heightUnit == "fill" then
            h = refH
        elseif comp.heightUnit == "%" and comp.rawHeight then
            h = math.max(1, math.floor(comp.rawHeight / 100 * refH))
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
        local totalChildMain = 0
        for i, child in ipairs(children) do
            local cw, ch = resolveSize(child, innerW, innerH)
            sizes[i] = { w = cw, h = ch }
            totalChildMain = totalChildMain + (isRow and cw or ch)
        end

        local mainSpace = isRow and innerW or innerH
        local crossSpace = isRow and innerH or innerW
        local totalGap = gap * math.max(0, #children - 1)

        -- Shrink children proportionally if they overflow the main axis
        if totalChildMain > 0 and totalChildMain + totalGap > mainSpace then
            local availableForChildren = math.max(#children, mainSpace - totalGap)
            local ratio = availableForChildren / totalChildMain
            for i, s in ipairs(sizes) do
                if isRow then
                    s.w = math.max(1, math.floor(s.w * ratio))
                else
                    s.h = math.max(1, math.floor(s.h * ratio))
                end
            end
        end

        local totalMain = 0
        for i, s in ipairs(sizes) do totalMain = totalMain + (isRow and s.w or s.h) end
        totalMain = totalMain + totalGap

        local mainOffset = 0
        local spaceBetween = gap

        local jc = container.justifyContent or "start"
        if jc == "center" then
            mainOffset = math.floor((mainSpace - totalMain) / 2)
        elseif jc == "end" then
            mainOffset = mainSpace - totalMain
        elseif jc == "space-between" and #children > 1 then
            local childMainSum = 0
            for i, s in ipairs(sizes) do childMainSum = childMainSum + (isRow and s.w or s.h) end
            spaceBetween = math.floor((mainSpace - childMainSum) / math.max(1, #children - 1))
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
            cursor = cursor + childMain + (jc == "space-between" and spaceBetween or gap)
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

        for i, child in ipairs(children) do
            local cw, ch = resolveSize(child, innerW, innerH)
            local col = (i - 1) % cols
            local row = math.floor((i - 1) / cols)
            if row >= rows then break end
            local w = math.min(cw, cellW)
            local h = math.min(ch, cellH)
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
            pad = math.max(0, math.floor(pad / 100 * ref))
        end
        local innerX = bx + pad
        local innerY = by + pad
        local innerW = math.max(1, bw - pad * 2)
        local innerH = math.max(1, bh - pad * 2)

        local gap = container.gap or 0
        if container.gapUnit == "%" then
            local ref = (container.display == "flex" and container.flexDirection == "row") and innerW or innerH
            gap = math.max(0, math.floor(gap / 100 * ref))
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
                comp.width, comp.height = resolveSize(comp, screenW, screenH)
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
