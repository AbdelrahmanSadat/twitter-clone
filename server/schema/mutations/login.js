const graphql = require("graphql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helpers = require("../../helpers");
const User = require("../../models/user.js");

const {
  GraphQLString,
  GraphQLNonNull
 } = graphql;


const login = {
  type: GraphQLString,
  args: {
    email:{ type: new GraphQLNonNull(GraphQLString)},
    password: { type: new GraphQLNonNull(GraphQLString)}
  },
  async resolve(parent, args, req){
    const user = await User.findOne({ email: args.email });
    if(!user)
      throw new Error("No user exists with that email.");
    if(!user.isVerified)
      throw new Error("You need to be verified in order to log in");
    const passwordMatched = await bcrypt.compare(args.password, user.password);
    if(!passwordMatched)
      throw new Error("Password incorrect.");

    // TODO: set audience and issuer fields on token?
    return jwt.sign(
      {id: user.id, email: user.email},
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )
  }
}

module.exports = login;
