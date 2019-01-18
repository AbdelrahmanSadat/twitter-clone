<template>
    <section class="container">
      <div>
          <h1>Timeline</h1>
          <Tweets v-bind:tweets="timeline"/> 
          <br>
      </div>
    </section>
</template>

<script>
import Tweets from "@/components/Tweets.vue"
import queries from "@/gql/queries"
import query from "@/helpers/query"

// TODO: add some error handling
// TODO: display images properly
export default {
  components:{
    Tweets
  },
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
