const graphql = require("graphql");
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
    username: {type: GraphQLString},
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
        args: { email:{type:GraphQLString} },
        resolve(parent, args){
          return User.find({email: args.email});
        }
      },
      // TODO: remove users query
      users:{
        type: new GraphQLList(UserType),
        resolve(parent, args){
          return User.find({});
        }
      }
    }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields:{
    createUser:{
      type: UserType,
      args: {
        email:{type: new GraphQLNonNull(GraphQLString)},
        username:{type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)}
      },
      // TODO: user passport to register the user
      resolve(parent, args){
        let newUser = new User({ username:args.username, email:args.email, password:args.password});
        return newUser.save();
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
