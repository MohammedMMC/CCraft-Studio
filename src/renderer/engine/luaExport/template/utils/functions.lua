-- =============================================
-- Global Functions
-- =============================================

function drawScreens()
    resolveLayout()
    for _, screen in ipairs(screens) do
        if screen.isWorkingScreen and screen.monitor then
            screen.monitor.setBackgroundColor(colors.black)
            screen.monitor.clear()
            screen:draw()

            if screen.isBlinking then
                screen.monitor.setCursorPos(screen.blinkingPosition.x, screen.blinkingPosition.y)
                screen.monitor.setCursorBlink(true)
            else
                screen.monitor.setCursorBlink(false)
            end
        end
    end
end

function navigate(screen, newScreen)
    setupMonitorsToScreens(screen.name, newScreen)
    drawScreens()
end

function refreshScreen() drawScreens() end

-- function getElement(name)
--     local scn = getScreen(currentScreen)
--     if scn then return scn:getChild(name) end
-- end

-- name = 'terminal' or 'monitor:monitor_name' or screen name
function getScreen(name)
    local isMonitor = name:sub(1, 8) == "monitor:"
    local monitorName = isMonitor and name:sub(9) or nil
    
    for _, screen in ipairs(screens) do
        if (name == 'terminal' and screen.monitor == term) or (isMonitor and (screen.monitor and (screen.monitor.name == monitorName)) or (screen.name == name)) then
            return screen
        end
    end
    return nil
end

function updateMonitors()
    for i = #monitors, 1, -1 do monitors[i] = nil end

    local peropheralNames = peripheral.getNames()
    for _, name in ipairs(peropheralNames) do
        if peripheral.getType(name) == "monitor" then
            local newMonitor = peripheral.wrap(name)
            newMonitor.name = name
            table.insert(monitors, newMonitor)
        end
    end
end

function setupMonitorsToScreens(oldMon, newMon)
    updateMonitors()

    local function matchesUnit(value, expected, unit)
        if expected == nil then return true end
        unit = unit or '='
        if unit == '<' then return value < expected end
        if unit == '>' then return value > expected end
        return value == expected
    end

    local function isMonitorCompatible(scn, monitor)
        if scn.displayType ~= 'monitor' then return true end

        local monitorWidth, monitorHeight = monitor.getSize()
        local widthOk = matchesUnit(monitorWidth, scn.monitorsWidthSize, scn.monitorsWidthUnit)
        local heightOk = matchesUnit(monitorHeight, scn.monitorsHeightSize, scn.monitorsHeightUnit)

        return widthOk and heightOk
    end

    local scns = screens
    table.sort(scns, function(a, b)
        if a.displayType == "monitor" and b.displayType ~= "monitor" then
            return true
        elseif a.displayType ~= "monitor" and b.displayType == "monitor" then
            return false
        else
            return false
        end
    end)
    
    for _, scn in pairs(scns) do
        scn.monitor = nil
        scn.width, scn.height = 0, 0

        if (scn.isWorkingScreen and scn.displayType ~= 'terminal' and scn.name ~= oldMon) or (scn.name == newMon) then
            for _, monitor in pairs(monitors) do
                if not monitor.assigned and isMonitorCompatible(scn, monitor) then
                    scn.monitor = monitor
                    scn.width, scn.height = monitor.getSize()
                    monitor.assigned = true
                    break
                end
            end
            if scn.displayType == 'any' and not scn.monitor then
                scn.monitor = term
                scn.width, scn.height = term.getSize()
            end
        end
    end
end
