const graphql = require("graphql");
const passport = require("passport");
const User = require("../models/user.js");
const Tweet = require("../models/tweet.js");

// some js destructuring
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
 } = graphql;

// TODO: Error handling

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({
    id: {type: GraphQLID},
    email: {type: GraphQLString},
    tweets:{
      type: new GraphQLList(TweetType),
      async resolve(parent, args){
        const user = await User.findById(parent.id).populate("tweets");
        return user.tweets;
      }
    }
  })
});

const TweetType = new GraphQLObjectType({
  name: 'Tweet',
  fields: ()=>({
    id: {type: GraphQLID},
    authorID: {type: GraphQLID},
    text: {type: GraphQLString},
    author: {
      type: UserType,
      resolve(parent, args){
        return User.findById(parent.authorID);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        type: UserType,
        // TODO: specify that at least one of the arguments needs
        // to be nonNull
        args: { email:{type:GraphQLString}, id:{type:GraphQLID} },
        resolve(parent, args){
          if(args.id)
            return User.findById(args.id);
          else
            return User.findOne({email: args.email});
        }
      },
      currentUser:{
        type: UserType,
        resolve(parent, args, req){
          return req.user;
        }
      },
      tweet:{
        type: TweetType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve(parent, args){
          return Tweet.findById(args.id);
        }
      }
    }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields:{
    tweet:{
      type: TweetType,
      // TODO: specify that one of the author's
      // fields should not be null
      args:{
        authorID:{ type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args){
        const tweet = new Tweet({ text: args.text, authorID: args.authorID});
        const savedTweet = await tweet.save();
        const user = await User.findById(args.authorID);
        user.tweets.push(savedTweet._id);
        user.save();
        return {
          text: savedTweet.text,
          authorID:savedTweet.authorID.toJSON(),
          id: savedTweet._id
        };
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
