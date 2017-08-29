---
title: Create vim rpm
date: 2017-08-29 00:36:00
tags:
  - RPM
  - CentOS7
  - Vim
---

I use vim as main editor, with many plugins.

One of my favorites is [neocomplete](https://github.com/Shougo/neocomplete.vim).
It requires vim with lua but when we install vim from yum, it isn't.
So I have to compile vim with lua when I set up new developing environment.

It is little bother for me, so I created vim-rpm which is already build with lua.
This is in CentOS7.

## Prepare for building rpm

### Install dependency

We use gcc and so on.
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

### Install vim7.4-src-rpm

To create new vim7.4-rpm, we have to get .spec file.
First, download source rpm.
`$ yumdownloader --source vim`

Now, we've got like a 'vim-7.4.160-1.el7_3.1.src.rpm.
Then, install it.
`$ rpm -ivh vim-7.4.160-1.el7_3.1.src.rpm`

The ~/vim74 directory was automatically created and files are extracted.
```
[vagrant@localhost ~]$ tree -d vim74/
vim74/
├── SOURCES
└── SPECS

2 directories
```

### Modify vim.spec

I want vim built with lua, so I configure vim with it.
Here is changes of vim.spec.
```diff
@@ -12,6 +12,7 @@
 %define withvimspell 0
 %define withhunspell 0
 %define withruby 1
+%define withlua 1

 %define baseversion 7.4
 %define vimdir vim74
@@ -232,6 +233,9 @@
 %if "%{withruby}" == "1"
 Buildrequires: ruby-devel ruby
 %endif
+%if "%{withlua}" == "1"
+Buildrequires: lua-devel
+%endif
 %if %{desktop_file}
 # for /usr/bin/desktop-file-install
 Requires: desktop-file-utils
@@ -556,6 +560,7 @@
   --enable-gtk2-check --enable-gui=gtk2 \
   --with-compiledby="<bugzilla@redhat.com>" --enable-cscope \
   --with-modified-by="<bugzilla@redhat.com>" \
+  --enable-fail-if-missing \
 %if "%{withnetbeans}" == "1"
   --enable-netbeans \
 %else
@@ -571,6 +576,11 @@
 %else
   --disable-rubyinterp \
 %endif
+%if "%{withlua}" == "1"
+  --enable-luainterp=dynamic \
+%else
+  --disable-luainterp \
+%endif

 make VIMRCLOC=/etc VIMRUNTIMEDIR=/usr/share/vim/%{vimdir} %{?_smp_mflags}
 cp vim gvim
@@ -585,6 +595,7 @@
  --enable-cscope --with-modified-by="<bugzilla@redhat.com>" \
  --with-tlib=ncurses \
  --with-compiledby="<bugzilla@redhat.com>" \
+ --enable-fail-if-missing \
 %if "%{withnetbeans}" == "1"
   --enable-netbeans \
 %else
@@ -600,6 +611,11 @@
 %else
   --disable-rubyinterp \
 %endif
+%if "%{withlua}" == "1"
+  --enable-luainterp=dynamic \
+%else
+  --disable-luainterp \
+%endif
```

### Build new vim-rpm

Eventually, we build our own vim-rpm.
If you haven't installed lua-devel, you have to do.
`$ sudo yum install lua-devel`

Build rpm.
`$ rpmbuild -ba SPECS/vim.spec`
If you specify distribution, you path it as option.
e.g. `$ rpmbuild -ba --define '.dist <your-distribution>' SPECS/vim.spec`

You get new vim rpms from vim74/RPM directory!
```
[vagrant@localhost vim74]$ tree ~/vim74/RPMS/
/home/vagrant/vim74/RPMS/
└── x86_64
    ├── vim-common-7.4.160-1.el7.centos.1.x86_64.rpm
    ├── vim-debuginfo-7.4.160-1.el7.centos.1.x86_64.rpm
    ├── vim-enhanced-7.4.160-1.el7.centos.1.x86_64.rpm
    ├── vim-filesystem-7.4.160-1.el7.centos.1.x86_64.rpm
    ├── vim-minimal-7.4.160-1.el7.centos.1.x86_64.rpm
    └── vim-X11-7.4.160-1.el7.centos.1.x86_64.rpm

1 directory, 6 files
```
