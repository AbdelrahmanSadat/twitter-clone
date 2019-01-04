const graphql = require("graphql");
const {
  GraphQLObjectType
 } = graphql;

const tweet = require("./tweet");
const follow = require("./follow");
const favorite = require("./favorite");
const register = require("./register");
const login = require("./login");
const sendVerificationEmail = require("./sendVerificationEmail");
const verify = require("./verify");
const registerationToken = require("./registerationToken");

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields:{
    tweet,
    follow,
    favorite,
    register,
    login,
    sendVerificationEmail,
    verify,
    registerationToken
  }
})

module.exports = Mutation;
