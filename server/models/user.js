const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{ type: String, unique: true, dropdups: true, required: true},
    verificationCode: {type: Number},
    isVerified: { type: Boolean, default: false},
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}]
});

userSchema.plugin(
  passportLocalMongoose,
  {
    usernameField: "email",
    errorMessages:{
      UserExistsError: "A user with the same email already exists",
      MissingUsernameError: 'No email was given'
    }
  }
);

module.exports = mongoose.model('User', userSchema);
