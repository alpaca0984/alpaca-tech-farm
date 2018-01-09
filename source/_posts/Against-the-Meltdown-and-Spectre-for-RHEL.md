---
title: Against the Meltdown and Spectre for RHEL
date: 2018-01-09 21:41:13
tags:
  - Vulnerabilities
  - RHEL
---

Now, a lot of web developers are making effort to against Meltdown and Spectre.

This is an article of TechCrunch about them.
[Kernel panic! What are Meltdown and Spectre, the bugs affecting nearly every computer and device?](https://techcrunch.com/2018/01/03/kernel-panic-what-are-meltdown-and-spectre-the-bugs-affecting-nearly-every-computer-and-device/)

One of the most popular Linux distributions is Red-Hat-Enterprize-Linux(RHEL) including CentOS.
Maybe you use it.

RHEL mentions Spectre and Meltdown in their blog.
[What are Meltdown and Spectre? Here’s what you need to know.](https://www.redhat.com/en/blog/what-are-meltdown-and-spectre-here%E2%80%99s-what-you-need-know?sc_cid=7016000000127NJAAY)

Also, it provides updated rpm-packages for affected products.
[Kernel Side-Channel Attacks - CVE-2017-5754 CVE-2017-5753 CVE-2017-5715](https://access.redhat.com/security/vulnerabilities/speculativeexecution)

If you want to take actions, visit above page and click 'Resolve' tab.
You can see some packages which should be updated.
<img src="{% asset_path rdhl_spectre_meltdown_resolve.png %}" style="border: 1px solid LightSlateGray" />

For instance, if you use RHEL-7, it's needed to update these packages.
- kernel
- kernel-rt
- libvirt
- qemu-kvm
- dracut

They are provided via yum, so you can update them by this command.
```console
$ sudo yum update kernel kernel-rt libvirt qemu-kvm dracut
```

Keep on collecting information about this problem.