<template>
    <section class="container">
      <div v-for="(user, index) in users" :key="index">
        <p>{{user.email}}</p>
        <button v-on:click="follow(user.id)">Follow</button>
        <nuxt-link :to="'/profile/'+user.id"> <button>Profile</button> </nuxt-link>
        <br/>
      </div>
    </section>
</template>

<script>
import {queries, mutations} from "@/gql";
import {query, mutate} from '@/helpers'

// TODO: add some error handling
// TODO: display images properly
// TODO: display success or failure of follow
export default {
  data(){
    return{
        users:[]
    }
  },
  methods:{
    async follow(id){
      const variables = { toFollowId: id};
      const refetchQueries = [{query: queries.timeline}, {query: queries.currentUserProfile}]
      const awaitRefetchQueries = true
      const options = { mutation: mutations.follow, variables, refetchQueries, awaitRefetchQueries}
      const res = await mutate(this.$apolloClient, options)
      .catch((err)=>{ this.$store.dispatch("setError", err.message) } )
      if(res) console.log(res)
    }
  },
  async asyncData({app, error}){
    const options = { query: queries.simpleUserList }
    const res = await query(app.$apolloClient, options)
    .catch((err)=>{ error( { statusCode:400, message: err.message } ) } )
    if(res){
      const users = [res.data.user1, res.data.user2, res.data.user3]
      return{
        users
      }
    }
  }
}
</script>

<style scoped>
/* TODO: remove this and add some styling */
.container {
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
