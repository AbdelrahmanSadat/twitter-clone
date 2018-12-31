var express = require('express');
var router = express.Router();
var graphqlHTTP = require('express-graphql');
var schema = require('../schema');

router.use("/graphql",(req, res, next)=>{
  if(req.isAuthenticated())
    return next();
  else
    res.status(401).send("User not logged in");
})

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

// TODO: remove this route

router.get('/secret',
  (req, res, next)=>{
      if(req.isAuthenticated())
        return next();
      else
        return res.send("Not Authenticated")
  },
  (req, res)=>{
    res.send("Authenticated");
  }
)

module.exports = router;
