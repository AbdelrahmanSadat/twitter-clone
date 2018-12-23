var express = require('express');
var router = express.Router();
var graphqlHTTP = require('express-graphql');
var schema = require('../schema');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
