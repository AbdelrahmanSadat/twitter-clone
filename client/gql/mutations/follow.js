import gql from "graphql-tag"

const query = gql`
    mutation follow($toFollowId: ID!){
        follow(toFollowId: $toFollowId){
            followedUser{
                email,
                id
            },
            notified,
            message
        }
    }
`

export default query