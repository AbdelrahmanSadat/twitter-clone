const graphql = require("graphql");
const graphqlISODate = require("graphql-iso-date");
const User = require("../../models/user.js");
const Tweet = require("../../models/tweet.js");

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

const { GraphQLDateTime } = graphqlISODate;


const TweetType = new GraphQLObjectType({
 name: 'Tweet',
 fields: ()=>({
   id: {type: GraphQLID},
   authorId: {type: GraphQLID},
   text: {type: GraphQLString},
   image: {type: GraphQLString},
   createdAt: {type: GraphQLDateTime},
   updatedAt: {type: GraphQLDateTime},
   author: {
    // The user type is required here to overcome the
    // circular dependency
    //  TODO: Use a thunk (a function that returns the value, as it will be executed later)
    type: require("./UserType"),
    resolve(parent, args){
      return User.findById(parent.authorId);
    }
   }
 })
});

module.exports = TweetType;
