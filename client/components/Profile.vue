<template>
    <section class="container">
      <div>
          <h1>Profile</h1>
          <br>
          <h2>Email:</h2>
          <p>{{user.email}}</p>
          <div v-if="displayFollowButton">
            <button v-on:click="follow(user.id)" type="button">Follow</button>
            <br>
          </div>
          <br>
          <h2>Followers</h2>
          <div v-for="(follower, index) in user.followers" :key="'follower'+index">
            <div class="card" style="width: 18rem;">
              <div class="card-body">
                  <nuxt-link :to="'/profile/'+follower.id">
                    <h6 class="card-subtitle mb-2 text-muted">
                      {{follower.email}}
                    </h6>
                  </nuxt-link>
              </div>
            </div>
            <br>
          </div>
          <br>
          <h2>Following</h2>
          <div v-for="(following, index) in user.following" :key="'following'+index">
            <div class="card" style="width: 18rem;">
              <div class="card-body">
                <nuxt-link :to="'/profile/'+following.id">
                  <h6 class="card-subtitle mb-2 text-muted">
                    {{following.email}}
                  </h6>
                </nuxt-link>
              </div>
            </div>
            <br>
          </div>
          <br>
          <h2>Tweets</h2>
          <Tweets :tweets="user.tweets"/>
          <br>
          <h2>Favorites</h2>
          <Tweets :tweets="user.favorites"/>
          <br>
      </div>
    </section>
</template>

<script>
import Tweets from "./Tweets.vue"
import mutations from '@/gql/mutations'
import mutate from '@/helpers/mutate'

export default {
    props:{
        user: Object,
        displayFollowButton: Boolean
    },
    components:{
        Tweets
    },
    methods:{
        async follow(id){
            const variables = { toFollowId: id };
            const res = await mutate(this.$apolloClient, mutations.follow, variables)
            console.log(res)
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