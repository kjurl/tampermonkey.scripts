{ pkgs, lib, config, inputs, ... }: {
  packages = with pkgs; [codegrab gum];
  languages.javascript= {
    enable = true;
    pnpm = {enable=true;install.enable=true;};
  };

  enterShell = ''
    git --version # Use packages
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
