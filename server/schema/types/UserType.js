const graphql = require("graphql");
const User = require("../../models/user.js");
const Tweet = require("../../models/tweet.js");
const TweetType = require("./TweetType");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
 } = graphql;


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({
    id: {type: GraphQLID},
    email: {type: GraphQLString},
    isVerified: {type: GraphQLBoolean},
    following: {
      type: new GraphQLList(UserType),
      async resolve(parent, args){
        const user = await User.findById(parent.id).populate("following");
        return user.following;
      }
    },
    followers: {
      type: new GraphQLList(UserType),
      async resolve(parent, args){
        const followers = await User.find({ following: parent.id });
        return followers;
      }
    },
    tweets:{
      type: new GraphQLList(TweetType),
      async resolve(parent, args){
        const tweets = await Tweet.find({authorId: parent.id});
        return tweets;
      }
    },
    timeline:{
      type: new GraphQLList(TweetType),
      async resolve(parent, args){
        const userIDList = parent.following;
        userIDList.push(parent.id);
        const timeline = await Tweet
        .find({ authorId: { $in: userIDList}})
        .sort({updatedAt: "desc"})
        .exec();
        return timeline;
      }
    },
    favorites:{
      type: new GraphQLList(TweetType),
      async resolve(parent, args){
        const favorites = await Tweet
        .find({_id: {$in: parent.favorites}})
        .sort({updatedAt: "desc"})
        .exec();
        return favorites;
      }
    }
  })
});

module.exports = UserType
