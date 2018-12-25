const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{ type: String, unique: true, dropdups: true, required: true},
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
