{ pkgs, lib, config, inputs, ... }:

{
  packages = [ pkgs.git pkgs.nodejs_24 ];
  languages.typescript.enable = true;
}
