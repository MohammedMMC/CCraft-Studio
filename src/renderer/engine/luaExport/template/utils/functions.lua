-- =============================================
-- Global Functions
-- =============================================

local lastDraw = 0

function drawCurrentScreen()
    if os.clock() - lastDraw < 0.2 then return end
    lastDraw = os.clock()

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
