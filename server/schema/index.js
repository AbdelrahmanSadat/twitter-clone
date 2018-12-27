const graphql = require("graphql");
const graphqlISODate = require("graphql-iso-date");
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

 const {
   GraphQLDate,
   GraphQLTime,
   GraphQLDateTime
 } = graphqlISODate;

// TODO: Error handling

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({
    id: {type: GraphQLID},
    email: {type: GraphQLString},
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
        const tweets = await Tweet.find({authorID: parent.id});
        return tweets;
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
    createdAt: {type: GraphQLDateTime},
    updatedAt: {type: GraphQLDateTime},
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
      args:{ text: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args, req){
        const tweet = new Tweet({ text: args.text, authorID: req.user.id});
        const savedTweet = await tweet.save();
        savedTweet.authorID = savedTweet.authorID.toJSON();
        return savedTweet;
      }
    },
    follow:{
      type: UserType,
      args:{ toFollowId: {type: new GraphQLNonNull(GraphQLID) } },
      async resolve(parent, args, req){
        const user = await User.findById(req.user.id);
        user.following.push(args.toFollowId);
        return user.save();
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
