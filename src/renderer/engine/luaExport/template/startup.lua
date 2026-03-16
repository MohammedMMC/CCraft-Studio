-- Get Script Directory
local script_dir = ""
if shell and shell.getRunningProgram then
    local prog = shell.getRunningProgram()
    local dir = prog:match("(.*/)") or ""
    script_dir = dir
end

-- Load Utilities
dofile(script_dir .. "utils/vars.lua")
if fs.exists(script_dir .. "utils/functions.lua") then
    dofile(script_dir .. "utils/functions.lua")
end

-- Load Components
for _, file in ipairs(fs.list(script_dir .. "components")) do
    dofile(script_dir .. "components/" .. file)
end

-- Load Screens
for _, file in ipairs(fs.list(script_dir .. "screens")) do
    dofile(script_dir .. "screens/" .. file)
end

-- Load Handlers
if fs.exists(script_dir .. "utils/handlers.lua") then
    dofile(script_dir .. "utils/handlers.lua")
end

-- Load Logic
if fs.exists(script_dir .. "logic") then
    for _, file in ipairs(fs.list(script_dir .. "logic")) do
        dofile(script_dir .. "logic/" .. file)
    end
end

-- Project Start
-- {PROJECT_START}