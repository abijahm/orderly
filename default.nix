# using nix package manager install bun for this project using mkShell
{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    buildInputs = [
      pkgs.bun pkgs.sqlite
    ];
  }
