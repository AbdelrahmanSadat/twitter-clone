const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require("express-session");

require('dotenv').config();

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

// Firebase setup
const admin = require("firebase-admin");
const serviceAccount = require(process.env.CREDENTIALS_ROUTE);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

// Connecting to the database
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.once("open", ()=>{
  console.log("Connected to the database");
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads/images')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
