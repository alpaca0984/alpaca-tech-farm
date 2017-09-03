---
title: Call Azure's Text Analytics API from JavaScript
date: 2017-09-03 14:07:21
tags:
  - JavaScript
  - Azure
---

Previously, I created docker environment with Nginx, Rails and Postgres.
{% post_link nginx-rails-postgres-with-docker-compose %}

In it, I ran a rails application with [Azure's Text Analytics API](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/). 
With it, I made app which detect key phrases from text.

<img src="{% asset_path text-smasher-demo.gif %}" style="border: 1px solid LightSlateGray" />

## 

```console
$ docker-compose run app bundle exec rails g controller smash
```

## Register Azure and get trial access token of the API

You can do it from here(free trial token valids only 30 days).
[Microsoft Azure - Text Analytics API](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/)
