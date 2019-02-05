<template>
    <section>
      <Profile :displayFollowButton="false" :user="user"/>
    </section>
</template>

<script>
import Profile from "@/components/Profile.vue"
import queries from '@/gql/queries'
import query from '@/helpers/query'

// TODO: add some error handling
// TODO: display images properly
export default {
  components:{ 
    Profile,
  },
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
  async asyncData({app}){
    const options = { query: queries.currentUserProfile }
    const res = await query(app.$apolloClient, options)
    return{
      user: res.data.currentUser
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
