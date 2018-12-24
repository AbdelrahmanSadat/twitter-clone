const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

router.post('/register', function(req, res, next) {
  const newUser = new User({email: req.body.email, username: req.body.username});
  User.register(newUser, req.body.password, (err, addedUser)=>{
    if(err || !addedUser)
      res.status(406).send({err: err});
    else{
      passport.authenticate("local")(req, res, ()=>{
        // If this method gets called, authentication was successful
        res.status(201).json({user: {username: addedUser.username, email: addedUser.email, _id: addedUser._id}});
      })
    }
  });
});

router.post('/login', passport.authenticate("local"), (req, res)=> {
  res.status(200).send({user:{username: req.user.username, email: req.user.email, _id: req.user._id}});
});


router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).send("Successfully logged out");
});

module.exports = router;
