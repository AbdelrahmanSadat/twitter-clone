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
import gql from "graphql-tag";
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
      const mutation = gql`
        mutation follow($toFollowId: ID!){
          follow(toFollowId: $toFollowId){
            followedUser{
              email,
              id
            },
            notified,
            message
          }
        }
      `
      const res = await apolloClient.mutate({
        mutation,
        variables:{ toFollowId: id}
      })
      console.log(res)
    }
  },
  async mounted(){
    const query = gql`
      query{
        user1: user(email:"b0@b.b"){
          email,
          id
        },
        user2: user(email:"b1@b.b"){
          email,
          id
        },
        user3: user(email:"b2@b.b"){
          email,
          id
        }
      }
    `
    const res = await apolloClient.query({ 
      query
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
