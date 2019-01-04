const graphql = require("graphql");
const User = require("../../models/user.js");
const Tweet = require("../../models/tweet.js");
const UserType = require("../types/UserType");
const TweetType = require("../types/TweetType");

const {
  GraphQLObjectType
 } = graphql;

const user = require("./user");
const currentUser = require("./currentUser");
const tweet = require("./tweet");

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user,
      currentUser,
      tweet
    }
})

module.exports = RootQuery
