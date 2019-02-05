import vue from 'vue';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
// TODO: use a fetch compatible with older browsers?
import fetch from 'node-fetch';
import * as Cookies from 'js-cookie' 




// TODO: inject apolloClient into the vue instance...
export default ({req}, inject)=>{
  const httpLink = new HttpLink({ uri: process.env.API_BASE_URL+"/graphql", fetch: fetch});
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
    link: authLink.concat(httpLink),
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