import gql from "graphql-tag"

const query = gql`
      query{
        user1: user(email:"b0@b.b"){
          email,
          id
        },
        user2: user(email:"b1@b.b"){
          email,
          id
        },
        user3: user(email:"b2@b.b"){
          email,
          id
        }
      }
`

export default query