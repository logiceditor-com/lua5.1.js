////////////////////////////////////////////////////////////////////////////////
// lauxlib.h.js: Lua 5.1 C API, lauxlib.h definitions (fragment file)
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

C.luaL_getn = function(L,i) { return C.lua_objlen(L, i); };
C.luaL_setn = function(L,i,j) { };  /* no op! */

// C.luaI_openlib defined below

/* extra error code for `luaL_load' */
C.LUA_ERRFILE = (C.LUA_ERRERR+1);

/*
// TODO: Support these.
typedef struct luaL_Reg {
  const char *name;
  lua_CFunction func;
} luaL_Reg;

LUALIB_API void (luaI_openlib) (lua_State *L, const char *libname,
                                const luaL_Reg *l, int nup);
LUALIB_API void (luaL_register) (lua_State *L, const char *libname,
                                const luaL_Reg *l);
*/

C.luaL_getmetafield = F("luaL_getmetafield", int_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_callmeta = F("luaL_callmeta", int_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_typerror = F("luaL_typerror", int_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_argerror = F("luaL_argerror", int_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_checklstring = F("luaL_checklstring", const_char_ptr_t, [lua_State, int_t,
                                                          size_t_ptr_t]);
C.luaL_optlstring = F("luaL_optlstring", const_char_ptr_t, [lua_State, int_t,
                                          const_char_ptr_t, size_t_ptr_t]);
C.luaL_checknumber = F("luaL_checknumber", lua_Number, [lua_State, int_t]);
C.luaL_optnumber = F("luaL_optnumber", lua_Number, [lua_State, int_t, lua_Number]);

C.luaL_checkinteger = F("luaL_checkinteger", lua_Integer, [lua_State, int_t]);
C.luaL_optinteger = F("luaL_optinteger", lua_Integer, [lua_State, int_t,
                                          lua_Integer]);

C.luaL_checkstack = F("luaL_checkstack", void_t, [lua_State, int_t, const_char_ptr_t]);
C.luaL_checktype = F("luaL_checktype", void_t, [lua_State, int_t, int_t]);
C.luaL_checkany = F("luaL_checkany", void_t, [lua_State, int_t]);

C.luaL_newmetatable = F("luaL_newmetatable", int_t, [lua_State, const_char_ptr_t]);
C.luaL_checkudata = F("luaL_checkudata", void_ptr_t, [lua_State, int_t, const_char_ptr_t]);

C.luaL_where = F("luaL_where", void_t, [lua_State, int_t]);
/*
// TODO: Support these
LUALIB_API int (luaL_error) (lua_State *L, const char *fmt, ...);

LUALIB_API int (luaL_checkoption) (lua_State *L, int narg, const char *def,
                                   const char *const lst[]);
*/

C.luaL_ref = F("luaL_ref", int_t, [lua_State, int_t]);
C.luaL_unref = F("luaL_unref", void_t, [lua_State, int_t, int_t]);

C.luaL_loadfile = F("luaL_loadfile", int_t, [lua_State, const_char_ptr_t]);
C.luaL_loadbuffer = F("luaL_loadbuffer", int_t, [lua_State, const_char_ptr_t, size_t,
                                  const_char_ptr_t]);
C.luaL_loadstring = F("luaL_loadstring", int_t, [lua_State, const_char_ptr_t]);

C.luaL_newstate = F("luaL_newstate", lua_State, []);


C.luaL_gsub = F("luaL_gsub", const_char_ptr_t, [lua_State, const_char_ptr_t, const_char_ptr_t,
                                                  const_char_ptr_t]);

C.luaL_findtable = F("luaL_findtable", const_char_ptr_t, [lua_State, int_t,
                                         const_char_ptr_t, int_t]);

/*
** ===============================================================
** some useful macros
** ===============================================================
*/

C.luaL_argcheck = function(L, cond,numarg,extramsg) {
 if (!cond) { C.luaL_argerror(L, (numarg), (extramsg)); } };
C.luaL_checkstring = function(L,n) { return C.luaL_checklstring(L, (n), NULL); };
C.luaL_optstring = function(L,n,d) { return C.luaL_optlstring(L, (n), (d), NULL); };
C.luaL_checkint = C.luaL_checkinteger;
C.luaL_optint = C.luaL_optinteger;
C.luaL_checklong = C.luaL_checkinteger;
C.luaL_optlong = C.luaL_optinteger;

C.luaL_typename = function(L,i) { return C.lua_typename(L, C.lua_type(L,(i))); };

C.luaL_dofile = function(L, fn) {
 return (C.luaL_loadfile(L, fn) || C.lua_pcall(L, 0, C.LUA_MULTRET, 0)); };

C.luaL_dostring = function(L, s) {
 return (C.luaL_loadstring(L, s) || C.lua_pcall(L, 0, C.LUA_MULTRET, 0)); };

C.luaL_getmetatable = function(L,n) { return (C.lua_getfield(L, C.LUA_REGISTRYINDEX, (n))); };

C.luaL_opt = function(L,f,n,d) { return (C.lua_isnoneornil(L,(n)) ? (d) : f(L,(n))); };

/*
** {======================================================
** Generic Buffer manipulation
** =======================================================
*/

/*
// TODO: Support these
typedef struct luaL_Buffer {
  char *p;			/* current position in buffer * /
  int lvl;  /* number of strings in the stack (level) * /
  lua_State *L;
  char buffer[LUAL_BUFFERSIZE];
} luaL_Buffer;

#define luaL_addchar(B,c) \
  ((void)((B)->p < ((B)->buffer+LUAL_BUFFERSIZE) || luaL_prepbuffer(B)), \
   (*(B)->p++ = (char)(c)))

/* compatibility only * /
#define luaL_putchar(B,c)	luaL_addchar(B,c)

#define luaL_addsize(B,n)	((B)->p += (n))

LUALIB_API void (luaL_buffinit) (lua_State *L, luaL_Buffer *B);
LUALIB_API char *(luaL_prepbuffer) (luaL_Buffer *B);
LUALIB_API void (luaL_addlstring) (luaL_Buffer *B, const char *s, size_t l);
LUALIB_API void (luaL_addstring) (luaL_Buffer *B, const char *s);
LUALIB_API void (luaL_addvalue) (luaL_Buffer *B);
LUALIB_API void (luaL_pushresult) (luaL_Buffer *B);
*/

/* }====================================================== */

/* compatibility with ref system */

/* pre-defined references */
C.LUA_NOREF       = (-2);
C.LUA_REFNIL      = (-1);

C.lua_ref = function(L,lock)
{
  if (lock)
  {
    return C.luaL_ref(L, C.LUA_REGISTRYINDEX);
  }

  C.lua_pushstring(L, "unlocked references are obsolete");
  C.lua_error(L);
  return 0;
}

C.lua_unref = function(L,ref) { return C.luaL_unref(L, C.LUA_REGISTRYINDEX, (ref)); };

C.lua_getref = function(L,ref) { return C.lua_rawgeti(L, C.LUA_REGISTRYINDEX, (ref)); };

C.luaL_reg = C.luaL_Reg;
