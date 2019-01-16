import gql from "graphql-tag";
const mutation = gql`
    mutation register($email: String!, $password: String!){
        register(email: $email, password: $password){
        id
        }
    }
`
export default mutation;