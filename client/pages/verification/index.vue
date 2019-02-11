<template>
  <section class="container">
    <div>
        Verification
        <form v-on:submit.prevent="onSubmit" method="POST">
          <label>
            Email
            <input v-model="email" type="email" name="email" placeholder="example@example.com" >
          </label>
          <br>
          <label>
            Password
            <input v-model="password" type="password" name="password" placeholder="Eight or more characters">
          </label>
          <br>
          <label>
            Verification Code
            <input v-model="verificationCode" type="number" name="verificationCode">
          </label>
          <br>
          <button>Verify</button>
        </form> 
    </div>
  </section>
</template>

<script>
import {queries, mutations } from "@/gql"
import mutate from "@/helpers/mutate"

// TODO: add some error handling
export default {
  data(){
    return{
      email:"",
      password:"",
      verificationCode:""
    }
  },
  methods:{
    async onSubmit(){
      // TODO: redirect or display on success and error
      const variables = { 
        email:this.email, 
        password:this.password, 
        verificationCode: parseInt(this.verificationCode) 
      }
      // const refetchQueries = [{query: queries.timeline}, {query: queries.currentUserProfile}]
      // const awaitRefetchQueries = true
      const options = { mutation: mutations.verification, variables }
      const login = await mutate(this.$apolloClient, options)
      .catch((err)=>{ this.$store.dispatch("setError", err.message) } )
      if(login){
        await this.$store.dispatch("setToken", login.data.verify);

        options = { query: queries.currentUser }
        const user = await query(this.$apolloClient, options)

        const messaging = firebase.messaging();
        const token = await messaging.getToken();

        variables = { userId: user.data.currentUser.id, token }
        options = { mutation: mutations.registerationToken, variables }
        mutate(this.$apolloClient, options )

        this.$router.push("/timeline");
      }
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

