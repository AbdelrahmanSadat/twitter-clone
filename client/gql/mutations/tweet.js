import gql from "graphql-tag"

const query = gql`
    mutation tweet($text: String, $image: String){
        tweet(text: $text, image: $image){
            text,
            image,
            author{
                id,
                email
            }
        }
    }
`

export default query