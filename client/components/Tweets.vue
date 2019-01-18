<template>
    <section>
      <div v-for="(tweet, index) in tweets" :key="'tweet'+index">
        <div class="card" style="width: 18rem;">
          <img v-if="tweet.image" :src="getImageURL(tweet.image)" class="card-img-top">
          <div class="card-body">
            <p class="card-text">{{tweet.text}}</p>
            <nuxt-link :to="'/profile/'+tweet.author.id">
              <h6 class="card-subtitle mb-2 text-muted"> {{tweet.author.email}} </h6>
            </nuxt-link>
          </div>
        </div>
        <br>
      </div>
    </section>
</template>

<script>
import queries from "@/gql/queries"
import query from "@/helpers/query"

// TODO: add some error handling
// TODO: display images properly
export default {
  props:[ "tweets" ],
  data(){
    return{

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