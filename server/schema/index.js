const graphql = require("graphql");
const graphqlISODate = require("graphql-iso-date");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const helpers = require("../helpers");
const User = require("../models/user.js");
const Tweet = require("../models/tweet.js");

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
        // TODO: specify that at least one of the arguments needs
        // to be nonNull
        args: { email:{type:GraphQLString}, id:{type:GraphQLID} },
        resolve(parent, args){
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
      args:{ text: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args, req){
        if(!req.user)
          throw new Error("You must be logged in.");
        const tweet = new Tweet({ text: args.text, authorID: req.user.id});
        const savedTweet = await tweet.save();
        savedTweet.authorID = savedTweet.authorID.toJSON();
        return savedTweet;
      }
    },
    follow:{
      type: UserType,
      args:{ toFollowId: {type: new GraphQLNonNull(GraphQLID) } },
      async resolve(parent, args, req){
        if(!req.user)
          throw new Error("You must be logged in.");
        if(req.user.id == args.toFollowId)
          throw new Error("You can't follow yourself, you narcissistic bastard.");
        const user = await User.findById(req.user.id);
        user.following.push(args.toFollowId);
        return user.save();
      }
    },
    favorite:{
      type: UserType,
      args: { tweetId: {type: new GraphQLNonNull(GraphQLID)} },
      async resolve(parent, args, req){
        if(!req.user)
          throw new Error("You must be logged in.");
        const user = await User.findById(req.user.id);
        user.favorites.push(args.tweetId);
        return user.save();
      }
    },
    // TODO: Send email for verification on registering
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
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
