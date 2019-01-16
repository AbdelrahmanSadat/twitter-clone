import gql from 'graphql-tag'

const query = gql`
    query user($id: ID!){
        user(id: $id){
        email,
        tweets{
            id,
            text,
            image,
            author{
            email,
            id
            }
        },
        favorites{
            id,
            text,
            image,
            author{
            email,
            id
            }
        },
        following{
            email,
            id
        },
        followers{
            email,
            id
        }
        }
    }
`

export default query