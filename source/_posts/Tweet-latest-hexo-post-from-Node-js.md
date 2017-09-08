---
title: Tweet latest hexo post from Node.js
date: 2017-09-08 15:32:53
tags:
  - Node.js
---

I sometimes write blog posts and I want to announce it in twitter.

I opened this blog some in last month, but few people come ;_;
I asked to my friend who knows much about SEO, and he gave me advice that I should share my post in twitter.
Even you have no follower in twitter, It's still good for SEO.

This blog is made by [hexo](https://hexo.io/) so I searched plugins to do it, but I couldn't.
So, I made Node.js scripts.

## Create Node.js scripts which announce latest post in twitter

1. Create twitter application and get access tokens.

Before create app, you have to register your phone number to your twitter account.
Signin twitter and access here.
https://twitter.com/settings/devices

Then, you can create your own twitter application in here.
https://apps.twitter.com/app/new

After create, click 'Keys and Access Tokens' tab.
You can get api keys and access tokens from it!

2. Install helpful npm plugins

Start writing Node.js codes ;)

I used those packages.
- [dotenv](https://www.npmjs.com/package/dotenv) - zero-dependency module that loads environment variables from a .env file into process.env
- [cheerio](https://www.npmjs.com/package/cheerio) - Fast, flexible & lean implementation of core jQuery designed specifically for the server.
- [twitter](https://www.npmjs.com/package/twitter) - An asynchronous client library for the Twitter REST and Streaming API's.

Install packages.
```console
$ npm install dotenv cheerio twitter --save
```

3. Define twitter api keys in .env file

I wondered how manage my secret information in Node.js.
Finally I decided that I write them in .env and read it from other files.

`$ vim .env`
```sh
TWITTER_API_CONSUMER_KEY=xxxxxxx
TWITTER_API_CONSUMER_SECRET=xxxxxxx
TWITTER_API_ACCESS_TOKEN_KEY=xxxxxxx
TWITTER_API_ACCESS_TOKEN_SECRET=xxxxxxx
```

This is secret information so I make git to ignore it.
`$ vim .gitconfig`
```diff
+.env
```

I wrote a file that have config data.
`$ vim secrets.js`
```js
require('dotenv').config()

module.exports = {
  twitterApi: {
    keysAndAccessTokens: {
      consumer_key: process.env.TWITTER_API_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_API_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_API_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_API_ACCESS_TOKEN_SECRET,
    },
  },
}
```

4. Write scripts posts to twitter.

At first, this parses site.xml and extract the latest post's url.
Then it posts it to tweeter!
`$ vim bin/auto_tweet.js`
```js
const fs = require('fs'),
  $ = require('cheerio'),
  Twitter = require('twitter');
const twitterApiConfig = require('../secrets').twitterApi;

const client = new Twitter(twitterApiConfig.keysAndAccessTokens);

fs.readFile('.deploy_git/sitemap.xml', 'utf8', (err, xml) => {
  if (err) {
    throw err;
  }

  const latestPostUrl = $('loc', 'url', xml).first().text();
  const params = {
    status: latestPostUrl,
  };
  // Post tweet for notification.
  client.post('statuses/update', params)
    .then(tweet => {
      console.log(tweet);
    })
    .catch(error => {
      throw error;
    });
});
```

4. Execute the scripts

```console
$ node bin/auto_tweet.js
```

Here is my whole codes ;)
https://github.com/alpaca0984/alpaca-tech-farm/pull/15/files