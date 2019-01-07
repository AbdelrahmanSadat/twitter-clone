const express = require('express');
const router = express.Router();
const graphqlHTTP = require('express-graphql');
const schema = require('../schema');
const jwt = require('express-jwt');
const helpers = require("../helpers");

router.use('/graphql', jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired:false
}));

/* GET home page. */
router.get('/', (req, res)=>{
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
router.get('/upload', (req, res)=>{
  res.set('Content-Type', 'text/html');
  res.send(new Buffer('<form action="/upload" method="POST" enctype="multipart/form-data"><input type="file" name="image" /><input type="submit"/></form>'));
});

router.post('/upload', helpers.upload.single('image'), (req, res)=>{
  res.send({filename: req.file.filename});
  //   res.set('Content-Type', 'text/html');
  //   res.send(new Buffer(`<img src="http://localhost:3000/${req.file.filename}"/>`));
});

module.exports = router;
