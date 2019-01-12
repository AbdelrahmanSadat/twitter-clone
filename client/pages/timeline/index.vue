<template>
    <section class="container">
      <div>
          <h1>Timeline</h1>
          <br>
          <div v-for="tweet in timeline" :key="tweet.id">
            <h2>{{tweet.author.email}}</h2>
            <p>{{tweet.text}}</p>
          </div>
      </div>
    </section>
</template>

<script>
import axios from "axios";
import gql from "graphql-tag";
import { print } from "graphql";

const fetchData = async function(store){
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

  const res = await axios({
    url: 'http://localhost:4000/graphql',
    method: 'post',
    headers:{
      "Authorization": "Bearer "+store.state.token
    },
    data: {
      query: print(query)
    }
  })
  return res.data.data.currentUser.timeline
}





// TODO: add some error handling
export default {
  data(){
    return{
      timeline:[],
    }
  },
  methods:{

  },
  // async asyncData({ store }){
  //   return{
  //     timeline: await fetchData(store).catch(e=>console.log("something went wrong")),
  //   }
  // }
  async mounted(){
    this.timeline = await fetchData(this.$store)
  }
}
</script>

<style scoped>
/* TODO: remove this and add some styling */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
