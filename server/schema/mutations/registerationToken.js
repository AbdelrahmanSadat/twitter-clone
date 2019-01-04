const graphql = require("graphql");
const User = require("../../models/user.js");
const RegisterationToken = require("../../models/registerationToken");

const {
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull
 } = graphql;



const registerationToken = {
  type: GraphQLBoolean,
  args:{
    token:{ type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) }
  },
  async resolve(parent, args){
    const user = await User.findById(args.userId);
    if(!user)
      throw new Error("Incorrect user id");

    // If the user had a token, and it's different, overwrite the old token
    const existingToken = await RegisterationToken.findOne({userId: args.userId});
    if(existingToken){
      if(existingToken.token == args.token)
        throw new Error("Token already registered");
      existingToken.token = args.token;
      await existingToken.save();
      return true
    }
    // If the user didn't have a registeration token before,
    // create a new document for it
    const token = await RegisterationToken.create({
      token: args.token,
      userId: args.userId
    });
    return true
  }
}


module.exports = registerationToken
