const glue = require("schemaglue")
const { makeExecutableSchema } = require('graphql-tools')

const options = { ignore: '**/index.js' }
const { schema, resolver } = glue('src/graphql', options)

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolver
})

module.exports = executableSchema;