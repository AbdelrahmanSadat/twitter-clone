import gql from "graphql-tag"

const query = gql`
    mutation verify($email: String!, $password: String!, $verificationCode: Int!){
     verify(email: $email, password: $password, verificationCode: $verificationCode)
    }
`

export default query