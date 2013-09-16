#!/bin/bash

# ------------------------------------------------------------------------------

set -e

root="${BASH_SOURCE[0]}";
if [ -h "${root}" ]; then
  while [ -h "${root}" ]; do root=`readlink "${root}"`; done
fi
root=$(cd `dirname "${root}"` && pwd)

# ------------------------------------------------------------------------------

TEMPLATEFILE=${TEMPLATEFILE:-"${root}/src/template/lua5.1.5.template.js"}
FRAGMENTDIR=${FRAGMENTDIR:-"${root}/src/js"}
GENERATEDDIR=${GENERATEDDIR:-"${root}/src/generated"}
OUTDIR=${OUTDIR:-"${root}/src/min"}
OUTFILE=${OUTFILE:-"${OUTDIR}/lua5.1.5.min.js"}

LUASRCDIR=${LUASRCDIR:-"${root}/lib/lua-5.1.5/src"}
LUAJS=${LUAJS:-"${GENERATEDDIR}/lua5.1.5.js"}

# ------------------------------------------------------------------------------

if [ "${1}" == "--run-emscripten" ]; then

  echo "Building ${LUAJS} with emscripten..."

  EMCC=${EMCC:-$(which emcc || true)}
  EMCC=${EMCC:-${HOME}/projects/emscripten/emcc}
  if [ ! -x ${EMCC} ]; then
    echo "Emscripten's emcc not found." >&2
    echo "See README for installation instructions." >&2
    exit 1
  fi

  EMCCFLAGS=${EMCCFLAGS:-'-O2'}

  cd ${LUASRCDIR}

  exported_functions=$(
    grep 'LUA.*_API' lua.h lauxlib.h lualib.h \
    | sed -e 's/.*[ (*]\(lua[LIa-z_]\+\).*(.*/\1/g' \
    | sed -e "s/\(.*\)/'_\1',/g" \
    | sed ':a;N;$!ba;s/\n/ /g' \
    )

  # TODO: Would it be enough? Need better tests.
  reserved_function_pointers=$(wc -w <<<$exported_functions)

  mkdir -p "${GENERATEDDIR}"

  "${EMCC}" \
    ${EMCCFLAGS} \
    -s EXPORTED_FUNCTIONS="[${exported_functions}]" \
    -s RESERVED_FUNCTION_POINTERS="${reserved_function_pointers}" \
    -o "${LUAJS}" \
    lapi.c lcode.c ldebug.c ldo.c ldump.c lfunc.c lgc.c llex.c lmem.c \
    lobject.c lopcodes.c lparser.c lstate.c lstring.c ltable.c ltm.c lundump.c \
    lvm.c lzio.c lauxlib.c lbaselib.c ldblib.c liolib.c lmathlib.c loslib.c \
    ltablib.c lstrlib.c loadlib.c linit.c

else

  echo "Skipping generation of lua.js (use --run-emscripten to do it)..."

fi

# ------------------------------------------------------------------------------

echo "Generating ${OUTFILE}..."

mkdir -p "${OUTDIR}"

${root}/bin/generator \
  "${OUTFILE}" \
  "${TEMPLATEFILE}" \
  "${LUAJS}" \
  "${FRAGMENTDIR}"/*.js

# ------------------------------------------------------------------------------

echo "OK"
