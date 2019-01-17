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
import queries from "@/gql/queries"
import query from "@/helpers/query"

// TODO: add some error handling
// TODO: display images properly
export default {
  data(){
    return{
      timeline:[],
    }
  },
  methods:{
    getImageURL(name){
      return process.env.API_BASE_URL+"/images/"+name
    }
  },
  // async mounted(){
  //   this.timeline = await this.fetchData()
  // },
  async asyncData({app}){
    const res = await query(app.$apolloClient, queries.timeline)
    return{
      timeline: await res.data.currentUser.timeline
    }
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
