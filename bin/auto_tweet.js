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