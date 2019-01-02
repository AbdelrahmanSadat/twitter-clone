const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    text: { type: String },
    image: { type: String },
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},{
  timestamps: true
});

module.exports = mongoose.model('Tweet', tweetSchema);
