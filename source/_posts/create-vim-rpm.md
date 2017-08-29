---
title: create vim rpm
date: 2017-08-29 00:36:00
tags:
  - RPM
  - CentOS7
---

I use vim as main editor, with many plugins.

One of my favorites is [neocomplete](https://github.com/Shougo/neocomplete.vim).
It requires vim with lua but when we install vim from yum, it doesn't have lua.
So I have to compile vim with lua when I set up new developing environment.

It is little bother for me, so I created vim-rpm which is already build with lua.
This is in CentOS7.

## Prepare for building rpm

### Install dependency

We use `gcc` and so on.
```shell
$ sudo yum groups install "Development tools"
```

For downloading source rpm, and build rpm packages.
```shell
$ sudo yum install yum-utils rpmdevtools
```

### Configure .rpmmacros

When we install rpmdevtools, .rpmmacros file is created in our home directory.
`$ cat ~/.rpmmacros`
```
%_topdir %(echo $HOME)/rpmbuild

%_smp_mflags %( \
    [ -z "$RPM_BUILD_NCPUS" ] \\\
        && RPM_BUILD_NCPUS="`/usr/bin/nproc 2>/dev/null || \\\
                             /usr/bin/getconf _NPROCESSORS_ONLN`"; \\\
    if [ "$RPM_BUILD_NCPUS" -gt 16 ]; then \\\
        echo "-j16"; \\\
    elif [ "$RPM_BUILD_NCPUS" -gt 3 ]; then \\\
        echo "-j$RPM_BUILD_NCPUS"; \\\
    else \\\
        echo "-j3"; \\\
    fi )

%__arch_install_post \
    [ "%{buildarch}" = "noarch" ] || QA_CHECK_RPATHS=1 ; \
    case "${QA_CHECK_RPATHS:-}" in [1yY]*) /usr/lib/rpm/check-rpaths ;; esac \
    /usr/lib/rpm/check-buildroot
```

When we set %\_topdir, RPM files are extracted under it.
Now, I'm gonna create vim-7.4 rpm so name topdir vim74.
`$ vim ~/.rpmmacros`
```diff
- %_topdir %(echo $HOME)/rpmbuild
+ %_topdir %(echo $HOME)/vim74
```
