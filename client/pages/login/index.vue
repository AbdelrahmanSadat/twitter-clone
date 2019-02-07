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
import mutations from '@/gql/mutations'
import mutate from "@/helpers/mutate"

// TODO: add some error handling
export default {
  data(){
    return{
      email:"",
      password:"",
      error:""
    }
  },
  methods:{
    async onSubmit(){      
      const variables = { email:this.email, password:this.password }
      const options = { mutation: mutations.login, variables }
      const res = await mutate(this.$apolloClient, options)
      .catch((err)=>{this.$store.dispatch("setError", err.message)})
      // TODO: redirect or display on success and error
      console.log("Submitted")
      if(res){
        await this.$store.dispatch("setToken", res.data.login);
        this.$router.push("/", ()=>this.$router.go(0));
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

