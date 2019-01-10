const graphql = require("graphql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user.js");

const {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
 } = graphql;


const verify = {
  type: GraphQLString,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) } ,
    password: { type: new GraphQLNonNull(GraphQLString)},
    verificationCode: { type: new GraphQLNonNull(GraphQLInt) }
  },
  async resolve(parent, args){
    const user = await User.findOne({email: args.email});
    if(!user)
      throw new Error("No user was found with this email");
    if(user.isVerified)
      throw new Error("User already verified");
    const passwordMatched = await bcrypt.compare(args.password, user.password);
    if(!passwordMatched)
      throw new Error("Password is incorrect");
    if(user.verificationCode != args.verificationCode)
      throw new Error("Verification code incorrect");

    user.verificationCode=undefined;
    user.isVerified=true;
    const verifiedUser = await user.save();
    // TODO: set audience and issuer fields on token?
    return jwt.sign(
      {id: user.id, email: user.email},
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )
  }
}

module.exports = verify
