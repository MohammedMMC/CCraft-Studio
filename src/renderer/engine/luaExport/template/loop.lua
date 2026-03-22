local isTouching = false

while running do
    local event, p1, p2, p3, p4, p5 = os.pullEvent()

    for _, comp in pairs(getScreen(currentScreen).children) do
        if comp.onEvent then comp:onEvent(event, p1, p2, p3, p4, p5) end
    end

    if event == "mouse_click" or event == "monitor_touch" then
        isTouching = true

        for _, comp in pairs(getScreen(currentScreen).children) do
            if comp.checkTouch and comp.onClickEvent then
                if comp:checkTouch(p1, p2, p3) then
                    comp:onClickEvent(p1, p2, p3)
                    drawCurrentScreen()
                end
            end
        end
    elseif event == "mouse_drag" and isTouching then
        if isTouching then
            for _, comp in pairs(getScreen(currentScreen).children) do
                if comp.checkTouch and comp.onDragEvent then
                    if comp:checkTouch(p1, p2, p3) then
                        comp:onDragEvent(p1, p2, p3)
                        drawCurrentScreen()
                    end
                end
            end
        end
    elseif event == "mouse_up" then
        isTouching = false

        for _, comp in pairs(getScreen(currentScreen).children) do
            if comp.onReleaseEvent then comp:onReleaseEvent(p1, p2, p3) end
        end

        drawCurrentScreen()
    elseif event == "key" then
        local h = handlers[currentScreen]
        if h and h.onKeyPress then
            for kn, handler in pairs(h.onKeyPress) do
                if keys.getName(p1) == kn or kn == "any" then handler(p1) end
            end
        end
    elseif event == "timer" then
        local h = handlers[currentScreen]
        if h and h.onTimer then for _, fn in pairs(h.onTimer) do fn(p1) end end
    elseif event == "redstone" then
        local h = handlers[currentScreen]
        if h and h.onRedstone then h.onRedstone() end
    elseif event == "modem_message" then
        local h = handlers[currentScreen]
        if h and h.onModemMessage then for _, fn in pairs(h.onModemMessage) do fn(p1, p2, p3, p4, p5) end end
    end
end
