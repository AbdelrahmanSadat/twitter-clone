var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require("express-session");

require('dotenv').config();

// Firebase setup
var admin = require("firebase-admin");
var serviceAccount = require(process.env.CREDENTIALS_ROUTE);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.once("open", ()=>{
  console.log("Connected to the database");
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads/images')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
