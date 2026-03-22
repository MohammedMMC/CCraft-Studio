-- =============================================
-- Global Functions
-- =============================================

function drawCurrentScreen()
    term.setBackgroundColor(colors.black)
    term.clear()
    resolveLayout(term.getSize())
    local scn = getScreen(currentScreen)
    if scn and scn.draw then scn:draw() end
end

function navigate(screenName)
    currentScreen = screenName
    drawCurrentScreen()
    local h = handlers[currentScreen]
    if h and h.onLoad then h.onLoad() end
end

function refreshScreen() drawCurrentScreen() end

function getElement(name)
    local scn = getScreen(currentScreen)
    if scn then return scn:getChild(name) end
end

function getScreen(name)
    for _, screen in ipairs(screens) do
        if screen.name == name then
            return screen
        end
    end
    return nil
end