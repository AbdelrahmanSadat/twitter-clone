import gql from "graphql-tag"

const mutation = gql`
    mutation registerationToken($token: String!, $userId: ID!){
        registerationToken(token: $token, userId: $userId)
    }
`

export default mutation