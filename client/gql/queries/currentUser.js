import gql from 'graphql-tag'

const query = gql`
query{
    currentUser{
      email,
      id
    }
  }
`

export default query