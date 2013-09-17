////////////////////////////////////////////////////////////////////////////////
// lua.h.js: Lua 5.1 C API, lua.h definitions (fragment file)
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

var lua_Number = "number";
var lua_Integer = "number";

C.LUA_VERSION     = "Lua 5.1";
C.LUA_RELEASE     = "Lua 5.1.5";
C.LUA_VERSION_NUM = 501;
C.LUA_COPYRIGHT   = "Copyright (C) 1994-2012 Lua.org, PUC-Rio";
C.LUA_AUTHORS     = "R. Ierusalimschy, L. H. de Figueiredo & W. Celes";

/* mark for precompiled code (`<esc>Lua') */
C.LUA_SIGNATURE = "\033Lua";

/* option for multiple returns in `lua_pcall' and `lua_call' */
C.LUA_MULTRET = (-1);

/*
** pseudo-indices
*/
C.LUA_REGISTRYINDEX = (-10000);
C.LUA_ENVIRONINDEX  = (-10001);
C.LUA_GLOBALSINDEX  = (-10002);
C.lua_upvalueindex  = function(i) { return (C.LUA_GLOBALSINDEX-(i)); };

/* thread status; 0 is OK */
C.LUA_YIELD     = 1;
C.LUA_ERRRUN    = 2;
C.LUA_ERRSYNTAX = 3;
C.LUA_ERRMEM    = 4;
C.LUA_ERRERR    = 5;

var lua_State = "number";

// typedef int (*lua_CFunction) (lua_State *L);
var lua_CFunction = "number";

/*
** functions that read/write blocks when loading/dumping Lua chunks
*/
// typedef const char * (*lua_Reader) (lua_State *L, void *ud, size_t *sz);
var lua_Reader = "number";

// typedef int (*lua_Writer) (lua_State *L, const void* p, size_t sz, void* ud);
var lua_Writer = "number";

/*
** prototype for memory-allocation functions
*/
// typedef void * (*lua_Alloc) (void *ud, void *ptr, size_t osize, size_t nsize);
var lua_Alloc = "number";

/*
** basic types
*/
C.LUA_TNONE = (-1);

C.LUA_TNIL           = 0;
C.LUA_TBOOLEAN       = 1;
C.LUA_TLIGHTUSERDATA = 2;
C.LUA_TNUMBER        = 3;
C.LUA_TSTRING        = 4;
C.LUA_TTABLE         = 5;
C.LUA_TFUNCTION      = 6;
C.LUA_TUSERDATA      = 7;
C.LUA_TTHREAD        = 8;

/* minimum Lua stack available to a C function */
C.LUA_MINSTACK = 20;

/* type of numbers in Lua */
var LUA_NUMBER = lua_Number;

/* type for integer functions */
var LUA_INTEGER = lua_Integer;

/*
** state manipulation
*/
C.lua_newstate = F("lua_newstate", lua_State, [lua_Alloc, void_ptr_t]);
C.lua_close = F("lua_close", void_t, [lua_State]);
C.lua_newthread = F("lua_newthread", lua_State, [lua_State]);

C.lua_atpanic = F("lua_atpanic", lua_CFunction, [lua_State, lua_CFunction]);

/*
** basic stack manipulation
*/
C.lua_gettop = F("lua_gettop", int_t, [lua_State]);
C.lua_settop = F("lua_settop", void_t, [lua_State, int_t]);
C.lua_pushvalue = F("lua_pushvalue", void_t, [lua_State, int_t]);
C.lua_remove = F("lua_remove", void_t, [lua_State, int_t]);
C.lua_insert = F("lua_insert", void_t, [lua_State, int_t]);
C.lua_replace = F("lua_replace", void_t, [lua_State, int_t]);
C.lua_checkstack = F("lua_checkstack", int_t, [lua_State, int_t]);

C.lua_xmove = F("lua_xmove", void_t, [lua_State, lua_State, int_t]);

/*
** access functions (stack -> C)
*/

C.lua_isnumber = F("lua_isnumber", int_t, [lua_State, int_t]);
C.lua_isstring = F("lua_isstring", int_t, [lua_State, int_t]);
C.lua_iscfunction = F("lua_iscfunction", int_t, [lua_State, int_t]);
C.lua_isuserdata = F("lua_isuserdata", int_t, [lua_State, int_t]);
C.lua_type = F("lua_type", int_t, [lua_State, int_t]);
C.lua_typename = F("lua_typename", const_char_ptr_t, [lua_State, int_t]);

C.lua_equal = F("lua_equal", int_t, [lua_State, int_t, int_t]);
C.lua_rawequal = F("lua_rawequal", int_t, [lua_State, int_t, int_t]);
C.lua_lessthan = F("lua_lessthan", int_t, [lua_State, int_t, int_t]);

C.lua_tonumber = F("lua_tonumber", lua_Number, [lua_State, int_t]);
C.lua_tointeger = F("lua_tointeger", lua_Integer, [lua_State, int_t]);
C.lua_toboolean = F("lua_toboolean", int_t, [lua_State, int_t]);
C.lua_tolstring = F("lua_tolstring", const_char_ptr_t, [lua_State, int_t, size_t_ptr_t]);
C.lua_objlen = F("lua_objlen", size_t, [lua_State, int_t]);
C.lua_tocfunction = F("lua_tocfunction", lua_CFunction, [lua_State, int_t]);
C.lua_touserdata = F("lua_touserdata", void_ptr_t, [lua_State, int_t]);
C.lua_tothread = F("lua_tothread", lua_State, [lua_State, int_t]);
C.lua_topointer = F("lua_topointer", const_void_ptr_t, [lua_State, int_t]);

/*
** push functions (C -> stack)
*/
C.lua_pushnil = F("lua_pushnil", void_t, [lua_State]);
C.lua_pushnumber = F("lua_pushnumber", void_t, [lua_State, lua_Number]);
C.lua_pushinteger = F("lua_pushinteger", void_t, [lua_State, lua_Integer]);
C.lua_pushlstring = F("lua_pushlstring", void_t, [lua_State, const_char_ptr_t, size_t]);
C.lua_pushstring = F("lua_pushstring", void_t, [lua_State, const_char_ptr_t]);
/*
// TODO: Support these.
LUA_API const char *(lua_pushvfstring) (lua_State *L, const char *fmt,
                                                      va_list argp);
LUA_API const char *(lua_pushfstring) (lua_State *L, const char *fmt, ...);
*/
C.lua_pushcclosure = F("lua_pushcclosure", void_t, [lua_State, lua_CFunction, int_t]);
C.lua_pushboolean = F("lua_pushboolean", void_t, [lua_State, int_t]);
C.lua_pushlightuserdata = F("lua_pushlightuserdata", void_t, [lua_State, void_ptr_t]);
C.lua_pushthread = F("lua_pushthread", int_t, [lua_State]);

/*
** get functions (Lua -> stack)
*/
C.lua_gettable = F("lua_gettable", void_t, [lua_State, int_t]);
C.lua_getfield = F("lua_getfield", void_t, [lua_State, int_t, const_char_ptr_t]);
C.lua_rawget = F("lua_rawget", void_t, [lua_State, int_t]);
C.lua_rawgeti = F("lua_rawgeti", void_t, [lua_State, int_t, int_t]);
C.lua_createtable = F("lua_createtable", void_t, [lua_State, int_t, int_t]);
C.lua_newuserdata = F("lua_newuserdata", void_ptr_t, [lua_State, size_t]);
C.lua_getmetatable = F("lua_getmetatable", int_t, [lua_State, int_t]);
C.lua_getfenv = F("lua_getfenv", void_t, [lua_State, int_t]);

/*
** set functions (stack -> Lua)
*/
C.lua_settable = F("lua_settable", void_t, [lua_State, int_t]);
C.lua_setfield = F("lua_setfield", void_t, [lua_State, int_t, const_char_ptr_t]);
C.lua_rawset = F("lua_rawset", void_t, [lua_State, int_t]);
C.lua_rawseti = F("lua_rawseti", void_t, [lua_State, int_t, int_t]);
C.lua_setmetatable = F("lua_setmetatable", int_t, [lua_State, int_t]);
C.lua_setfenv = F("lua_setfenv", int_t, [lua_State, int_t]);

/*
** `load' and `call' functions (load and run Lua code)
*/
C.lua_call = F("lua_call", void_t, [lua_State, int_t, int_t]);
C.lua_pcall = F("lua_pcall", int_t, [lua_State, int_t, int_t, int_t]);
C.lua_cpcall = F("lua_cpcall", int_t, [lua_State, lua_CFunction, void_ptr_t]);
C.lua_load = F("lua_load", int_t, [lua_State, lua_Reader, void_ptr_t,
                                        const_char_ptr_t]);

C.lua_dump = F("lua_dump", int_t, [lua_State, lua_Writer, void_ptr_t]);

/*
** coroutine functions
*/
C.lua_yield = F("lua_yield", int_t, [lua_State, int_t]);
C.lua_resume = F("lua_resume", int_t, [lua_State, int_t]);
C.lua_status = F("lua_status", int_t, [lua_State]);

/*
** garbage-collection function and options
*/

C.LUA_GCSTOP       = 0;
C.LUA_GCRESTART    = 1;
C.LUA_GCCOLLECT    = 2;
C.LUA_GCCOUNT      = 3;
C.LUA_GCCOUNTB     = 4;
C.LUA_GCSTEP       = 5;
C.LUA_GCSETPAUSE   = 6;
C.LUA_GCSETSTEPMUL = 7;

C.lua_gc = F("lua_gc", int_t, [lua_State, int_t, int_t]);

/*
** miscellaneous functions
*/

C.lua_error = F("lua_error", int_t, [lua_State]);

C.lua_next = F("lua_next", int_t, [lua_State, int_t]);

C.lua_concat = F("lua_concat", void_t, [lua_State, int_t]);

C.lua_getallocf = F("lua_getallocf", lua_Alloc, [lua_State, void_ptr_t_ptr_t]);
C.lua_setallocf = F("lua_setallocf", void_t, [lua_State, lua_Alloc, void_ptr_t]);

/*
** ===============================================================
** some useful macros
** ===============================================================
*/

C.lua_pop = function(L,n) { return C.lua_settop(L, -(n)-1); };

C.lua_newtable = function(L) { return C.lua_createtable(L, 0, 0); };

C.lua_register = function(L,n,f) { return (C.lua_pushcfunction(L, (f)), C.lua_setglobal(L, (n))); };

C.lua_pushcfunction = function(L,f) { return C.lua_pushcclosure(L, (f), 0); };

C.lua_strlen = function(L,i) { return C.lua_objlen(L, (i)); };

C.lua_isfunction = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TFUNCTION); };
C.lua_istable = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TTABLE); };
C.lua_islightuserdata = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TLIGHTUSERDATA); };
C.lua_isnil = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TNIL); };
C.lua_isboolean = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TBOOLEAN); };
C.lua_isthread = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TTHREAD); };
C.lua_isnone = function(L,n) { return (C.lua_type(L, (n)) === C.LUA_TNONE); };
C.lua_isnoneornil = function(L, n) { return (C.lua_type(L, (n)) <= 0); };

C.lua_pushliteral = C.lua_pushstring;

C.lua_setglobal = function(L,s) { return C.lua_setfield(L, C.LUA_GLOBALSINDEX, (s)); };
C.lua_getglobal = function(L,s) { return C.lua_getfield(L, C.LUA_GLOBALSINDEX, (s)); };

C.lua_tostring = function(L,i) { return C.lua_tolstring(L, (i), NULL); };

/*
** compatibility macros and functions
*/

C.lua_open = function() { return C.luaL_newstate(); };

C.lua_getregistry = function(L) { return C.lua_pushvalue(L, C.LUA_REGISTRYINDEX); };

C.lua_getgccount = function(L) { return C.lua_gc(L, C.LUA_GCCOUNT, 0); }

var lua_Chunkreader = lua_Reader;
var lua_Chunkwriter = lua_Writer;

/* hack */
C.lua_setlevel = F("lua_setlevel", void_t, [lua_State, lua_State]);

/*
** {======================================================================
** Debug API
** =======================================================================
*/

/*
** Event codes
*/
C.LUA_HOOKCALL    = 0;
C.LUA_HOOKRET     = 1;
C.LUA_HOOKLINE    = 2;
C.LUA_HOOKCOUNT   = 3;
C.LUA_HOOKTAILRET = 4;

/*
** Event masks
*/
C.LUA_MASKCALL  = (1 << C.LUA_HOOKCALL);
C.LUA_MASKRET   = (1 << C.LUA_HOOKRET);
C.LUA_MASKLINE  = (1 << C.LUA_HOOKLINE);
C.LUA_MASKCOUNT = (1 << C.LUA_HOOKCOUNT);

// TODO: Support these. (Note LUA_IDSIZE.)
/*
typedef struct lua_Debug lua_Debug;  /* activation record * /

/* Functions to be called by the debuger in specific events * /
typedef void (*lua_Hook) (lua_State *L, lua_Debug *ar);

LUA_API int lua_getstack (lua_State *L, int level, lua_Debug *ar);
LUA_API int lua_getinfo (lua_State *L, const char *what, lua_Debug *ar);
LUA_API const char *lua_getlocal (lua_State *L, const lua_Debug *ar, int n);
LUA_API const char *lua_setlocal (lua_State *L, const lua_Debug *ar, int n);
LUA_API const char *lua_getupvalue (lua_State *L, int funcindex, int n);
LUA_API const char *lua_setupvalue (lua_State *L, int funcindex, int n);

LUA_API int lua_sethook (lua_State *L, lua_Hook func, int mask, int count);
LUA_API lua_Hook lua_gethook (lua_State *L);
LUA_API int lua_gethookmask (lua_State *L);
LUA_API int lua_gethookcount (lua_State *L);

struct lua_Debug {
  int event;
  const char *name;	/* (n) * /
  const char *namewhat;	/* (n) `global', `local', `field', `method' * /
  const char *what;	/* (S) `Lua', `C', `main', `tail' * /
  const char *source;	/* (S) * /
  int currentline;	/* (l) * /
  int nups;		/* (u) number of upvalues * /
  int linedefined;	/* (S) * /
  int lastlinedefined;	/* (S) * /
  char short_src[LUA_IDSIZE]; /* (S) * /
  /* private part * /
  int i_ci;  /* active function * /
};
*/
