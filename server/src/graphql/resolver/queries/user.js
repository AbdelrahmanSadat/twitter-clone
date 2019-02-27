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
            // The return object should have the same name as
            // the subscription???
            // see: https://github.com/apollographql/subscriptions-transport-ws/issues/236 
            // and should return the type specified in the schema.
            // in this case, a string
            pubsub.publish('testSubscription', { testSubscription: "shit ran y'all" })
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