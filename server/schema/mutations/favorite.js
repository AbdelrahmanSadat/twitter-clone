const graphql = require("graphql");
const admin = require("firebase-admin");
const User = require("../../models/user.js");
const Tweet = require("../../models/tweet.js");
const TweetType = require("../types/TweetType");
const RegisterationToken = require("../../models/registerationToken");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull
 } = graphql;


const favorite = {
  type: new GraphQLObjectType({
   name: "favoriteResponse",
   fields:{
     tweet: {type: TweetType},
     notified: {type: GraphQLBoolean},
     message: {type: GraphQLString}
   }
  }),
  args: { tweetId: {type: new GraphQLNonNull(GraphQLID)} },
  async resolve(parent, args, req){
   // Check if user is logged in
   if(!req.user)
     throw new Error("You must be logged in.");
   // Check if the tweet id is correct
   const favoritedTweet = await Tweet.findById(args.tweetId);
   if(!favoritedTweet)
     throw new Error("Tweet id incorrect");
   // Check if tweet is already favorited
   const user = await User.findById(req.user.id);
   if(user.favorites.toString().includes(args.tweetId))
     throw new Error("Tweet already favorited")

   // Add favorited tweet to list of favorites
   user.favorites.push(args.tweetId);
   const savedUser = await user.save();

   // TODO: better error handling
   // Send a notification to the followed user
   // If the user wasn't notified successfully, set "notified" to false
   try{
     const tweetAuthor = await user.findById(favoritedTweet.authorId);
     const registerationToken = await RegisterationToken.findOne({
       userId: tweetAuthor._id
     });
     const message = {
       data:{
         favoritedById: tweetAuthor._id.toString(), 
         favoritedByEmail: tweetAuthor.email,
         tweetId: args.tweetId
       },
       token: registerationToken? registerationToken.token : ""
     }
     const sentMessage = await admin.messaging().send(message);
     var notified = true;
     var responseMessage = "Done";
   }catch(error){
     if(error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered')
       await registerationToken.remove();
     notified = false;
     responseMessage = error.message;
   }
   return {tweet: favoritedTweet, notified: notified, message: responseMessage};
  }
}

module.exports = favorite;
