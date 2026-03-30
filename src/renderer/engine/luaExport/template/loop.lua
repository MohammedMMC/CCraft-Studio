local isTouching = false

while running do
    drawScreens()
    local event, p1, p2, p3, p4, p5 = os.pullEvent()

    -- for _, comp in pairs(getScreen(currentScreen).children) do
    --     if comp.onEvent then comp:onEvent(event, p1, p2, p3, p4, p5) end
    -- end
    local isMonitor = event == "monitor_touch"
    local screen = getScreen(isMonitor and 'monitor:' .. p1 or 'terminal')

    if event == "close" then
        running = false
        return;
    end
    
    if screen then
        if event == "mouse_click" or event == "monitor_touch" then
            isTouching = event ~= "monitor_touch"

            for _, comp in pairs(screen.children) do
                if comp.checkTouch then
                    if comp:checkTouch(p2, p3) then
                        if comp.onClickEvent then
                            comp:onClickEvent(p2, p3)
                            drawScreens()
                        end
                        if isMonitor and comp.onDragEvent then
                            comp:onDragEvent(p2, p3)
                            drawScreens()
                        end
                        if isMonitor and comp.onReleaseEvent then
                            os.sleep(0.2)
                            comp:onReleaseEvent(p2, p3)
                            drawScreens()
                        end
                    end
                end
            end
        elseif event == "mouse_drag" and isTouching then
            if isTouching then
                for _, comp in pairs(screen.children) do
                    if comp.checkTouch and comp.onDragEvent then
                        if comp:checkTouch(p2, p3) then
                            comp:onDragEvent(p2, p3)
                            drawScreens()
                        end
                    end
                end
            end
        elseif event == "mouse_up" then
            isTouching = false

            for _, comp in pairs(screen.children) do
                if comp.onReleaseEvent then comp:onReleaseEvent(p2, p3) end
            end

            drawScreens()
        elseif event == "key" then
            -- local h = handlers[currentScreen]
            -- if h and h.onKeyPress then
            --     for kn, handler in pairs(h.onKeyPress) do
            --         if keys.getName(p1) == kn or kn == "any" then handler(p1) end
            --     end
            -- end
        elseif event == "timer" then
            -- local h = handlers[currentScreen]
            -- if h and h.onTimer then for _, fn in pairs(h.onTimer) do fn(p1) end end
        elseif event == "redstone" then
            -- local h = handlers[currentScreen]
            -- if h and h.onRedstone then h.onRedstone() end
        elseif event == "modem_message" then
            -- local h = handlers[currentScreen]
            -- if h and h.onModemMessage then for _, fn in pairs(h.onModemMessage) do fn(p1, p2, p3, p4, p5) end end
        end
    end
end