import gql from "graphql-tag"

const query = gql`
    query{
        currentUser{
            id,
            timeline{
                text,
                image,
                id,
                author{
                    email,
                    id
                }
            }
        }
    }
`

export default query