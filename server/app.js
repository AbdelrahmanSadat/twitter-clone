var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require("express-session")
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.once("open", ()=>{
  console.log("Connected to the database");
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport configuration
const User = require('./models/user');
app.use(session({ secret: "supersecretsessionsecret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
