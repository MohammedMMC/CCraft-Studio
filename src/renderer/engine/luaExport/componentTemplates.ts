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
  for _, screen in pairs(screenComponents) do
    -- Resolve top-level component sizes
    for key, comp in pairs(screen) do
      if type(comp) == "table" and comp.name and not comp.parentName then
        comp.width, comp.height = resolveSize(comp, screenW, screenH)
      end
    end

    -- Resolve container children recursively
    for key, comp in pairs(screen) do
      if type(comp) == "table" and comp.children and not comp.parentName then
        resolveContainer(comp, comp.x, comp.y, comp.width, comp.height)
      end
    end
  end

  -- Step 2: Rebuild button hit regions
  if buttonRegions then
    for screenName, regions in pairs(buttonRegions) do
      local sc = screenComponents[screenName]
      if sc then
        for _, btn in ipairs(regions) do
          local comp = sc[btn.name:gsub("[^%w_]", "_")]
          if comp then
            btn.x = comp.x
            btn.y = comp.y
            btn.w = comp.width
            btn.h = comp.height
          end
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
  obj.zIndex = props.zIndex
  obj.type = props.type
  obj.parentName = props.parentName
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

  term.setTextColor(fg)
  term.setBackgroundColor(bg)
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
  obj.zIndex = props.zIndex
  obj.type = props.type
  obj.parentName = props.parentName
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

  term.setTextColor(fg)
  term.setBackgroundColor(bg)
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

  term.setTextColor(fg)
  term.setBackgroundColor(bg)
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
`;
}

export function generatePanelLua(projectName: string, author: string): string {
  return `${generateHeader(projectName, author)}
-- =============================================
-- Panel - Layout container with title text
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
  local textsp = {lead, trail}
  
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
`;
}
