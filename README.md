lua5.1.js: Lua 5.1, emscriptinized to JavaScript, with low-level API
====================================================================

```
lua5.1.js: Copyright (c) 2013, LogicEditor <info@logiceditor.com>
           Copyright (c) 2013, le-dsl-fsm authors (see `AUTHORS`)
```

Contains original Lua 5.1.5 implementation:

```
Lua 5.1:  Copyright (c) 1994-2012 Lua.org, PUC-Rio (http://lua.org)
```

See file `COPYRIGHT` for the license.

Project status:
---------------

Current version v0.9.0 is a community preview version.

This project is in early stages of its development. Early adopters
are welcome. Production users should probably wait for a next release
with better test coverage and more stable API.

API:
----

Pretty much all Lua C API should be supported. (Much of it untested though.)
See the `TODO` file for a list of unsupported API items.

**TODO:** Document API properly.

Convention: all C numeric types are JS `number`s, all C strings are JS `string`s, all other C pointers (including function pointers) are
JS `number`s.

To use function pointers, you have to call Emscripten's `Runtime.addFunction()`.

API usage example:

```JavaScript
var C = Lua5_1.C;

var L = C.lua_open();
C.luaL_openlibs(L);

C.lua_pushcfunction(
    L,
    Lua5_1.Runtime.addFunction(
        function(L)
        {
          var str = C.luaL_checkstring(L, 1);
          alert("{Lua} " + str);
          return 0;
        }
      )
  );
C.lua_setglobal(L, "ALERT");

if (C.luaL_dostring(L, "ALERT('Hello, world')") != 0)
{
  var err = C.lua_tostring(L, -1);
  C.lua_close(L);
  L = 0;
  throw new Error("Lua error: " + err);
}
```

Refer to Emscripten docs if you need more information:

https://github.com/kripken/emscripten/wiki/Interacting-with-code

Note: Pull requests to improve this document are very welcome.

How to build lua5.1.5.js:
------------------------

**NOTE:** You do not need to build `lua5.1.5.js` to use it.
          Just grab a minified file from `src/min/`, and go.

To rebuild `src/min/lua5.1.5-*.js`:

1. Install Lua 5.1.
2. Run `./make.sh`.

If you want to rebuild the Lua VM itself, you need to do a few extra steps:

(Note that you're most likely do not need to do that to contribute
to the project -- just change files in `src/js/` and run `./make.sh`
without arguments.)

Instructions for a recent Ubuntu OS:

1. Install `emscripten` as described here:

   https://github.com/kripken/emscripten/wiki/Getting-Started-on-Ubuntu-12.10

   (You're advised to do that in a clean lxc container, Emscripten and
   dependencies are rather brittle. Unclean system can complicate things.)

2. Check `./make.sh` for environment variables you might want to change.

3. Run `./make.sh --run-emscripten`.

FAQ:
----

1. **Q:** The code in `src/min/` does not look minified.

   **A:** Because it is not minified. But minification of emscriptenized code
   is tricky. We'll get there when (if) `emcc -O2` itself will output minified
   code. Meanwhile, enable compression in your HTTP server
   or try building with `EMCCFLAGS=-O1`.

   Note that, for the reason outlined above, it is recommended that you keep
   this library in a separate file, not bundle it with other JS code.

See also:
---------

File `TODO` in the distribution and issues at GitHub.
