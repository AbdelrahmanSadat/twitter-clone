<template>
    <section class="container">
      <div>
          <h1>Profile</h1>
          <br>
          <h2>Email:</h2>
          <p>{{user.email}}</p>
          <br>
          <h2>Followers</h2>
          <p v-for="(follower, index) in user.followers" :key="'follower'+index">{{follower.email}}</p>
          <br>
          <h2>Following</h2>
          <p v-for="(following, index) in user.following" :key="'following'+index">{{following.email}}</p>
          <br>
          <h2>Tweets</h2>
          <div v-for="(tweet, index) in user.tweets" :key="'tweet'+index">
            <p>{{tweet.text}}</p>
            <img v-if="tweet.image" :src="getImageURL(tweet.image)">
          </div>
          <br>
          <h2>Favorites</h2>
          <div v-for="(favorite, index) in user.favorites" :key="'favorite'+index">
            <p>{{favorite.text}}</p>
            <img v-if="favorite.image" :src="getImageURL(favorite.image)">
          </div>
          <br>
      </div>
    </section>
</template>

<script>
import queries from "@/gql/queries";
import query from "@/helpers/query"

// TODO: add some error handling
// TODO: display images properly
export default {
  data(){
    return{
        user:{}
    }
  },
  methods:{
    getImageURL(name){
      return process.env.API_BASE_URL+"/images/"+name
    }
  },
  async asyncData({app, params}){
    const variables = { id: params.id }  
    const res = await query(app.$apolloClient, queries.userProfile, variables)
    return{
      user: res.data.user
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
