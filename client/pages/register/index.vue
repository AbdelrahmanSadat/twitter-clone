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
import mutations from "@/gql/mutations"
import mutate from "@/helpers/mutate"
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
      const variables = { email:this.email, password:this.password }
      const options = { mutation: mutations.register,fetchPolicy: "no-cache", variables }
      const res = await mutate(this.$apolloClient, options)
      .catch((err)=>{ this.$store.dispatch("setError", err.message) } )
      if(res) this.$router.push("verification");
      // TODO: redirect or display on succcess or failure
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

