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
  async asyncData({app, params, error}){
    const variables = { id: params.id }
    const options = { query: queries.userProfile, variables }
    const res = await query(app.$apolloClient, options)
    .catch((err)=>{ error( { statusCode:400, message: err.message } ) } )
    if(res) return{ user: res.data.user }
  }
}
</script>