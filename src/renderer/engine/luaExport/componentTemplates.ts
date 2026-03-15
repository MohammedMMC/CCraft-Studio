import { generateHeader } from './templates';

export function generateBaseObjectLua(projectName: string, author: string): string {
  return `${generateHeader(projectName, author)}
-- =============================================
-- BaseObject - Base component class
-- =============================================

BaseObject = {}
BaseObject.__index = BaseObject

function BaseObject:new(name)
  local obj = setmetatable({}, self)
  obj.name = name
  return obj
end

function BaseObject:prop(key)
  local el = elements[self.name]
  if el and el[key] ~= nil then
    return el[key]
  end
  return self[key]
end

function BaseObject:isVisible()
  return self:prop("visible") ~= false
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

function BaseObject:draw()
end

-- Resolve responsive layout based on actual screen size
function resolveLayout(screenW, screenH)
  -- Helper: resolve a single element's size against a reference area
  local function resolveSize(el, refW, refH)
    local w = el.width
    local h = el.height
    if el.widthUnit == "fill" then
      w = refW
    elseif el.widthUnit == "%" and el.rawWidth then
      w = math.max(1, math.floor(el.rawWidth / 100 * refW))
    end
    if el.heightUnit == "fill" then
      h = refH
    elseif el.heightUnit == "%" and el.rawHeight then
      h = math.max(1, math.floor(el.rawHeight / 100 * refH))
    end
    return w, h
  end

  -- Helper: get sorted children of a container
  local function getChildren(parentName)
    local children = {}
    for name, el in pairs(elements) do
      if el.parentName == parentName and el.visible ~= false then
        table.insert(children, { name = name, el = el })
      end
    end
    table.sort(children, function(a, b) return (a.el.zIndex or 0) < (b.el.zIndex or 0) end)
    return children
  end

  -- Helper: run flex layout on children
  local function resolveFlexLayout(container, children, innerX, innerY, innerW, innerH, gap)
    local isRow = container.flexDirection == "row"
    local sizes = {}
    local totalChildMain = 0
    for i, child in ipairs(children) do
      local cw, ch = resolveSize(child.el, innerW, innerH)
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
      child.el.x = isRow and (innerX + cursor) or (innerX + crossOffset)
      child.el.y = isRow and (innerY + crossOffset) or (innerY + cursor)
      child.el.width = s.w
      child.el.height = s.h
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
      local cw, ch = resolveSize(child.el, innerW, innerH)
      local col = (i - 1) % cols
      local row = math.floor((i - 1) / cols)
      if row >= rows then break end
      local w = math.min(cw, cellW)
      local h = math.min(ch, cellH)
      local cellX = innerX + col * (cellW + gap)
      local cellY = innerY + row * (cellH + gap)
      child.el.x = cellX + math.floor((cellW - w) / 2)
      child.el.y = cellY + math.floor((cellH - h) / 2)
      child.el.width = w
      child.el.height = h
    end
  end

  -- Recursive: resolve a container and its children
  local function resolveContainer(containerEl, cx, cy, cw, ch)
    local pad = containerEl.padding or 0
    if containerEl.paddingUnit == "%" then
      local ref = math.min(cw, ch)
      pad = math.max(0, math.floor(pad / 100 * ref))
    end
    local innerX = cx + pad
    local innerY = cy + pad
    local innerW = math.max(1, cw - pad * 2)
    local innerH = math.max(1, ch - pad * 2)

    local gap = containerEl.gap or 0
    if containerEl.gapUnit == "%" then
      local ref = (containerEl.display == "flex" and containerEl.flexDirection == "row") and innerW or innerH
      gap = math.max(0, math.floor(gap / 100 * ref))
    end

    local children = getChildren(containerEl._name)
    for i, child in ipairs(children) do
      child.el.width, child.el.height = resolveSize(child.el, innerW, innerH)
    end

    if containerEl.display == "grid" then
      resolveGridLayout(containerEl, children, innerX, innerY, innerW, innerH, gap)
    else
      resolveFlexLayout(containerEl, children, innerX, innerY, innerW, innerH, gap)
    end

    -- Recurse into child containers
    for _, child in ipairs(children) do
      if child.el.isContainer then
        child.el._name = child.name
        resolveContainer(child.el, child.el.x, child.el.y, child.el.width, child.el.height)
      end
    end
  end

  -- Step 1: Resolve top-level elements against screen size
  for name, el in pairs(elements) do
    if not el.parentName then
      el.width, el.height = resolveSize(el, screenW, screenH)
    end
  end

  -- Step 2: Resolve container children recursively
  for name, el in pairs(elements) do
    if el.isContainer and not el.parentName then
      el._name = name
      resolveContainer(el, el.x, el.y, el.width, el.height)
    end
  end

  -- Step 3: Sync component instances from elements
  for _, screen in pairs(screenComponents) do
    for key, comp in pairs(screen) do
      if type(comp) == "table" and comp.name then
        local el = elements[comp.name]
        if el then
          comp.x = el.x
          comp.y = el.y
          comp.width = el.width
          comp.height = el.height
        end
      end
    end
  end

  -- Step 4: Rebuild button hit regions
  if buttonRegions then
    for screenName, regions in pairs(buttonRegions) do
      for _, btn in ipairs(regions) do
        local el = elements[btn.name]
        if el then
          btn.x = el.x
          btn.y = el.y
          btn.w = el.width
          btn.h = el.height
        end
      end
    end
  end
end
`;
}

export function generateLabelLua(projectName: string, author: string): string {
  return `${generateHeader(projectName, author)}
-- =============================================
-- Label - Static text display component
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

  if fg then term.setTextColor(fg) end
  if bg then term.setBackgroundColor(bg) end
  term.setCursorPos(x, y)
  term.write(self:alignText(text, w, align))
end
`;
}

export function generateButtonLua(projectName: string, author: string): string {
  return `${generateHeader(projectName, author)}
-- =============================================
-- Button - Clickable button component
-- =============================================

Button = setmetatable({}, { __index = BaseObject })
Button.__index = Button

function Button:new(name, props)
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
  obj.textAlign = props.textAlign or "center"
  obj.fgColor = props.fgColor
  obj.bgColor = props.bgColor
  obj.focusTextColor = props.focusTextColor
  obj.focusBgColor = props.focusBgColor
  obj.visible = props.visible
  return obj
end

function Button:draw()
  if not self:isVisible() then return end
  local fg = self:prop("fgColor")
  local bg = self:prop("bgColor")
  local x = self:prop("x")
  local y = self:prop("y")
  local w = self:prop("width")
  local h = self:prop("height")
  local text = self:prop("text") or ""
  local align = self:prop("textAlign") or "center"

  if fg then term.setTextColor(fg) end
  if bg then term.setBackgroundColor(bg) end
  for row = 0, h - 1 do
    term.setCursorPos(x, y + row)
    term.write(string.rep(" ", w))
  end
  local midY = y + math.floor(h / 2)
  term.setCursorPos(x, midY)
  term.write(self:alignText(text, w, align))
end

function Button:drawFocused()
  if not self:isVisible() then return end
  local fg = self:prop("focusTextColor") or self:prop("fgColor")
  local bg = self:prop("focusBgColor") or self:prop("bgColor")
  local x = self:prop("x")
  local y = self:prop("y")
  local w = self:prop("width")
  local h = self:prop("height")
  local text = self:prop("text") or ""
  local align = self:prop("textAlign") or "center"

  if fg then term.setTextColor(fg) end
  if bg then term.setBackgroundColor(bg) end
  for row = 0, h - 1 do
    term.setCursorPos(x, y + row)
    term.write(string.rep(" ", w))
  end
  local midY = y + math.floor(h / 2)
  term.setCursorPos(x, midY)
  term.write(self:alignText(text, w, align))
end
`;
}

export function generateContainerLua(projectName: string, author: string): string {
  return `${generateHeader(projectName, author)}
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

  if bg then
    term.setBackgroundColor(bg)
    for row = 0, h - 1 do
      term.setCursorPos(x, y + row)
      term.write(string.rep(" ", w))
    end
  end

  for _, child in ipairs(self.children) do
    child:draw()
  end
end
`;
}
