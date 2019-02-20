const admin = require("firebase-admin");
const User = require("../../../../models/user.js");
const RegisterationToken = require("../../../../models/registerationToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helpers = require("../../../../helpers");
const validator = require("validator");

exports.resolver = {
    Mutation:{
        async follow(_, args, req){
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
                const registerationToken = await RegisterationToken.findOne({
                userId: followedUser._id
                });
                const message = {
                data:{ 
                    followerId:followedUser._id.toString(), 
                    followerEmail: followedUser.email  
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
                responseMessage = error.message
            }
            return {followedUser, notified, message: responseMessage};
        },

        async login(_, args){
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
        },

        async register(_, args){
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
            return user
        },

        async registerationToken(_, args){
            // Check if there's a user with this id
            const user = await User.findById(args.userId);
            if(!user)
            throw new Error("Incorrect user id");

            // Check if the token already exists. If so, and the user is different, delete the doc
            let existingToken = await RegisterationToken.findOne({token: args.token});
            if(existingToken){
            if(existingToken.userId == user.id)
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
        },

        async sendVerificationEmail(_, args){
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
        },

        async verify(parent, args){
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
}