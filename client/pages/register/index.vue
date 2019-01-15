<template>
  <section class="container">
    <div>
        Registeration
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
          <label for="password re-entry">
            Re-enter Password
            <input v-model="passwordReEnter" type="password" name="passwordReEnter" placeholder="Please re-enter your password">
          </label>
          <br>
          <button>Register</button>
        </form> 
    </div>
  </section>
</template>

<script>
import gql from "graphql-tag";
import apolloClient from "~/plugins/apolloClient.js"
// TODO: Improve this -barely working- form
// TODO: add some error handling

export default {
  data(){
    return{
      email:"",
      password:"",
      passwordReEnter:""
    }
  },

  methods:{
    async onSubmit(){
      const mutation = gql`
        mutation register($email: String!, $password: String!){
          register(email: $email, password: $password){
            id
          }
        }
      `

      const res = await apolloClient.mutate({
        mutation,
        variables: { email:this.email, password:this.password }
      })

      // TODO: redirect or display on succcess or failure
      this.$router.push("verification");
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

