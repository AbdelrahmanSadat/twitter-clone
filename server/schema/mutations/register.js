const graphql = require("graphql");
const admin = require("firebase-admin");
const helpers = require("../../helpers");
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
