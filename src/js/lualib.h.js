////////////////////////////////////////////////////////////////////////////////
// lualib.h.js: Lua 5.1 C API, lualib.h definitions (fragment file)
// This file is a part of lua5.1.js project:
// Copyright (c) LogicEditor <info@logiceditor.com>
// Copyright (c) lua5.1.js authors
// See file `COPYRIGHT` for the license
// Based on original Lua 5.1.5 header files:
// Copyright (c) 1994-2012 Lua.org, PUC-Rio
////////////////////////////////////////////////////////////////////////////////
// Note: Keeping this file as close to Lua sources as possible.
//       This includes avoiding breaking lines at 80 char limit
//       to keep original formatting despite JS code being somewhat longer.
////////////////////////////////////////////////////////////////////////////////

/* Key to file-handle type */
C.LUA_FILEHANDLE = "FILE*";

C.LUA_COLIBNAME = "coroutine";
C.luaopen_base = F("luaopen_base", int_t, [lua_State]);

C.LUA_TABLIBNAME = "table";
C.luaopen_table = F("luaopen_table", int_t, [lua_State]);

C.LUA_IOLIBNAME = "io";
C.luaopen_io = F("luaopen_io", int_t, [lua_State]);

C.LUA_OSLIBNAME = "os";
C.luaopen_os = F("luaopen_os", int_t, [lua_State]);

C.LUA_STRLIBNAME = "string";
C.luaopen_string = F("luaopen_string", int_t, [lua_State]);

C.LUA_MATHLIBNAME = "math";
C.luaopen_math = F("luaopen_math", int_t, [lua_State]);

C.LUA_DBLIBNAME = "debug";
C.luaopen_debug = F("luaopen_debug", int_t, [lua_State]);

C.LUA_LOADLIBNAME = "package";
C.luaopen_package = F("luaopen_package", int_t, [lua_State]);

/* open all previous libraries */
C.luaL_openlibs = F("luaL_openlibs", void_t, [lua_State]);

C.lua_assert = function() { }; // Do nothing.
