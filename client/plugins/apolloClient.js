import vue from 'vue';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
// TODO: use a fetch compatible with older browsers?
import fetch from 'node-fetch';
import * as Cookies from 'js-cookie' 


const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql', fetch: fetch});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(Cookies.get("vuex")).token;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const apolloClient = new ApolloClient({
  // Use an environment variable for the uri
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// TODO: inject apolloClient into the vue instance...
export default apolloClient


// Injection:

// function sayHi(){
//   console.log("helloooo")
// }

//These two methods are equivalent? 
// sayHi is accessible using this.$sayHi
// export default ({ app }, inject) => {
//   inject('sayHi', sayHi)
// }

// vue.prototype.$sayHi = sayHi