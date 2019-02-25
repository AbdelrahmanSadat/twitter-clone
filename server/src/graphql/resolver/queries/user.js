const User = require('../../../../models/user')
const Tweet = require('../../../../models/tweet')
const pubsub = require('../../../../helpers/pubsub')

exports.resolver = {
    User:{
        async following(parent){
            const user = await User.findById(parent.id).populate("following");
            return user.following;
        },
        async followers(parent){
            const followers = await User.find({ following: parent.id });
            return followers;
        },
        async tweets(parent){
            const tweets = await Tweet.find({authorId: parent.id});
            return tweets;
        },
        async timeline(parent){
            const userIDList = parent.following;
            userIDList.push(parent.id);
            const timeline = await Tweet
            .find({ authorId: { $in: userIDList}})
            .sort({updatedAt: "desc"})
            .exec();
            pubsub.publish('testSubscription', { content: "Subscription message"})
            return timeline;
        },
        async favorites(parent){
            const favorites = await Tweet
            .find({_id: {$in: parent.favorites}})
            .sort({updatedAt: "desc"})
            .exec();
            return favorites;
        }
    },

    Query:{
        async user(parent, args){
            if(!args.email && !args.id)
                throw new Error("Please provide an argument");
            if(args.id)
                return await User.findById(args.id);
            else
                return await User.findOne({email: args.email});
        },

        async currentUser(parent, args, req){
            if(!req.user)
            throw new Error("You must be logged in.");
            const user = await User.findById(req.user.id);
            return user;
        }
    }
}