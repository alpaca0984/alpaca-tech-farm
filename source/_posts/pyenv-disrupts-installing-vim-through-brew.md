---
title: Pyenv disrupts installing vim through brew
date: 2017-08-26 20:58:05
tags:
  - Homebrew
  - Vim
  - pyenv
category:
  - Development Environment
---

I tried `$ brew reinstall vim` but errors occured.

```
/Users/<username>% brew reinstall vim
==> Reinstalling vim --with-lua
==> Downloading https://github.com/vim/vim/archive/v8.0.0983.tar.gz
Already downloaded: /Users/<username>/Library/Caches/Homebrew/vim-8.0.0983.tar.gz
==> ./configure --prefix=/usr/local --mandir=/usr/local/Cellar/vim/8.0.0983/share/man --enable-multibyte --with-tlib=ncurses --enable-cscope --enable-terminal --with-compiledby=Homebrew --enable-luainterp
==> make
Last 15 lines from /Users/<username>/Library/Logs/Homebrew/vim/02.make:
clang -c -I. -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1        -o objects/window.o window.c
clang -c -I. -I/usr/local/include -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1        -o objects/if_lua.o if_lua.c
clang -c -I. -g  -DPERL_DARWIN -fno-strict-aliasing -fstack-protector  -I/System/Library/Perl/5.18/darwin-thread-multi-2level/CORE  -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1        -o objects/if_perl.o auto/if_perl.c
clang -c -I. -g  -DPERL_DARWIN -fno-strict-aliasing -fstack-protector  -I/System/Library/Perl/5.18/darwin-thread-multi-2level/CORE  -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1        -o objects/if_perlsfio.o if_perlsfio.c
clang -c -I. -I/usr/local/Cellar/python/2.7.13_1/Frameworks/Python.framework/Versions/2.7/include/python2.7 -DPYTHON_HOME='"/usr/local/Cellar/python/2.7.13_1/Frameworks/Python.framework/Versions/2.7"' -fPIE  -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1        -o objects/if_python.o if_python.c
clang -c -I. -I/Users/<username>/.rbenv/versions/2.3.3/include/ruby-2.3.0 -I/Users/<username>/.rbenv/versions/2.3.3/include/ruby-2.3.0/x86_64-darwin15 -DRUBY_VERSION=23 -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1        -o objects/if_ruby.o if_ruby.c
clang -c -I. -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1        -o objects/netbeans.o netbeans.c
clang -c -I. -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1        -o objects/channel.o channel.c
if_python.c:67:10: fatal error: 'Python.h' file not found
#include <Python.h>
         ^
1 error generated.
make[1]: *** [objects/if_python.o] Error 1
make[1]: *** Waiting for unfinished jobs....
make: *** [first] Error 2
```

I read error messages and finally detected that python’s path is not located where Homebrew expects.
Pyenv's path-settings was in ~/.bash_profile, so temporary commented out them.

`$ vim ~/.bash_profile`
```diff
- export PYENV_ROOT="$HOME/.pyenv"
- export PATH="$PYENV_ROOT/bin:$PATH"
- eval "$(pyenv init -)"
+ # export PYENV_ROOT="$HOME/.pyenv"
+ # export PATH="$PYENV_ROOT/bin:$PATH"
+ # eval "$(pyenv init -)"
```

Then, reopened terminal and retried install vim.

It worked well.
```
/Users/<username>% brew reinstall vim
==> Reinstalling vim --with-lua
==> Downloading https://github.com/vim/vim/archive/v8.0.0972.tar.gz
==> Downloading from https://codeload.github.com/vim/vim/tar.gz/v8.0.0972
######################################################################## 100.0%
==> ./configure --prefix=/usr/local --mandir=/usr/local/Cellar/vim/8.0.0972/share/man --enable-multibyte --with-tlib=ncurses --enable-cscope --enable-terminal --with-compiledby=Home
==> make
==> make install prefix=/usr/local/Cellar/vim/8.0.0972 STRIP=/usr/bin/true
🍺  /usr/local/Cellar/vim/8.0.0972: 1,415 files, 25.6MB, built in 1 minute 25 seconds
Share
```
