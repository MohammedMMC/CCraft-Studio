-- =============================================
-- Global Functions
-- =============================================

-- local lastDraw = 0

function drawCurrentScreen()
    -- if os.clock() - lastDraw < 0.2 then return end
    -- lastDraw = os.clock()
    -- term.clear()
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
    local sc = screenComponents[currentScreen]
    if sc then return sc[name:gsub("[^%w_]", "_")] end
end

function getScreen(name)
    for _, screen in ipairs(screens) do
        if screen.name == name then
            return screen
        end
    end
    return nil
end