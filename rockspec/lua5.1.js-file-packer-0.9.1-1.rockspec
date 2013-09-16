package = "lua5.1.js-file-packer"
version = "0.9.1-1"
source =
{
  url = "git://github.com/logiceditor-com/lua5.1.js";
  branch = "v0.9.1";
  dir = "lua5.1.js";
}
description =
{
  summary = "A simple file packer tool for lua5.1.js";
  homepage = "https://github.com/logiceditor-com/lua5.1.js";
  license = "MIT/X11";
  maintainer = "LogicEditor Team <team@logiceditor.com>";
}
dependencies =
{
  "lua == 5.1";
}
build =
{
  type = "none";
  install =
  {
    bin =
    {
      "bin/lua5.1.js-file-packer";
    }
  }
}
