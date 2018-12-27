const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    text: { type: String },
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Tweet', tweetSchema);
