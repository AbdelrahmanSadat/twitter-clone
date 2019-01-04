const graphql = require("graphql");
const admin = require("firebase-admin");
const User = require("../../models/user.js");
const UserType = require("../types/UserType");
const RegisterationToken = require("../../models/registerationToken");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull
 } = graphql;


const follow = {
  type: new GraphQLObjectType({
    // TODO: change name
    name: "followResponse",
    fields:{
      followedUser: {type: UserType},
      notified: {type: GraphQLBoolean}
    }
  }),
  args:{ toFollowId: {type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, args, req){
    // Check if the user is logged in or trying to follow himself
    if(!req.user)
      throw new Error("You must be logged in.");
    if(req.user.id == args.toFollowId)
      throw new Error("You can't follow yourself.");
    // Check if the user they're trying to follow exists
    const followedUser = await User.findById(args.toFollowId);
    if(!followedUser || !followedUser.isVerified)
      throw new Error("The user you're trying to follow doesn't exist, or isn't verified.");
    // Check if user already followed
    const user = await User.findById(req.user.id);
    if(user.following.toString().includes(args.toFollowId))
      throw new Error("Already following this user");

    // Add a user to follow
    user.following.push(args.toFollowId);
    const savedUser = await user.save();

    // TODO: better error handling
    // Send a notification to the followed user
    // If the user wasn't notified successfully, set "notified" to false
    try{
      var notified = true;
      const registerationToken = await RegisterationToken.find({
        userId: followedUser._id
      });
      const message = {
        data:{ follower:{ id: followedUser._id, email: followedUser.email } },
        token: registerationToken.token
      }
      const sentMessage = await admin.messaging().send(message);
    }catch(error){
      if(error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered')
        await registerationToken.remove();
      notified = false;
    }
    return {followedUser: followedUser, notified: notified};
  }
}

module.exports = follow;
