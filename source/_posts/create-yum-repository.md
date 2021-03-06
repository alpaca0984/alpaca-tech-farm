---
title: Create yum repository
date: 2017-08-30 14:18:07
tags:
  - RPM
  - CentOS7
  - Yum
---

Previously, I created vim-rpm.
{% post_link create-vim-rpm %}

Next, I'm gonna create my own yum repository which installs above rpms with dependencies.

## Prerequisites

Install a tool for creating repositories.
```console
$ sudo yum install createrepo
```

## Init repository and add packages

Create directory and init repository.
```console
$ mkdir yumrepos && cd $_
$ createrepo .
```

Setted up repository data.
```console
[vagrant@localhost yumrepos]$ tree repodata/
repodata/
├── 01a3b489a465bcac22a43492163df43451dc6ce47d27f66de289756b91635523-filelists.sqlite.bz2
├── 401dc19bda88c82c403423fb835844d64345f7e95f5b9835888189c03834cc93-filelists.xml.gz
├── 5dc1e6e73c84803f059bb3065e684e56adfc289a7e398946574d79dac6643945-primary.sqlite.bz2
├── 6bf9672d0862e8ef8b8ff05a2fd0208a922b1f5978e6589d87944c88259cb670-other.xml.gz
├── 7c36572015e075add2b38b900837bcdbb8a504130ddff49b2351a7fc0affa3d4-other.sqlite.bz2
├── dabe2ce5481d23de1f4f52bdcfee0f9af98316c9e0de2ce8123adeefa0dd08b9-primary.xml.gz
└── repomd.xml

0 directories, 7 files
```

Create repository.
Here, I named one alpaca-main.
```console
[vagrant@localhost yumrepos]$ mkdir -p alpaca-main/Packages
```

Add packages above directory.
In my case, I used vim packages created previous post.
```console
[vagrant@localhost yumrepos]$ ls -la alpaca-main/Packages/
total 14880
drwxrwxr-x. 2 vagrant vagrant    4096 Aug 30 06:31 .
drwxrwxr-x. 3 vagrant vagrant      22 Aug 30 06:30 ..
-rw-rw-r--. 1 vagrant vagrant 6211132 Aug 30 06:31 vim-common-7.4.160-1.el7_3.alpaca.1.x86_64.rpm
-rw-rw-r--. 1 vagrant vagrant 6233660 Aug 30 06:31 vim-debuginfo-7.4.160-1.el7_3.alpaca.1.x86_64.rpm
-rw-rw-r--. 1 vagrant vagrant 1093852 Aug 30 06:31 vim-enhanced-7.4.160-1.el7_3.alpaca.1.x86_64.rpm
-rw-rw-r--. 1 vagrant vagrant    8788 Aug 30 06:31 vim-filesystem-7.4.160-1.el7_3.alpaca.1.x86_64.rpm
-rw-rw-r--. 1 vagrant vagrant  445508 Aug 30 06:31 vim-minimal-7.4.160-1.el7_3.alpaca.1.x86_64.rpm
-rw-rw-r--. 1 vagrant vagrant 1226428 Aug 30 06:31 vim-X11-7.4.160-1.el7_3.alpaca.1.x86_64.rpm
```

Write .repo to access rpms via yum command.
`$ vim /etc/yum.repos.d/alpaca-main.repo`
```
[alpaca-main]
name=alpaca-main.$releasever
baseurl=file:///home/vagrant/yumrepos
gpgcheck=0
```

Try install vim from my repository(disable built-in repositories of CentOS7).
```console
$ sudo yum --disablerepo=updates,base --enablerepo=alpaca-main install vim
```

If you couldn't find your packeages, try to clear cache.
```console
$ sudo yum clean --enablerepo=<your-repo> all
```

I could install vim package from my alpaca-main repository!
```console
[vagrant@localhost yumrepos]$ sudo yum --disablerepo=updates,base --enablerepo=alpaca-main install vim
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
 * extras: ftp.riken.jp
Resolving Dependencies
--> Running transaction check
---> Package vim-enhanced.x86_64 2:7.4.160-1.el7_3.alpaca.1 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

=========================================================================================================================================
 Package                       Arch                    Version                                        Repository                    Size
=========================================================================================================================================
Installing:
 vim-enhanced                  x86_64                  2:7.4.160-1.el7_3.alpaca.1                     alpaca-main                  1.0 M

Transaction Summary
=========================================================================================================================================
Install  1 Package

Total download size: 1.0 M
Installed size: 2.2 M
Is this ok [y/d/N]: y
Downloading packages:
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : 2:vim-enhanced-7.4.160-1.el7_3.alpaca.1.x86_64                                                                        1/1
  Verifying  : 2:vim-enhanced-7.4.160-1.el7_3.alpaca.1.x86_64                                                                        1/1

Installed:
  vim-enhanced.x86_64 2:7.4.160-1.el7_3.alpaca.1

Complete!
```

### Upload your packages wherever you want

I uploaded to Github.
https://github.com/alpaca0984/rpm-pkgs

And chage .repo file.
`$ vim /etc/yum.repos.d/alpaca-main.repo`
```diff
- baseurl=file:///home/vagrant/yumrepos
+ baseurl=https://raw.githubusercontent.com/alpaca0984/rpm-pkgs/master/x86_64
```

## Create rpm for installing repository via yum

I don't wanna put /etc/yum.repos.d/alpaca-main.repo every time.
So I'm gonna create rpm package which deploys above file.

### Configure .rpmmacros.

`$ vim ~/.rpmmacros`
```diff
- %_topdir %(echo $HOME)/rpmbuild
+ %_topdir %(echo $HOME)/<your-repo-name>
```

Here, I named my package 'alpaca-yum-repos'.

Set up build-tree.
```console
$ rpmdev-setuptree
```

Then, rpm directories are prepared.
```console
[vagrant@localhost ~]$ tree -d alpaca-yum-repos/
├── BUILD
├── repodata
├── RPMS
├── SOURCES
├── SPECS
└── SRPMS

6 directories
```

## Add .repo file to SOURCE directory

Put alpaca-main.repo in SOURCE dir.
It's used in .spec file.
```console
$ cp /etc/yum.repos.d/alpaca-main.repo ~/alpaca-yum-repos/SOURCES/
```

## Initialize spec file and update it

```console
$ rpmdev-newspec SPECS/alpaca-yum-repos.spec
```

I got a template of spec file.
```
[vagrant@localhost alpaca-main]$ cat SPECS/alpaca-main.spec
Name:           alpaca-main
Version:
Release:        1%{?dist}
Summary:

License:
URL:
Source0:

BuildRequires:
Requires:

%description


%prep
%setup -q


%build
%configure
make %{?_smp_mflags}


%install
rm -rf $RPM_BUILD_ROOT
%make_install


%files
%doc



%changelog
```

### Update .spec file

`$ vim SPECS/alpaca-yum-repos.spec`
```
Name:		alpaca-yum-repos
Version:	1
Release:	1%{?dist}
Summary:	Alpaca0984's Original Packages for CentOS

Group:		System Environment/Base
License:	GPLv2

URL:		https://github.com/alpaca0984/yum-repos
Source0:	alpaca-main.repo

BuildArch:     noarch
Requires:      redhat-release >= %{version}

%description


%prep
%setup -q  -c -T


%build


%install
rm -rf $RPM_BUILD_ROOT

# yum
install -dm 755 $RPM_BUILD_ROOT%{_sysconfdir}/yum.repos.d
install -pm 644 %{SOURCE0} \
    $RPM_BUILD_ROOT%{_sysconfdir}/yum.repos.d


%clean
rm -rf $RPM_BUILD_ROOT


%files
%defattr(-,root,root,-)
%doc
%config(noreplace) /etc/yum.repos.d/*



%changelog
```

## Build rpm package

Build package.
```console
$ rpmbuild -ba SPECS/alpaca-yum-repos.spec
```

I got the rpm package!
```console
[vagrant@localhost alpaca-main]$ tree RPMS
RPMS
└── noarch
    └── alpaca-yum-repos-1-1.el7.centos.noarch.rpm

1 directory, 1 file
```

## Install repository via yum

Finally, I got to install my alpaca-main repository.
```console
[vagrant@localhost alpaca-main]$ sudo yum install RPMS/noarch/alpaca-yum-repos-1-1.el7.centos.noarch.rpm
Loaded plugins: fastestmirror
Examining RPMS/noarch/alpaca-yum-repos-1-1.el7.centos.noarch.rpm: alpaca-yum-repos-1-1.el7.centos.noarch
Marking RPMS/noarch/alpaca-yum-repos-1-1.el7.centos.noarch.rpm to be installed
Resolving Dependencies
--> Running transaction check
---> Package alpaca-yum-repos.noarch 0:1-1.el7.centos will be installed
--> Finished Dependency Resolution

Dependencies Resolved

=========================================================================================================================================
 Package                      Arch               Version                       Repository                                           Size
=========================================================================================================================================
Installing:
 alpaca-yum-repos             noarch             1-1.el7.centos                /alpaca-yum-repos-1-1.el7.centos.noarch             130

Transaction Summary
=========================================================================================================================================
Install  1 Package

Total size: 130
Installed size: 130
Is this ok [y/d/N]: y
Downloading packages:
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : alpaca-yum-repos-1-1.el7.centos.noarch                                                                                1/1
  Verifying  : alpaca-yum-repos-1-1.el7.centos.noarch                                                                                1/1

Installed:
  alpaca-yum-repos.noarch 0:1-1.el7.centos

Complete!
```

As described above, I uploaded my rpm packages on Github!
You can install my alpaca repository.
https://github.com/alpaca0984/rpm-pkgs