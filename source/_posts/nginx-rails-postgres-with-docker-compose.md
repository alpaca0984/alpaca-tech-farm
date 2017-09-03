---
title: 'Nginx, Rails and Postgres with docker-compose'
date: 2017-08-31 23:32:34
tags:
    - Nginx
    - Rails
    - Postgres
    - Docker
---

I developed a web application environment with docker.
It includes three containers, Nginx, Rails(puma) and Postgres.

In addition, I created and ran a small application in it.
It smash text into words so I named it "text-smasher".

<img src="{% asset_path text-smasher-demo.gif %}" style="border: 1px solid LightSlateGray" />

In this page, I show you the recipes of my docker containers.

## Create Rails Docker file

At first, I'm gonna create rails container and access it directly.

Make project directory.
```console
$ mkdir text-smasher && cd $_
```
Make directories where I'm gonna put Docker file in.
```console
$ mkdir -p docker/app
```
Create docker file for rails.
`$ vim docker/app/Dockerfile`
```dockerfile
# Base image:
FROM ruby:2.3.3

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# create application directory
RUN mkdir /myapp

# Set our working directory inside the image
WORKDIR /myapp

ADD Gemfile /myapp/Gemfile
ADD Gemfile.lock /myapp/Gemfile.lock
RUN bundle install

ADD . /myapp

EXPOSE 3000

CMD [ "bundle", "exec", "puma", "-C", "config/puma.rb" ]
```

### Create docker-compose file

`$ vim docker-compose.yml`
```yml
version: '3'
services:
  app:
    build:
      context: .
      dockerfile: ./docker/app/Dockerfile
    volumes:
      - .:/myapp
    depends_on:
      - db
    ports:
      - 3000:3000
  db:
    image: postgres
```

## Init Rails Project

Create Gemfile.
```console
$ bundle init
```

Activate rails gem.
`$ vim Gemfile`
```diff
source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

-# gem "rails"
+gem "rails"
```

Install gems and create rails project.
You may be asked if you wanna overwrite gemfile, then press 'Y'.
```console
$ docker-compose run app bundle exec rails new . -d postgresql
```

Set db host to postgres container.
This is just sample, and you shoud define properly username and password.
`$ vim config/database.yml`
```diff
 default: &default
   adapter: postgresql
   encoding: unicode
+  host: db
+  username: postgres
   # For details on connection pooling, see Rails configuration guide
   # http://guides.rubyonrails.org/configuring.html#database-pooling
   pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```

Build docker image and create database.
```console
$ docker-compose build
$ docker-compose run app bundle exec rails db:create RAILS_ENV=production
```

Run application.
```console
$ docker-compose up
```

All containers work well.
```console
$ docker-compose ps
     Name                   Command               State           Ports
--------------------------------------------------------------------------------
textsmasher_app_1   bundle exec puma -C config ...   Up      0.0.0.0:3000->3000/tcp
textsmasher_db_1    docker-entrypoint.sh postgres    Up      5432/tcp
```

I could see Rails's welcome page through localhost:3000 !

<img src="{% asset_path rails_welcome_page.png %}" style="border: 1px solid LightSlateGray" />

## Add Nginx's container

Second, I'm gonna create Nginx's container and let it proxy to Puma.
I used this page as reference.
[Codepany Blog > RAILS 5 AND DOCKER (PUMA, NGINX)](http://codepany.com/blog/rails-5-and-docker-puma-nginx/)

Create a directory which is related to nginx container.
```console
$ mkdir docker/web
```

Add nginx config file to proxy rails application.
`$ vim docker/web/app.conf`
```nginx
upstream puma_rails_app {
  server app:3000;
}

server {
  listen       80;

  proxy_buffers 64 16k;
  proxy_max_temp_file_size 1024m;

  proxy_connect_timeout 5s;
  proxy_send_timeout 10s;
  proxy_read_timeout 10s;

  location / {
    try_files $uri $uri/ @rails_app;
  }

  location @rails_app {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;

    proxy_pass http://puma_rails_app;
    # limit_req zone=one;
    access_log /var/www/text-smasher/log/nginx.access.log;
    error_log /var/www/text-smasher/log/nginx.error.log;
  }
}
```

Create docker file for nginx.
It refers config file I created in last step.
`$ vim docker/web/Dockerfile`
```dockerfile
# Base image:
FROM nginx

# Install dependencies
RUN apt-get update -qq && apt-get -y install apache2-utils

# establish where Nginx should look for files
ENV RAILS_ROOT /var/www/text-smasher

# Set our working directory inside the image
WORKDIR $RAILS_ROOT

# create log directory
RUN mkdir log

# copy over static assets
COPY public public/

# Copy Nginx config template
COPY docker/web/app.conf /tmp/docker_example.nginx

# substitute variable references in the Nginx config template for real values from the environment
# put the final config in its place
RUN envsubst '$RAILS_ROOT' < /tmp/docker_example.nginx > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Use the "exec" form of CMD so Nginx shuts down gracefully on SIGTERM (i.e. `docker stop`)
CMD [ "nginx", "-g", "daemon off;" ]
```

Change docker-compose file to create nginx container.
I'm gonna access rails application via nginx, so I deleted port mapping of it.
`$ vim docker-compose.yml`
```diff
version: '3'
services:
+  web:
+    build:
+      context: .
+      dockerfile: ./docker/web/Dockerfile
+    depends_on:
+      - app
+    ports:
+      - 8080:80
  app:
    build:
      context: .
      dockerfile: ./docker/app/Dockerfile
    volumes:
      - .:/myapp
    depends_on:
      - db
-    ports:
-      - 3000:3000
  db:
    image: postgres
```

## Build and run the docker image

```console
$ docker-compose build
$ docker-compose up
```

All containers work well.
```console
$ docker-compose ps
     Name                   Command               State          Ports
------------------------------------------------------------------------------
textsmasher_app_1   bundle exec puma -C config ...   Up      3000/tcp
textsmasher_db_1    docker-entrypoint.sh postgres    Up      5432/tcp
textsmasher_web_1   nginx -g daemon off;             Up      0.0.0.0:8080->80/tcp
```

When I access to localhost:8080, I can see rails's welcome page again!

I will write another post about the content of "text-smasher".
~~It is coming soon;)~~
I wrote it!
{% post_link  Call-Azure-s-Text-Analytics-API-from-JavaScript Call Azure's Text Analytics API from JavaScript %}
