const express = require('express');
const router = express.Router();
const graphqlHTTP = require('express-graphql');
const schema = require('../schema');
const jwt = require('express-jwt');

router.use('/graphql', jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired:false
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Express Server Running");
});

router.get('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

router.post('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: false
}));

module.exports = router;
