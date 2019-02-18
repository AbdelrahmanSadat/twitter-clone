const { 
    GraphQLDate, 
    GraphQLTime, 
    GraphQLDateTime 
} = require("graphql-iso-date")

exports.resolver = {
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime
}
