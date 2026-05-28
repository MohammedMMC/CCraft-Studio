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
if fs.exists(script_dir .. "components") then
    for _, file in ipairs(fs.list(script_dir .. "components")) do
        dofile(script_dir .. "components/" .. file)
    end
end

-- Load Screens
if fs.exists(script_dir .. "screens") then
    for _, file in ipairs(fs.list(script_dir .. "screens")) do
        dofile(script_dir .. "screens/" .. file)
    end
end

-- Load Logic
if fs.exists(script_dir .. "logic") then
    for _, file in ipairs(fs.list(script_dir .. "logic")) do
        dofile(script_dir .. "logic/" .. file)
    end
end

-- Project Start
-- {PROJECT_START}
