-- =============================================
-- Global Functions
-- =============================================

function drawScreens()
    for _, screen in ipairs(screens) do
        if screen.isWorkingScreen then
            screen.monitor.setBackgroundColor(colors.black)
            screen.monitor.clear()
            resolveLayout(screen.width, screen.height)
            screen:draw()
        end
    end
end

function navigate(screen, newScreen)
    setupMonitorsToScreens(screen.name, newScreen)
    drawScreens()
    -- local h = handlers[screen.name]
    -- if h and h.onLoad then h.onLoad() end
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
        if name == 'terminal' and screen.monitor == term or (isMonitor and screen.monitor.name == monitorName or screen.name == name) then
            return screen
        end
    end
    return nil
end

function updateMonitors()
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
    -- for _, monitor in pairs(monitors) do
    --     monitor.assigned = false
    -- end
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
        if (scn.isWorkingScreen and scn.displayType ~= 'terminal' and scn.name ~= oldMon) or (scn.name == newMon) then
            for _, monitor in pairs(monitors) do
                if not monitor.assigned then
                    scn.monitor = monitor
                    scn.width, scn.height = monitor.getSize()
                    monitor.assigned = true
                    break
                end
            end
        end
    end
end
