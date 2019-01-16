import gql from "graphql-tag"

const query = gql`
    {
        currentUser{
            timeline{
                text,
                image,
                id,
                author{
                    email
                }
            }
        }
    }
`

export default query