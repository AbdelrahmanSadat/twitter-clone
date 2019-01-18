<template>
    <section>
      <Profile :displayFollowButton="true" :user="user"/>
    </section>
</template>

<script>
import Profile from "@/components/Profile.vue"
import queries from "@/gql/queries";
import query from "@/helpers/query"

// TODO: add some error handling
// TODO: display images properly
export default {
  components:{
    Profile
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
  async asyncData({app, params}){
    const variables = { id: params.id }  
    const res = await query(app.$apolloClient, queries.userProfile, variables)
    return{
      user: res.data.user
    }
  }
}
</script>