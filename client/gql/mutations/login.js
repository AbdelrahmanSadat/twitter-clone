import gql from "graphql-tag"

const query = gql`
    mutation login($email: String!, $password: String!){
        login(email: $email, password: $password)
    }
`

export default query