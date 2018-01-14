---
title: Using ssh-agent in fish-shell
date: 2018-01-14 15:12:00
tags:
  - fish-shell
---

When we use zsh, we evaluate ssh-agent via this command.
```console
$ eval `ssh-agent`
```

Unlike other shells, fish-shell does not use backticks ` for command substitutions.
Instead, it uses parentheses.

So I tried `$ eval (ssh-agent)`, but errors occurred.
```console
$ eval (ssh-agent)
- (line 1): Unsupported use of '='. In fish, please use 'set SSH_AUTH_SOCK /var/folders/h_/yh5lh2hd7zv0r9qkncx49_bw0000gn/T//ssh-DyB4EGd5T2DZ/agent.43633'.
begin; SSH_AUTH_SOCK=/var/folders/h_/yh5lh2hd7zv0r9qkncx49_bw0000gn/T//ssh-DyB4EGd5T2DZ/agent.43633; export SSH_AUTH_SOCK; SSH_AGENT_PID=43634; export SSH_AGENT_PID; echo Agent pid 43634;
       ^
from sourcing file -
	called on line 60 of file /usr/local/Cellar/fish/2.6.0/share/fish/functions/eval.fish

in function 'eval'
	called on standard input

- (line 1): Unsupported use of '='. In fish, please use 'set SSH_AGENT_PID 43634'.
begin; SSH_AUTH_SOCK=/var/folders/h_/yh5lh2hd7zv0r9qkncx49_bw0000gn/T//ssh-DyB4EGd5T2DZ/agent.43633; export SSH_AUTH_SOCK; SSH_AGENT_PID=43634; export SSH_AGENT_PID; echo Agent pid 43634;
                                                                                                                           ^
from sourcing file -
	called on line 60 of file /usr/local/Cellar/fish/2.6.0/share/fish/functions/eval.fish

in function 'eval'
	called on standard input

Agent pid 43634
```

It's due to how variables are set.
To work around this, we have to use the csh-style option -c
```
$ eval (ssh-agent -c)
```

Works cited
- https://wiki.archlinux.org/index.php/Fish#Evaluate_ssh-agent