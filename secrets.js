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
