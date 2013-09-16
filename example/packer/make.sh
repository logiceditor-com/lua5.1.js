#!/bin/bash

# ------------------------------------------------------------------------------

set -e

root="${BASH_SOURCE[0]}";
if [ -h "${root}" ]; then
  while [ -h "${root}" ]; do root=`readlink "${root}"`; done
fi
root=$(cd `dirname "${root}"` && cd ../.. && pwd) # Up two levels

# ------------------------------------------------------------------------------

"${root}/bin/lua5.1.js-file-packer" \
  "${root}/example/packer/html/example.lua5.1.js" \
  / \
  "${root}/example/packer/lua/" \
  $(find "${root}/example/packer/lua" -name '*.lua' -type f)
