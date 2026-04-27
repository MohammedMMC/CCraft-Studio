local isTouching = false

while running do
    drawScreens()
    local event, p1, p2, p3, p4, p5 = os.pullEvent()

    local isMonitor = event == "monitor_touch"
    local screen = getScreen(isMonitor and 'monitor:' .. p1 or 'terminal')

    if screen ~= nil then
        for _, comp in pairs(screen.children) do
            for key, fn in pairs(comp.events) do
                if event == key then
                    if type(fn) == "function" then
                        fn(p1, p2, p3, p4, p5)
                    elseif type(fn) == "table" then
                        for _, fn2 in pairs(fn) do
                            fn2(p1, p2, p3, p4, p5)
                        end
                    end
                end
            end
        end

        if event == "close" then
            running = false
            return;
        end

        if screen then
            if event == "timer" then
                screen.events.onTimer["t_" .. p1]()
            elseif event == "redstone" then
                screen.events.onRedstone()
            elseif event == "modem_message" then
                screen.events.onModemMessage["ch_" .. p1](p2, p3, p4, p5)
            elseif event == "key" then
                if screen.events.onKeyPress and screen.events.onKeyPress[p1] then
                    screen.events.onKeyPress[p1]()
                end
            end

            if event == "mouse_click" or event == "monitor_touch" then
                isTouching = event ~= "monitor_touch"

                for _, comp in pairs(screen.children) do
                    if comp.type == 'input' and comp.isFocused then
                        screen:setBlinking(false)
                        comp.isFocused = false
                        drawScreens()
                    end
                end

                local touchedElement = screen:getTopTouchedElement(p2, p3)
                if touchedElement then
                    if touchedElement.onClickEvent then
                        touchedElement:onClickEvent(p2, p3)
                        drawScreens()
                    end
                    if isMonitor and touchedElement.onDragEvent then
                        touchedElement:onDragEvent(p2, p3)
                        drawScreens()
                    end
                    if isMonitor and touchedElement.onReleaseEvent then
                        os.sleep(0.2)
                        touchedElement:onReleaseEvent(p2, p3)
                        drawScreens()
                    end
                end
            elseif event == "mouse_drag" and isTouching then
                if isTouching then
                    local touchedElement = screen:getTopTouchedElement(p2, p3)
                    if touchedElement and touchedElement.onDragEvent then
                        touchedElement:onDragEvent(p2, p3)
                        drawScreens()
                    end
                end
            elseif event == "mouse_up" then
                isTouching = false

                -- local touchedElement = screen:getTopTouchedElement(p2, p3)
                -- if touchedElement and touchedElement.onReleaseEvent then
                --     touchedElement:onReleaseEvent(p2, p3)
                --     drawScreens()
                -- end
                for _, comp in pairs(screen.children) do
                    if comp.onReleaseEvent then comp:onReleaseEvent(p2, p3) end
                end
            elseif event == "key" then
                for _, comp in pairs(screen.children) do
                    if comp.isFocused and comp.onkeyEvent then
                        comp:onkeyEvent(p1)
                        drawScreens()
                    end
                end
            elseif event == "char" then
                for _, comp in pairs(screen.children) do
                    if comp.isFocused and comp.onCharEvent then
                        comp:onCharEvent(p1)
                        drawScreens()
                    end
                end
            end
        end
    end
end
