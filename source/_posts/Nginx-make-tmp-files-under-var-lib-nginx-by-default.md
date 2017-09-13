---
title: Nginx makes tmp files under /var/lib/nginx by default
date: 2017-09-13 22:57:29
tags:
  - Nginx
---

I rebuilt Nginx because I needed the following two packages.
- [ngx_pagespeed](https://github.com/pagespeed/ngx_pagespeed)
- [ngx_cache_purge](https://github.com/FRiCKLE/ngx_cache_purge)

After installed it, it seemed work normally.
But when it received POST requests, errors occurred.

Here is an error log.
Nginx makes temporary files when POST request came.
```
<accessed-datetime> [warn] 28195#0: *8938023 a client request body is buffered to a temporary file
/var/lib/nginx/tmp/client_body/0001310410, client: <client-ip-address>, server: <my-wordpress-server.com>, request: "POST
/wp-admin/post.php HTTP/1.1", host: "<my-wordpress-host.com>", referrer: "https://<my-wordpress-site.com>/wp-admin/post.php?
post=3084&action=edit"
```

The user of Nginx worker processes is `nginx` by default.
But in this case, the user of them is different from the original.
```console
# ps auxf | { head -1; grep nginx; }
USER              PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root             1153  0.0  1.6 144076 65284 ?        Ss   Apr21   0:00 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
<our-nginx-user> 28195  0.1  2.9 601260 118728 ?       Sl   May02 340:37  \_ nginx: worker process
<our-nginx-user> 28196  0.1  2.9 599368 118216 ?       Sl   May02 348:31  \_ nginx: worker process
<our-nginx-user> 28197  0.0  0.4 219904 16260 ?        Sl   May02   1:25  \_ nginx: cache manager process
```

So, I changed the owner of the directory recursively.
```console
# chown -R <our-nginx-user> /var/lib/nginx
```

We have to think deeply who should run middleware.