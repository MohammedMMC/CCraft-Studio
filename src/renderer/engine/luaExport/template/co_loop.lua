local mainTimerId = os.startTimer(0.05)

while running do
    local screen = getScreen()
    if (not screen.events.onceLoadedRunned and screen.events.onceLoaded) then
        screen.events.onceLoadedRunned = true
        screen.events.onceLoaded()
    end

    local event, p1, p2, p3, p4, p5 = os.pullEvent()

    if event == "close" then
        running = false
        return;
    end

    if event == "timer" and p1 == mainTimerId then
        local now = os.clock()
        for _, t in ipairs(screen.events.onTimer) do
            if now - t.last >= t.interval then
                t.last = now
                t.func()
            end
        end
        mainTimerId = os.startTimer(0.05)
    elseif event == "redstone" then
        screen.events.onRedstone()
    elseif event == "modem_message" then
        screen.events.onModemMessage["ch_" .. p1](p2, p3, p4, p5)
    elseif event == "key" and p1 then
        keyName = keys.getName(p1)
        if screen.events.onKeyPress then
            if screen.events.onKeyPress[keyName] then
                screen.events.onKeyPress[keyName]()
            elseif screen.events.onKeyPress["any"] then
                screen.events.onKeyPress["any"]()
            end
        end
    end
end
