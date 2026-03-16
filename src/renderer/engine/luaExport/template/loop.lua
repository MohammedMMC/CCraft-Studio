local focusedButton = nil
while running do
    local event, p1, p2, p3, p4, p5 = os.pullEvent()
    if event == "mouse_click" or event == "monitor_touch" then
        local button, mx, my = p1, p2, p3
        if event == "monitor_touch" then mx, my = p2, p3 end
        local sc = screenComponents[currentScreen]
        for _, btn in ipairs(buttonRegions[currentScreen] or {}) do
            local comp = sc and sc[btn.name:gsub("[^%w_]", "_")]
            if comp and comp.visible ~= false and mx >= btn.x and mx < btn.x + btn.w and my >= btn.y and my < btn.y + btn.h then
                local h = handlers[currentScreen]
                if h and h.onButtonClick[btn.name] then h.onButtonClick[btn.name](mx, my, button) end
                focusedButton = btn.name
                if h and h.onButtonFocus[btn.name] then h.onButtonFocus[btn.name](mx, my, button) end
                if comp.drawFocused then comp:drawFocused() end
                break
            end
        end
    elseif event == "mouse_up" then
        if focusedButton then
            local h = handlers[currentScreen]
            if h and h.onButtonRelease[focusedButton] then h.onButtonRelease[focusedButton](p2, p3, p1) end
            focusedButton = nil
            drawCurrentScreen()
        end
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
