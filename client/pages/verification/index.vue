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
import axios from "axios";
import gql from "graphql-tag";
import { print } from "graphql";

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
    async onSubmit(e){
      const query = gql`
        mutation verify($email: String!, $password: String!, $verificationCode: Int!){
          verify(email: $email, password: $password, verificationCode: $verificationCode)
        }
      `
      const res = await axios({ 
        url: 'http://localhost:4000/graphql',
        method: 'post',
        data: { 
          query: print(query),
          variables: { 
            email:this.email, 
            password:this.password, 
            verificationCode: parseInt(this.verificationCode) 
          }
         },
      })
      // TODO: redirect or display on success and error
      console.log("Submitted")
      this.$store.dispatch("setToken", res.data.data.login);
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

