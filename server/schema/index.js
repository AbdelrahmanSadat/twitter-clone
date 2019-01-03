const graphql = require("graphql");
const graphqlISODate = require("graphql-iso-date");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const helpers = require("../helpers");
const User = require("../models/user.js");
const Tweet = require("../models/tweet.js");
const RegisterationToken = require("../models/registerationToken");

// some js destructuring
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
 } = graphql;

 const {
   GraphQLDate,
   GraphQLTime,
   GraphQLDateTime
 } = graphqlISODate;

// TODO: Error handling

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({
    id: {type: GraphQLID},
    email: {type: GraphQLString},
    isVerified: {type: GraphQLBoolean},
    following: {
      type: new GraphQLList(UserType),
      async resolve(parent, args){
        const user = await User.findById(parent.id).populate("following");
        return user.following;
      }
    },
    followers: {
      type: new GraphQLList(UserType),
      async resolve(parent, args){
        const followers = await User.find({ following: parent.id });
        return followers;
      }
    },
    tweets:{
      type: new GraphQLList(TweetType),
      async resolve(parent, args){
        const tweets = await Tweet.find({authorID: parent.id});
        return tweets;
      }
    },
    timeline:{
      type: new GraphQLList(TweetType),
      async resolve(parent, args){
        const userIDList = parent.following;
        userIDList.push(parent.id);
        const timeline = await Tweet
        .find({ authorID: { $in: userIDList}})
        .sort({updatedAt: "desc"})
        .exec();
        return timeline;
      }
    },
    favorites:{
      type: new GraphQLList(TweetType),
      async resolve(parent, args){
        const favorites = await Tweet
        .find({_id: {$in: parent.favorites}})
        .sort({updatedAt: "desc"})
        .exec();
        return favorites;
      }
    }
  })
});

const TweetType = new GraphQLObjectType({
  name: 'Tweet',
  fields: ()=>({
    id: {type: GraphQLID},
    authorID: {type: GraphQLID},
    text: {type: GraphQLString},
    image: {type: GraphQLString},
    createdAt: {type: GraphQLDateTime},
    updatedAt: {type: GraphQLDateTime},
    author: {
      type: UserType,
      resolve(parent, args){
        return User.findById(parent.authorID);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        type: UserType,
        args: { email:{type:GraphQLString}, id:{type:GraphQLID} },
        resolve(parent, args){
          if(!args.email && !args.id)
            throw new Error("Please provide an argument");
          if(args.id)
            return User.findById(args.id);
          else
            return User.findOne({email: args.email});
        }
      },
      currentUser:{
        type: UserType,
        async resolve(parent, args, req){
          if(!req.user)
            throw new Error("You must be logged in.");
          const user = await User.findById(req.user.id);
          return user;
        }
      },
      tweet:{
        type: TweetType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve(parent, args){
          return Tweet.findById(args.id);
        }
      }
    }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields:{
    tweet:{
      type: TweetType,
      args:{
        text: { type: GraphQLString },
        image: { type: GraphQLString }
      },
      async resolve(parent, args, req){
        if(!req.user)
          throw new Error("You must be logged in.");
        if(!args.text && !args.image)
          throw new Error("No arguments given");
        const tweet = new Tweet({
          text: args.text,
          image: args.image,
          authorID: req.user.id
        });
        const savedTweet = await tweet.save();
        savedTweet.authorID = savedTweet.authorID.toJSON();
        return savedTweet;
      }
    },
    follow:{
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
        if(!followedUser)
          throw new Error("The user you're trying to follow doesn't exist.");
        // Check if user already followed
        const user = await User.findById(req.user.id);
        if(user.following.toString().includes(args.toFollowId))
          throw new Error("Already following this user");

        // Add a user to follow
        user.following.push(args.toFollowId);
        const savedUser = await user.save();

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
    },
    favorite:{
      type: new GraphQLObjectType({
        // TODO: change name
        name: "favoriteResponse",
        fields:{
          tweet: {type: TweetType},
          notified: {type: GraphQLBoolean}
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

        // Send a notification to the followed user
        // If the user wasn't notified successfully, set "notified" to false
        try{
          var notified = true;
          const tweetAuthor = await user.findById(favoritedTweet.authorID);
          const registerationToken = await RegisterationToken.find({
            userId: tweetAuthor._id
          });
          const message = {
            data:{
              favoritedBy:{ id: tweetAuthor._id, email: tweetAuthor.email },
              tweetId: args.tweetId
            },
            token: registerationToken.token
          }
          const sentMessage = await admin.messaging().send(message);
        }catch(error){
          if(error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered')
            await registerationToken.remove();
          notified=false
        }
        return {tweet: favoritedTweet, notified: notified};
      }
    },
    register:{
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
        // TODO: set audience and issuer fields on token?
        // TODO: what to return on registering?
        return user
      }
    },
    // TODO: Should login be a mutation?
    login:{
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
    },
    // TODO: should this be a mutation?
    sendVerificationEmail:{
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
    },
    verify:{
      type: GraphQLString,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) } ,
        password: { type: new GraphQLNonNull(GraphQLString)},
        verificationCode: { type: new GraphQLNonNull(GraphQLInt) }
      },
      async resolve(parent, args){
        const user = await User.findOne({email: args.email});
        if(!user)
          throw new Error("No user was found with this id");
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
    },
    registerationToken:{
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
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
