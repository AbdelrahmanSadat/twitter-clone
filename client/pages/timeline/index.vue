<template>
    <section class="container">
      <div>
          <h1>Timeline</h1>
          <br>
          <div v-for="(tweet, index) in timeline" :key="index">
            <h2>{{tweet.author.email}}</h2>
            <p>{{tweet.text}}</p>
            <img v-if="tweet.image" :src="getImageURL(tweet.image)">
          </div>
      </div>
    </section>
</template>

<script>
import gql from "graphql-tag";
import apolloClient from '~/plugins/apolloClient.js'

// TODO: add some error handling
// TODO: display images properly
export default {
  data(){
    return{
      timeline:[],
    }
  },
  methods:{
    async fetchData(store){
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

      const res = await apolloClient.query({ query })
      return res.data.currentUser.timeline
    },
    getImageURL(name){
      return process.env.API_BASE_URL+"/images/"+name
    }
  },
  async mounted(){
    this.timeline = await this.fetchData(this.$store)
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
