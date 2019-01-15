<template>
  <section class="container">
    <div>
        Login
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
          <button>Login</button>
        </form>
    </div>
  </section>
</template>

<script>
import gql from "graphql-tag";
import apolloClient from "~/plugins/apolloClient.js"

// TODO: add some error handling
export default {
  data(){
    return{
      email:"",
      password:""
    }
  },
  methods:{
    async onSubmit(){
      const mutation = gql`
        mutation login($email: String!, $password: String!){
          login(email: $email, password: $password)
        }
      `
      
      // TODO: redirect or display on success and error
      const res = await apolloClient.mutate({
        mutation,
        variables: { email:this.email, password:this.password }
      })
      
      // TODO: redirect or display on success and error
      console.log("Submitted")
      await this.$store.dispatch("setToken", res.data.login);
      this.$router.push("timeline");
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

