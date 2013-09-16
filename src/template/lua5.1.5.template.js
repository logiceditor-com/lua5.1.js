////////////////////////////////////////////////////////////////////////////////
// lua5.1.5.js: Lua 5.1.5 in JavaScript
// This file is a part of lua5.1.js project:
// https://github.com/logiceditor-com/lua5.1.js/
// Copyright (c) LogicEditor <info@logiceditor.com>
// Copyright (c) lua5.1.js authors
// Distributed under the terms of the MIT license:
// https://github.com/logiceditor-com/lua5.1.js/tree/master/COPYRIGHT
// Based on original Lua 5.1.5 header files:
// Copyright (c) 1994-2012 Lua.org, PUC-Rio
////////////////////////////////////////////////////////////////////////////////
// WARNING: Emscriptenized code does not like minification.
//          Keep this file as is and enable compression in your HTTP server.
////////////////////////////////////////////////////////////////////////////////

var Lua5_1 = Lua5_1 || { };

////////////////////////////////////////////////////////////////////////////////

(function(Lua5_1) {

////////////////////////////////////////////////////////////////////////////////

/*{{lua5.1.5.js}}*/

////////////////////////////////////////////////////////////////////////////////

var C = { };

var F = Module.cwrap;

/*{{c_types.js}}*/
/*{{lua.h.js}}*/
/*{{lualib.h.js}}*/
/*{{lauxlib.h.js}}*/
////////////////////////////////////////////////////////////////////////////////

Lua5_1.C = C;
Lua5_1.Runtime = Runtime;

Lua5_1.provide_file = function(parent, name, data, can_read, can_write)
{
  if (typeof(parent) === "string" && parent !== "/")
  {
    if (parent.charAt(0) !== "/")
    {
      throw new Error("can't create relative path: `" + parent + "'");
    }
    parent = parent.substr(1);
    parent = FS.createPath("/", parent, true, true);
  }
  return FS.createDataFile(parent, name, data, can_read, can_write);
}

})(Lua5_1);
