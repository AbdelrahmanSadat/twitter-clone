import { ApolloLink, split } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
// TODO: use a fetch compatible with older browsers? (isomorphic-fetch)?
import fetch from 'node-fetch';
import * as Cookies from 'js-cookie';




export default ({req}, inject)=>{
  const httpLink = new HttpLink({ uri: process.env.API_BASE_URL+"/graphql", fetch: fetch});
  // WS link should only run in the browser
  const wsLink = process.client? new WebSocketLink({
    uri: process.env.WEBSOCKET_URL,
    options: {
      reconnect: true,
      reconnectionAttempts: 10,
      // connectionParams is a function to delay execution(thunk),
      // useful in case the user logs in after the app initialises
      connectionParams: () => ({
        authToken: JSON.parse(Cookies.get("vuex")).token
      })
      
      // {
      //   authToken: JSON.parse(Cookies.get("vuex")).token
      // },
    }
  }) : null ;
  // Will only split in the browser
  const link = process.client? split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  ) : httpLink ;
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from cookie if it exists
    var token;
    if(process.client){
      const cookie = Cookies.get("vuex");
      if(cookie)
        token = JSON.parse(cookie).token;
    }
    else{
      const cookie = req.cookies.vuex;
      if(cookie)
        token = JSON.parse(cookie).token;
    }
      
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  

  const apolloClient = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache(),
    ssrMode: process.server
  });

  inject('apolloClient', apolloClient)

}


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