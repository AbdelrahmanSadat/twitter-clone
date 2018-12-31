const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{ type: String, unique: true, dropdups: true, required: true},
    password: { type: String, required: true },
    verificationCode: {type: Number},
    isVerified: { type: Boolean, default: false},
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}]
});

userSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password'))
    return next();

  bcrypt.hash(user.password, 10)
  .then(function(hashedPassword){
    user.password = hashedPassword
    return next();
  })
  .catch(function(err){
    return next(err);
  })
});

module.exports = mongoose.model('User', userSchema);
