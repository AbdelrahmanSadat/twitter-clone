const graphql = require("graphql");
const Tweet = require("../../models/tweet.js");
const TweetType = require("../types/TweetType");

const {
  GraphQLString
 } = graphql;


const tweet = {
  type: TweetType,
  args:{
    text: { type: GraphQLString },
    image: { type: GraphQLString }
  },
  async resolve(parent, args, req){
    if(!req.user)
      throw new Error("You must be logged in.");
    if(!args.text && !args.image)
      throw new Error("No arguments were given");
    const tweet = new Tweet({
      text: args.text,
      image: args.image,
      authorId: req.user.id
    });
    const savedTweet = await tweet.save();
    savedTweet.authorId = savedTweet.authorId.toJSON();
    return savedTweet;
  }
}

module.exports = tweet;
