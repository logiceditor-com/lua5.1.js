#! /usr/bin/env lua

--------------------------------------------------------------------------------
-- lua5.1.js-file-packer: a simple file packer tool for lua5.1.js
-- This file is a part of lua5.1.js project:
-- Copyright (c) LogicEditor <info@logiceditor.com>
-- Copyright (c) lua5.1.js authors
-- See file `COPYRIGHT` for the license
--------------------------------------------------------------------------------
-- Note: intentionally written with zero dependencies.
--------------------------------------------------------------------------------

local USAGE = [[
lua5.1.js-file-packer: a simple file packer tool for lua5.1.js

Usage:

    lua5.1.js-file-packer \
      [options] \
      output-filename \
      js-base-path \
      local-base-path \
      ...input-filenames

Example:

    lua5.1.js-file-packer \
      lua-nucleo.lua5.1.js \
      /lua-nucleo/ \
      ./ \
      ./lua-nucleo/*.lua

Options:

    --read-only   Pack file as read-only (default).
    --write-only  Pack file as write-only.
    --read-write  Pack file as read and write enabled.

    --as-text     Pack file as a text (default).
    --as-binary   Pack file as a binary array.

    --            End of options (useful if `output-filename' starts with `--').

    --help        Print this message and exit.

]]

--------------------------------------------------------------------------------

local options = { ["width"] = 80 }
local output_filename = nil
local js_base_path = nil
local local_base_path = nil
local input_filenames = { }
do
  local option_map =
  {
    ["--help"] = { "help", true };

    ["--read-only"]  = { "access", { read = true }, default = true };
    ["--write-only"] = { "access", { write = true } };
    ["--read-write"] = { "access", { read = true, write = true } };

    ["--as-text"]   = { "mode", "text", default = true };
    ["--as-binary"] = { "mode", "binary" };
  }

  local no_more_options = false
  for i = 1, select("#", ...) do
    local arg = select(i, ...)

    if not no_more_options and arg == "--" then
      no_more_options = true
      arg = nil
    end

    if not no_more_options and arg:find("^%-%-") then
      local option = option_map[arg]

      if not option then
        io.stderr:write("Error: Unknown option `", arg, "'\n\n", USAGE)
        os.exit(1)
      end

      if options[option[1]] ~= nil then
        io.stderr:write(
            "Error: option `", arg, "' conflicts with other options\n\n",
             USAGE
          )
        os.exit(1)
      end

      options[option[1]] = option[2]

      arg = nil
    end

    if arg ~= nil and not output_filename then
      output_filename = arg
      arg = nil
    end

    if arg ~= nil and not js_base_path then
      js_base_path = arg:gsub("([^/])$", "%1/"):gsub("^([^/])", "/%1")
      arg = nil
    end

    if arg ~= nil and not local_base_path then
      local_base_path = arg:gsub("([^/])$", "%1/")
      arg = nil
    end

    if arg ~= nil and local_base_path then
      input_filenames[#input_filenames + 1] = arg
      arg = nil
    end
  end

  if not output_filename then
    io.stderr:write("Error: missing `output-filename`\n\n", USAGE)
    os.exit(1)
  end

  if not js_base_path then
    io.stderr:write("Error: missing `js-base-path`\n\n", USAGE)
    os.exit(1)
  end

  if not local_base_path then
    io.stderr:write("Error: missing `local-base-path`\n\n", USAGE)
    os.exit(1)
  end

  if #input_filenames == 0 then
    io.stderr:write("Error: `input-filenames` can't be empty\n\n", USAGE)
    os.exit(1)
  end

  for _, option in pairs(option_map) do
    if option.default and options[option[1]] == nil then
      options[option[1]] = option[2]
    end
  end
end

--------------------------------------------------------------------------------

local escape_binary_for_json
do
  -- Based on luajson code
  -- https://github.com/harningt/luajson/blob/master/lua/json/encode/strings.lua

  local matches =
  {
    ['"'] = '\\"';
    ['\\'] = '\\\\';
    ['\b'] = '\\b';
    ['\f'] = '\\f';
    ['\n'] = '\\n';
    ['\r'] = '\\r';
    ['\t'] = '\\t';
    ['\v'] = '\\v'; -- not in official spec, on report, removing
  }

  for i = 0, 255 do
    local c = string.char(i)
    if c:match('[%z\1-\031\128-\255]') and not matches[c] then
      matches[c] = ('\\x%.2X'):format(i)
    end
  end

  escape_binary_for_json = function(s)
    return '"' .. s:gsub('[\\"/%z\1-\031\128-\255]', matches) .. '"'
  end
end

--------------------------------------------------------------------------------

if options["help"] then
  io.stdout:write(USAGE)
  os.exit(0)
end

--------------------------------------------------------------------------------

-- NOTE: We should write to a temporary file and rename it when we're done.
--       A bit hard to do in a cross-platform manner without dependencies,
--       so we don't. Pull requests are welcome.
local output = assert(io.open(output_filename, "w"))

local function cat(s)
  output:write(tostring(s))
  return cat
end

local Q = escape_binary_for_json

cat [[
// Generated by lua5.1.js-file-packer
(function(Lua5_1) {
]]

-- NOTE: Optimizable. Would probably be faster to read in chunks.
for i = 1, #input_filenames do
  local packed_filename = input_filenames[i]
  -- NOTE: This code would benefit from some path-handling dependencies.
  --       But we don't have them.
  if packed_filename:sub(1, #local_base_path) == local_base_path then
    packed_filename = packed_filename:sub(#local_base_path + 1)
  end

  local path, filename = packed_filename:match("(.-)([^/]+)$")

  local input = assert(io.open(input_filenames[i], "r"))

  cat [[
Lua5_1.provide_file(]] (Q(js_base_path .. path)) [[, ]] (Q(filename)) [[,]]

  if options["mode"] == "text" then
    cat "\n " (Q(input:read("*a")):gsub('\\n([^"])', '\\n"\n+"%1')) ",\n"
  else
    cat "[\n"

    local w = 0
    local need_comma = false
    local c = input:read(1)
    while c do
      local b = tostring(c:byte())
      local l = (need_comma and 1 or 0) + #b
      if w + l > options["width"] then
        w = 0
        cat ",\n"
        need_comma = false
      end

      if need_comma then
        cat ","
      end

      cat (b)

      w = w + l

      need_comma = true

      c = input:read(1)
    end

    input:close()
    input = nil

    cat "\n], "
  end

  cat (options["access"].read or false) [[, ]] (
      options["access"].write or false
    ) [[);
// End of ]] (js_base_path) (packed_filename) [[

]]
end

cat [[
})(Lua5_1);
]]

output:close()
output = nil
