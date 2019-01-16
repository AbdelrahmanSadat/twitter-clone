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
import mutations from "@/gql/mutations"
import apolloClient from "~/plugins/apolloClient.js"

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
      const res = await apolloClient.mutate({
        mutation: mutations.verification,
        variables: { 
            email:this.email, 
            password:this.password, 
            verificationCode: parseInt(this.verificationCode) 
          }
      })
      
      console.log("Submitted")
      await this.$store.dispatch("setToken", res.data.verify);
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

