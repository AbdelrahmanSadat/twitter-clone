const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    text: { type: String },
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: { type: Date, default: Date.now()}
},{
  timestamps: true
});

module.exports = mongoose.model('Tweet', tweetSchema);
