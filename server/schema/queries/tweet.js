const graphql = require("graphql");
const User = require("../../models/user.js");
const Tweet = require("../../models/tweet.js");
const TweetType = require("../types/TweetType");

const {
  GraphQLNonNull,
  GraphQLID
 } = graphql;


const tweet = {
  type: TweetType,
  args: { id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, args){
    return await Tweet.findById(args.id);
  }
}

module.exports = tweet;
