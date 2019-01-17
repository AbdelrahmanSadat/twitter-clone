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
      const res = await mutate(this.$apolloClient, mutations.follow, variables)
      console.log(res)
    }
  },
  async asyncData({app}){
    const res = await query(app.$apolloClient, queries.simpleUserList)
    const users = [res.data.user1, res.data.user2, res.data.user3]
    return{
      users
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
