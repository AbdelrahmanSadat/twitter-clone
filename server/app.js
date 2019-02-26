const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const glue = require('schemaglue');
const jwt = require('jsonwebtoken');

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
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors( {origin:[process.env.CLIENT_URL], methods: "GET,POST,PUT,DELETE", credentials:true} ));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// Graphql / ApolloServer setup
const options = { ignore: '**/index.js' };
const { schema, resolver } = glue('src/graphql', options);
// TODO: pass only the needed data to the context, instead of the whole req object
const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers: resolver,
    context: async( {req} )=>{
      return req
    },
    subscriptions: {
      onConnect(connectionParams, webSocket){
        // if (connectionParams.authToken) {
        //   return validateToken(connectionParams.authToken)
        //     .then(findUser(connectionParams.authToken))
        //     .then(user => {
        //       return {
        //         currentUser: user,
        //       };
        //     });
        // }
        return validateToken(connectionParams.authToken)
      }
    }
});
apolloServer.applyMiddleware({ app });

module.exports = {app, apolloServer};


// TODO: move
const validateToken = async (token)=>{
  return await jwt.verify(token, process.env.JWT_SECRET);
}