<template>
    <section class="container">
      <div v-for="(user, index) in users" :key="index">
        <p>{{user.email}}</p>
        <button v-on:click="follow(user.id)">Follow</button>
        <router-link :to="'/profile/'+user.id"> <button>Profile</button> </router-link>
        <br/>
      </div>
    </section>
</template>

<script>
import gql from "@/gql";
import apolloClient from '~/plugins/apolloClient.js'

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
      const res = await apolloClient.mutate({
        mutation: gql.mutations.follow,
        variables:{ toFollowId: id}
      })
      console.log(res)
    }
  },
  async mounted(){
    const res = await apolloClient.query({ 
      query: gql.queries.simpleUserList
    })
    const users = [res.data.user1, res.data.user2, res.data.user3]
    this.users = users;
    console.log(this.users)
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
