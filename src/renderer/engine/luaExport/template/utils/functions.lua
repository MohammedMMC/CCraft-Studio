-- =============================================
-- Global Functions
-- =============================================

function list_reverse(list)
    local r = {}
    for i = #list, 1, -1 do
        r[#r + 1] = list[i]
    end
    return r
end

function list_indexOf(list, value, mode)
    for i = mode == 1 and #list or 1, mode == 1 and 1 or #list, mode == 1 and -1 or 1 do
        if list[i] == value then return i end
    end
end

local function list_joinsplit(textlist, mode, delimiter)
    if mode == "SPLIT" then
        local result = {}
        for match in (textlist .. delimiter):gmatch("(.-)" .. delimiter:gsub("([%^%$%(%)%%%.%[%]%*%+%-%?])", "%%%1")) do
            table.insert(result, match)
        end
        return result
    else
        return table.concat(textlist, delimiter)
    end
end

local function list_sort(list, type, direction)
    table.sort(list, function(a, b)
        local x, y = a, b
        if type == "IGNORE_CASE" then
            x, y = string.lower(a), string.lower(b)
        elseif type == "NUMERIC" then
            x, y = tonumber(a), tonumber(b)
        end
        return direction == 1 and x < y or x > y
    end)
    return list
end

function list_getSubList(list, fromType, fromValue, toType, toValue)
    local len = #list

    local function resolveIndex(t, v)
        if t == "FIRST" then
            return 1
        elseif t == "LAST" then
            return len
        elseif t == "FROM_START" then
            return v
        elseif t == "FROM_END" then
            return len - v + 1
        end
    end

    local startIndex = resolveIndex(fromType, fromValue)
    local endIndex = resolveIndex(toType, toValue)

    local r = {}

    for i = startIndex, endIndex do
        r[#r + 1] = list[i]
    end

    return r
end