-- =============================================
-- Global Functions',
-- =============================================

function drawCurrentScreen()
    resolveLayout(term.getSize())
    local fn = screenDrawFunctions[currentScreen]
    if fn then fn() end
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
