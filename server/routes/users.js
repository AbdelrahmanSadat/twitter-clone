const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const router = express.Router();



// function randomCode(){
//   return Math.floor(Math.random()*9000)+1000;
// }

// const smtpTransport = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: process.env.GMAIL_ID,
//         pass: process.env.GMAIL_PASSWORD
//     }
// });
//
//
// router.post('/register', (req, res, next)=> {
//   const code = randomCode();
//   const newUser = new User({email: req.body.email, verificationCode: code});
//   User.register(newUser, req.body.password, (err, addedUser)=>{
//     if(err || !addedUser){
//       return res.status(406).send({err: err});
//     }
//     else{
//       const mailOptions={
//         to: addedUser.email,
//         subject: "Verification",
//         html:"Your verification code is "+code
//       }
//       smtpTransport.sendMail(mailOptions, (err, response)=>{
//         if(err)
//           return res.status(500).send("User created, but email not sent successfully");
//         else
//           return res.status(200).send({user: {email: addedUser.email, id: addedUser._id}});
//       })
//
//     }
//   });
// });
//
// router.post('/login', (req, res)=> {
//   User.findOne({email: req.body.email}, (err, user)=>{
//     if(!user){
//       return res.status(400).send("Email not correct")
//     }
//     if (!user.isVerified)
//       return res.status(401).send("User is not verified");
//     else{
//       passport.authenticate("local")(req, res, ()=>{
//         return res.status(200).send({user:{email: req.user.email, _id: req.user._id}});
//       });
//     }
//   });
// });
//
//
// router.get('/logout', function(req, res) {
//   req.logout();
//   res.status(200).send("Successfully logged out");
// });
//
// router.post('/verify', (req, res)=>{
//   User.findOne({email: req.body.email}, (err, user)=>{
//     if(!user)
//       return res.status(400).send("Email not correct");
//
//     if(user.isVerified)
//       return res.status(400).send("User already Verified");
//
//     if (user.verificationCode == req.body.verificationCode){
//       user.isVerified = true;
//       user.verificationCode = undefined;
//       user.save((err)=>{
//         if(err)
//           return res.status(500).send("Something went wrong with verifying the user");
//         else{
//           return res.status(200).send("User verified");
//         }
//       });
//     }
//     else
//       return res.status(400).send("Verification code incorrect");
//   });
//
// });

module.exports = router;
