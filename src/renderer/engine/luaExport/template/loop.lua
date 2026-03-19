local isTouching = false

while running do
    local event, p1, p2, p3, p4, p5 = os.pullEvent()

    if event == "mouse_click" or event == "monitor_touch" then
        isTouching = true
        local button, mx, my = p1, p2, p3

        local sc = screenComponents[currentScreen]
        for _, btn in ipairs(buttonRegions[currentScreen] or {}) do
            local comp = sc and sc[btn.name:gsub("[^%w_]", "_")]
            if comp and comp.visible ~= false and mx >= btn.x and mx < btn.x + btn.w and my >= btn.y and my < btn.y + btn.h then
                local h = handlers[currentScreen]
                if h and h.onButtonClick[btn.name] then h.onButtonClick[btn.name](mx, my, button) end
                if h and h.onButtonFocus[btn.name] then h.onButtonFocus[btn.name](mx, my, button) end
                if (comp.type == "button") then comp.isFocused = true end
                drawCurrentScreen()
                break
            end
        end
    elseif event == "mouse_drag" and isTouching then
        local button, mx, my = p1, p2, p3
        if isTouching then
            for _, comp in pairs(screenComponents[currentScreen] or {}) do
                if comp.type == "slider" then
                    comp:checkTouch(mx, my, button)
                end
            end
            drawCurrentScreen()
        end
    elseif event == "mouse_up" then
        isTouching = false
        local button, mx, my = p1, p2, p3
        local sc = screenComponents[currentScreen]
        for _, btn in ipairs(buttonRegions[currentScreen] or {}) do
            local comp = sc and sc[btn.name:gsub("[^%w_]", "_")]
            if comp and comp.visible ~= false and mx >= btn.x and mx < btn.x + btn.w and my >= btn.y and my < btn.y + btn.h then
                local h = handlers[currentScreen]
                if h and h.onButtonRelease[btn.name] then h.onButtonRelease[btn.name](mx, my, button) end
                if (comp.type == "button") then comp.isFocused = false end
                drawCurrentScreen()
                break
            end
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
