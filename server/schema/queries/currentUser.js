const User = require("../../models/user.js");
const UserType = require("../types/UserType");

const currentUser = {
  type: UserType,
  async resolve(parent, args, req){
    if(!req.user)
      throw new Error("You must be logged in.");
    const user = await User.findById(req.user.id);
    return user;
  }
}

module.exports = currentUser;
