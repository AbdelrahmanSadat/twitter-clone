import gql from "graphql-tag"

const query = gql`
    mutation tweet($text: String, $image: String){
        tweet(text: $text, image: $image){
            text,
            image,
            id,
            author{
                id,
                email
            }
        }
    }
`

export default query