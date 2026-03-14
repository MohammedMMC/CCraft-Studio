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
