const Tweet = require('../../../../models/tweet')
const User = require('../../../../models/user')

exports.resolver = {
    Tweet:{
        async author(parent){
            return User.findById(parent.authorId);
        }
    },

    Query:{
        async tweet(parent, args){
            return await Tweet.findById(args.id);
        }
    }
}