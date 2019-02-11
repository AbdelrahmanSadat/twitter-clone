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
    // Check if there's a user with this id
    const user = await User.findById(args.userId);
    if(!user)
      throw new Error("Incorrect user id");

    // Check if the token already exists. If so, and the user is different, delete the doc
    let existingToken = await RegisterationToken.findOne({token: args.token});
    if(existingToken){
      if(existingToken.userId == user.userId)
        throw new Error("Token already registered")
      else
        await existingToken.remove()
    }
    
    // Check if the user already had a token. if so, and the token is different, overwrite the old token
    existingToken = await RegisterationToken.findOne({userId: args.userId});
    if(existingToken){
      if(existingToken.token == args.token)
        throw new Error("Token already registered");
      else{
        existingToken.token = args.token;
        await existingToken.save();
        return true
      }
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
