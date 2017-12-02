---
title: Start using fish-shell and fisherman
date: 2017-12-02 17:15:32
tags:
  - fish-shell
  - fisherman
---

There are plenty of command line shell.
I had used to use zsh but recently replaced it to fish.

## What is fish-shell

Introduce [official description](https://github.com/fish-shell/fish-shell).
> fish is a smart and user-friendly command line shell for macOS, Linux, and the rest of the family. fish includes features like syntax highlighting, autosuggest-as-you-type, and fancy tab completions that just work, with no configuration required.

I introduced fish because of these points.

- easy to install
- powerful built-in functions such as autosuggestion
- having good plugin manager(below)

## Install fish-shell

For macOS, it can be installed with Homebrew.
```console
$ brew install fish
```

For other linux distributions, many packages are available.
https://software.opensuse.org/download.html?project=shells%3Afish%3Arelease%3A2&package=fish

I also use CentOS 6, I added a yum repository and installed fish from it.
As a note, you have to be root.
```console
# cd /etc/yum.repos.d/
# wget https://download.opensuse.org/repositories/shells:fish:release:2/CentOS_6/shells:fish:release:2.repo
# yum install fish
```

## Install fisherman

fisherman is a plugin manager for fish-shell.
It lets us to install and remove fish-shell plugins easily.

To install itself, we use `curl` command.
```
curl -Lo ~/.config/fish/functions/fisher.fish --create-dirs https://git.io/fisher
```

To install plugins, we use `fisher install` command(or just fisher command).
```
$ fisher install fzf
```

## Plugins I highly recommend

### z

z remember history of changing directories. It enables you to jump to the directory from everywhere.

<img src="{% asset_path fish-shell_z_demo.gif %}" style="border: 1px solid LightSlateGray" />

Install it with fisherman.
```
$ fisher z
```

[Here](https://github.com/fisherman/z) is official repository.

### fzf

fif is a command-line fuzzy finder.
For instance, we can search command from history interactively.

<img src="{% asset_path fish-shell_fzf_demo.gif %}" style="border: 1px solid LightSlateGray" width="580px" />

To install for fish, it is prerequisite to install fzf in your system.

Using Homebrew
```
$ brew install fzf
```

Using git
```
$ git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
$ ~/.fzf/install
```

After that, install fzf with fisher.
```
$ fisher fzf
```

[Here](https://github.com/fisherman/fzf) is official repository.

### bobthefish(theme from oh-my-fish)

fisher can manage plugins for oh-my-fish.
Install bobthefish with `omf/` namespace.
```
$ omf/thema-bobthefish
```

You can watch demo in official repository.
https://github.com/oh-my-fish/theme-bobthefish#bobthefish
