import gql from "graphql-tag"

const query = gql`
    query{
        currentUser{
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