---
title: 'Nginx, Rails(Puma) and Postgres with docker-compose'
date: 2017-08-31 23:32:34
tags:
    - Nginx
    - Rails
    - Postgres
    - Docker
---

I developed a web application environment with docker.
It includes three containers, Nginx, Rails(puma) and Postgres.
I show you the recipes.

## Create Rails Docker file

Make project directory.
```console
$ mkdir rails-app && cd $_
```
Make directories where I'm gonna put Docker file in.
```console
$ mkdir -p docker/app
```
Create Docker file for Rails.
`$ vim docker/app/Dockerfile`
```docker
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

## Create docker-compose file

`$ vim docker-compose.yml`
```
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
You may be asked if you wanna overwrite Gemfile, then press 'Y'.
```
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
```
$ docker-compose build
$ docker-compose run app bundle exec rails db:create RAILS_ENV=production
```

Run application.
```
$ docker-compose up
```

## Create Nginx's Dockerfile

## Create docker-compose.yml

## Build and run the docker image

## You can see whole above work
