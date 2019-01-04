const graphql = require("graphql");
const helpers = require("../../helpers");
const User = require("../../models/user.js");

const {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
 } = graphql;


const sendVerificationEmail = {
  type: GraphQLString,
  args:{ id: {type: new GraphQLNonNull(GraphQLID)} },
  async resolve(parent, args){
    const user = await User.findById(args.id);
    if(user.isVerified || !user.verificationCode)
      throw new Error("User already verified, or no verification code was found");
    const mailOptions={
      from:process.env.EMAIL_ID,
      to: user.email,
      subject: "Verification",
      html:"Your verification code is "+user.verificationCode
    }
    const info = await helpers.transporter.sendMail(mailOptions);
    return "Email sent";
  }
}

module.exports = sendVerificationEmail
