const graphql = require("graphql");
const admin = require("firebase-admin");
const helpers = require("../../helpers");
const validator = require("validator");
const User = require("../../models/user.js");
const UserType = require("../types/UserType");

const {
  GraphQLString,
  GraphQLNonNull
 } = graphql;


const register = {
  type: UserType,
  args: {
    email:{ type: new GraphQLNonNull(GraphQLString)},
    password: { type: new GraphQLNonNull(GraphQLString)}
  },
  async resolve(parent, args, req){
    if(!validator.isEmail(args.email))
      throw new Error("Please provide a valid email address");
    if(args.password.length<8)
      throw new Error("Password should be at least 8 characters");
    const user = await User.create({
      email: args.email,
      password: args.password,
      verificationCode: helpers.randomCode()
    });

    const mailOptions={
      from:process.env.EMAIL_ID,
      to: user.email,
      subject: "Verification",
      html:"Your verification code is "+user.verificationCode
    }

    const info = await helpers.transporter.sendMail(mailOptions);
    // TODO: what to return on registering?
    return user
  }
}

module.exports = register;
