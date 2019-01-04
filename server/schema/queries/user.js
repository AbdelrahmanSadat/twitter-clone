const graphql = require("graphql");
const User = require("../../models/user.js");
const UserType = require("../types/UserType");

const {
  GraphQLString,
  GraphQLID
 } = graphql;

const user =  {
    type: UserType,
    args: { email:{type:GraphQLString}, id:{type:GraphQLID} },
    async resolve(parent, args){
      if(!args.email && !args.id)
        throw new Error("Please provide an argument");
      if(args.id)
        return await User.findById(args.id);
      else
        return await User.findOne({email: args.email});
    }
  }

module.exports = user
