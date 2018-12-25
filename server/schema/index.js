const graphql = require("graphql");
const passport = require("passport");
const User = require("../models/user.js");

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


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({
    id: {type: GraphQLID},
    email: {type: GraphQLString},
    password: {type: GraphQLString}
    // author:{
    //   type: AuthorType,
    //   resolve(parent, args){
    //     return Author.findById(parent.authorId)
    //   }
    // }
  })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        type: UserType,
        args: { email:{type:GraphQLString}, id:{type:GraphQLID} },
        resolve(parent, args){
          if(args.id)
            return User.findById(args.id);
          return User.findOne({email: args.email});
        }
      },
      currentUser:{
        type: UserType,
        resolve(parent, args, req){
          return req.user;
        }
      }
    }
})

// const Mutation = new GraphQLObjectType({
//   name: "Mutation",
//   fields:{
//   }
// })



module.exports = new GraphQLSchema({
  query: RootQuery
  // mutation: Mutation
})
